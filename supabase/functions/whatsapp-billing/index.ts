import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WhatsAppMessage {
  to: string;
  type: string;
  text?: {
    body: string;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components: any[];
  };
}

interface BillingReminder {
  customer_id: string;
  customer_name: string;
  phone_number: string;
  amount: number;
  due_date: string;
  invoice_number: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { action, data } = await req.json();

    switch (action) {
      case 'send_reminder':
        return await sendBillingReminder(data);
      case 'send_confirmation':
        return await sendPaymentConfirmation(data);
      case 'schedule_reminders':
        return await scheduleReminders();
      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function sendBillingReminder(reminderData: BillingReminder) {
  const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');
  const whatsappPhoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!whatsappToken || !whatsappPhoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }

  const message: WhatsAppMessage = {
    to: reminderData.phone_number,
    type: "text",
    text: {
      body: `Halo ${reminderData.customer_name}, tagihan internet Anda sebesar Rp ${reminderData.amount.toLocaleString('id-ID')} akan jatuh tempo pada ${new Date(reminderData.due_date).toLocaleDateString('id-ID')}. 

Invoice: ${reminderData.invoice_number}

Silakan lakukan pembayaran untuk menghindari pemutusan layanan. Terima kasih!`
    }
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  );

  const result = await response.json();

  // Log message to database
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  await supabaseClient
    .from('whatsapp_messages')
    .insert({
      customer_id: reminderData.customer_id,
      phone_number: reminderData.phone_number,
      message_type: 'billing_reminder',
      message_content: message.text?.body,
      wa_message_id: result.messages?.[0]?.id,
      status: response.ok ? 'sent' : 'failed',
      amount: reminderData.amount,
      invoice_number: reminderData.invoice_number
    });

  return new Response(
    JSON.stringify({ 
      success: response.ok, 
      messageId: result.messages?.[0]?.id,
      error: response.ok ? null : result.error 
    }),
    { 
      status: response.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function sendPaymentConfirmation(data: {
  customer_id: string;
  customer_name: string;
  phone_number: string;
  amount: number;
  payment_date: string;
  invoice_number: string;
}) {
  const whatsappToken = Deno.env.get('WHATSAPP_TOKEN');
  const whatsappPhoneNumberId = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID');

  if (!whatsappToken || !whatsappPhoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }

  const message: WhatsAppMessage = {
    to: data.phone_number,
    type: "text",
    text: {
      body: `Terima kasih ${data.customer_name}! 

Pembayaran Anda telah diterima:
💰 Jumlah: Rp ${data.amount.toLocaleString('id-ID')}
📅 Tanggal: ${new Date(data.payment_date).toLocaleDateString('id-ID')}
🧾 Invoice: ${data.invoice_number}

Layanan internet Anda akan tetap aktif. Terima kasih atas kepercayaan Anda!`
    }
  };

  const response = await fetch(
    `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    }
  );

  const result = await response.json();

  // Log message to database
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  await supabaseClient
    .from('whatsapp_messages')
    .insert({
      customer_id: data.customer_id,
      phone_number: data.phone_number,
      message_type: 'payment_confirmation',
      message_content: message.text?.body,
      wa_message_id: result.messages?.[0]?.id,
      status: response.ok ? 'sent' : 'failed',
      amount: data.amount,
      invoice_number: data.invoice_number
    });

  return new Response(
    JSON.stringify({ 
      success: response.ok, 
      messageId: result.messages?.[0]?.id 
    }),
    { 
      status: response.ok ? 200 : 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}

async function scheduleReminders() {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Get all unpaid payments due in 3 days
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

  const { data: upcomingPayments, error } = await supabaseClient
    .from('payments')
    .select(`
      *,
      customers (
        id,
        name,
        phone,
        email
      )
    `)
    .eq('status', 'pending')
    .gte('due_date', new Date().toISOString().split('T')[0])
    .lte('due_date', threeDaysFromNow.toISOString().split('T')[0]);

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  const reminders = [];
  
  for (const payment of upcomingPayments || []) {
    if (payment.customers?.phone) {
      const reminderData: BillingReminder = {
        customer_id: payment.customer_id,
        customer_name: payment.customers.name,
        phone_number: payment.customers.phone,
        amount: payment.amount,
        due_date: payment.due_date,
        invoice_number: payment.invoice_number
      };

      reminders.push(sendBillingReminder(reminderData));
    }
  }

  const results = await Promise.allSettled(reminders);
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;

  return new Response(
    JSON.stringify({ 
      sent: successful,
      failed: failed,
      total: upcomingPayments?.length || 0
    }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
}