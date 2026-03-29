import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { cron } from 'https://deno.land/x/deno_cron@v1.0.0/cron.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Check if auto reminders are enabled
    const { data: settings } = await supabase
      .from('whatsapp_settings')
      .select('setting_value')
      .eq('setting_key', 'auto_reminder_enabled')
      .single()

    if (settings?.setting_value !== 'true') {
      return new Response(JSON.stringify({ message: 'Auto reminders disabled' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get reminder settings
    const { data: reminderDays } = await supabase
      .from('whatsapp_settings')
      .select('setting_value')
      .eq('setting_key', 'reminder_days_before')
      .single()

    const daysBefore = parseInt(reminderDays?.setting_value || '3')
    const reminderDate = new Date()
    reminderDate.setDate(reminderDate.getDate() + daysBefore)
    
    // Get overdue settings
    const { data: overdueDays } = await supabase
      .from('whatsapp_settings')
      .select('setting_value')
      .eq('setting_key', 'overdue_reminder_days')
      .single()

    const daysAfter = parseInt(overdueDays?.setting_value || '1')
    const overdueDate = new Date()
    overdueDate.setDate(overdueDate.getDate() - daysAfter)

    // Send billing reminders for upcoming due dates
    const { data: upcomingBills } = await supabase
      .from('whatsapp_billing_status')
      .select('*')
      .eq('status', 'pending')
      .lte('due_date', reminderDate.toISOString().split('T')[0])
      .is('last_reminder_sent', null)

    // Send overdue notices
    const { data: overdueBills } = await supabase
      .from('whatsapp_billing_status')
      .select('*')
      .eq('status', 'pending')
      .lt('due_date', new Date().toISOString().split('T')[0])

    let sentCount = 0

    // Process upcoming bills
    if (upcomingBills && upcomingBills.length > 0) {
      const { data: template } = await supabase
        .from('whatsapp_settings')
        .select('setting_value')
        .eq('setting_key', 'reminder_template')
        .single()

      for (const bill of upcomingBills) {
        const success = await sendBillingReminder('reminder', bill, template?.setting_value)
        if (success) {
          await supabase
            .from('whatsapp_billing_status')
            .update({
              last_reminder_sent: new Date().toISOString(),
              reminder_count: (bill.reminder_count || 0) + 1,
              status: 'reminded'
            })
            .eq('id', bill.id)
          sentCount++
        }
      }
    }

    // Process overdue bills
    if (overdueBills && overdueBills.length > 0) {
      const { data: overdueTemplate } = await supabase
        .from('whatsapp_settings')
        .select('setting_value')
        .eq('setting_key', 'overdue_template')
        .single()

      for (const bill of overdueBills) {
        if (!bill.last_reminder_sent || 
            new Date(bill.last_reminder_sent) < overdueDate) {
          
          const success = await sendBillingReminder('overdue', bill, overdueTemplate?.setting_value)
          if (success) {
            await supabase
              .from('whatsapp_billing_status')
              .update({
                last_reminder_sent: new Date().toISOString(),
                reminder_count: (bill.reminder_count || 0) + 1,
                status: 'overdue'
              })
              .eq('id', bill.id)
            sentCount++
          }
        }
      }
    }

    return new Response(JSON.stringify({ 
      message: `Sent ${sentCount} billing reminders`,
      upcoming_bills: upcomingBills?.length || 0,
      overdue_bills: overdueBills?.length || 0
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in scheduler:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function sendBillingReminder(type: 'reminder' | 'overdue', bill: any, template: string) {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )

  try {
    // Get customer phone number (assuming it's stored in customer_id for now)
    // In real implementation, you'd join with customers table
    const phoneNumber = bill.customer_id

    // Format message using template
    const message = template
      .replace('{customer_name}', 'Pelanggan') // Would get from customers table
      .replace('{amount}', formatCurrency(bill.amount))
      .replace('{due_date}', formatDate(bill.due_date))
      .replace('{invoice_number}', bill.invoice_number)

    const success = await sendWhatsAppMessage(phoneNumber, message)
    
    if (success) {
      // Log the message
      await supabase
        .from('whatsapp_messages')
        .insert({
          customer_id: bill.customer_id,
          phone_number: phoneNumber,
          message_type: type === 'reminder' ? 'billing_reminder' : 'overdue_notice',
          message_content: message,
          status: 'sent',
          sent_at: new Date().toISOString()
        })
    }

    return success
  } catch (error) {
    console.error('Error sending billing reminder:', error)
    return false
  }
}

async function sendWhatsAppMessage(phoneNumber: string, message: string): Promise<boolean> {
  const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error('WhatsApp credentials not configured')
    return false
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: phoneNumber,
          type: 'text',
          text: {
            body: message
          }
        })
      }
    )

    return response.ok
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    return false
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric'
  })
}