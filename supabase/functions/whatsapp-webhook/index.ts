import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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

    if (req.method === 'GET') {
      // Webhook verification for WhatsApp
      const url = new URL(req.url)
      const mode = url.searchParams.get('hub.mode')
      const token = url.searchParams.get('hub.verify_token')
      const challenge = url.searchParams.get('hub.challenge')

      const VERIFY_TOKEN = Deno.env.get('WHATSAPP_VERIFY_TOKEN') || 'your_verify_token'

      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully!')
        return new Response(challenge, { 
          status: 200,
          headers: { 'Content-Type': 'text/plain' }
        })
      } else {
        console.log('Webhook verification failed')
        return new Response('Forbidden', { status: 403 })
      }
    }

    if (req.method === 'POST') {
      const body = await req.json()
      console.log('Received webhook:', JSON.stringify(body, null, 2))

      // Process WhatsApp webhook events
      if (body.entry && body.entry[0] && body.entry[0].changes) {
        const changes = body.entry[0].changes[0]
        
        if (changes.field === 'messages') {
          const value = changes.value
          
          // Handle message status updates
          if (value.statuses) {
            for (const status of value.statuses) {
              await supabase
                .from('whatsapp_messages')
                .update({
                  status: status.status,
                  delivered_at: status.status === 'delivered' ? new Date().toISOString() : null,
                  webhook_data: status
                })
                .eq('id', status.id)
            }
          }

          // Handle incoming messages
          if (value.messages) {
            for (const message of value.messages) {
              const phoneNumber = message.from
              const messageText = message.text?.body || ''
              
              // Check if it's a payment confirmation
              if (messageText.toLowerCase().includes('bayar') || 
                  messageText.toLowerCase().includes('lunas') ||
                  messageText.toLowerCase().includes('transfer')) {
                
                // Try to extract invoice number or amount
                const invoiceMatch = messageText.match(/INV[0-9]+/i)
                const amountMatch = messageText.match(/(\d+\.?\d*)/g)
                
                if (invoiceMatch) {
                  // Update billing status
                  await supabase
                    .from('whatsapp_billing_status')
                    .update({
                      status: 'paid',
                      payment_confirmed_at: new Date().toISOString()
                    })
                    .eq('invoice_number', invoiceMatch[0])
                }
                
                // Send confirmation back
                await sendWhatsAppMessage(phoneNumber, 
                  'Terima kasih! Kami akan memverifikasi pembayaran Anda dan memberikan konfirmasi secepatnya.')
              }
              
              // Log incoming message
              await supabase
                .from('whatsapp_messages')
                .insert({
                  customer_id: phoneNumber,
                  phone_number: phoneNumber,
                  message_type: 'general',
                  message_content: messageText,
                  status: 'received',
                  webhook_data: message
                })
            }
          }
        }
      }

      return new Response('OK', { 
        status: 200,
        headers: corsHeaders 
      })
    }

    return new Response('Method not allowed', { 
      status: 405,
      headers: corsHeaders 
    })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  const WHATSAPP_TOKEN = Deno.env.get('WHATSAPP_ACCESS_TOKEN')
  const PHONE_NUMBER_ID = Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')
  
  if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
    console.error('WhatsApp credentials not configured')
    return
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

    if (!response.ok) {
      console.error('Failed to send WhatsApp message:', await response.text())
    }
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
  }
}