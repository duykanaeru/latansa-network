// WhatsApp service for client-side operations
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
)

export interface WhatsAppMessage {
  id: string
  customer_id: string
  phone_number: string
  message_type: 'billing_reminder' | 'payment_confirmation' | 'overdue_notice' | 'general'
  message_content: string
  status: 'pending' | 'sent' | 'delivered' | 'failed'
  sent_at?: string
  delivered_at?: string
  created_at: string
}

export interface WhatsAppBillingStatus {
  id: string
  customer_id: string
  invoice_number: string
  amount: number
  due_date: string
  status: 'pending' | 'reminded' | 'paid' | 'overdue'
  last_reminder_sent?: string
  reminder_count: number
  payment_confirmed_at?: string
  created_at: string
}

export interface WhatsAppSettings {
  id: string
  setting_key: string
  setting_value: string
  description?: string
  is_active: boolean
}

class WhatsAppService {
  // Get all WhatsApp messages
  async getMessages(filters?: { 
    customer_id?: string
    status?: string
    message_type?: string
    limit?: number 
  }) {
    try {
      let query = supabase
        .from('whatsapp_messages')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.message_type) {
        query = query.eq('message_type', filters.message_type)
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data as WhatsAppMessage[]
    } catch (error) {
      console.error('Error fetching messages:', error)
      return []
    }
  }

  // Get billing status records
  async getBillingStatus(filters?: {
    customer_id?: string
    status?: string
    overdue?: boolean
    limit?: number
  }) {
    try {
      let query = supabase
        .from('whatsapp_billing_status')
        .select('*')
        .order('due_date', { ascending: true })

      if (filters?.customer_id) {
        query = query.eq('customer_id', filters.customer_id)
      }
      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.overdue) {
        const today = new Date().toISOString().split('T')[0]
        query = query.lt('due_date', today).neq('status', 'paid')
      }
      if (filters?.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data as WhatsAppBillingStatus[]
    } catch (error) {
      console.error('Error fetching billing status:', error)
      return []
    }
  }

  // Get WhatsApp settings
  async getSettings() {
    try {
      const { data, error } = await supabase
        .from('whatsapp_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_key')

      if (error) throw error
      return data as WhatsAppSettings[]
    } catch (error) {
      console.error('Error fetching settings:', error)
      return []
    }
  }

  // Update WhatsApp setting
  async updateSetting(settingKey: string, settingValue: string) {
    try {
      const { data, error } = await supabase
        .from('whatsapp_settings')
        .update({ setting_value: settingValue })
        .eq('setting_key', settingKey)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating setting:', error)
      throw error
    }
  }

  // Send manual WhatsApp message via Edge Function
  async sendMessage(phoneNumber: string, message: string, messageType: string = 'general') {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-billing', {
        body: {
          action: 'send_message',
          phone_number: phoneNumber,
          message: message,
          message_type: messageType
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }

  // Send billing reminder manually
  async sendBillingReminder(customerId: string, invoiceNumber: string) {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-billing', {
        body: {
          action: 'send_billing_reminder',
          customer_id: customerId,
          invoice_number: invoiceNumber
        }
      })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error sending billing reminder:', error)
      throw error
    }
  }

  // Trigger scheduled reminders manually
  async triggerScheduledReminders() {
    try {
      const { data, error } = await supabase.functions.invoke('whatsapp-scheduler')
      if (error) throw error
      return data
    } catch (error) {
      console.error('Error triggering scheduler:', error)
      throw error
    }
  }

  // Get message statistics
  async getMessageStats() {
    const { data: totalMessages, error: totalError } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact' })

    const { data: sentMessages, error: sentError } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact' })
      .eq('status', 'sent')

    const { data: deliveredMessages, error: deliveredError } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact' })
      .eq('status', 'delivered')

    const { data: failedMessages, error: failedError } = await supabase
      .from('whatsapp_messages')
      .select('id', { count: 'exact' })
      .eq('status', 'failed')

    if (totalError || sentError || deliveredError || failedError) {
      throw totalError || sentError || deliveredError || failedError
    }

    return {
      total: totalMessages?.length || 0,
      sent: sentMessages?.length || 0,
      delivered: deliveredMessages?.length || 0,
      failed: failedMessages?.length || 0
    }
  }

  // Get billing statistics
  async getBillingStats() {
    const { data: totalBills, error: totalError } = await supabase
      .from('whatsapp_billing_status')
      .select('id', { count: 'exact' })

    const { data: pendingBills, error: pendingError } = await supabase
      .from('whatsapp_billing_status')
      .select('id', { count: 'exact' })
      .eq('status', 'pending')

    const { data: paidBills, error: paidError } = await supabase
      .from('whatsapp_billing_status')
      .select('id', { count: 'exact' })
      .eq('status', 'paid')

    const today = new Date().toISOString().split('T')[0]
    const { data: overdueBills, error: overdueError } = await supabase
      .from('whatsapp_billing_status')
      .select('id', { count: 'exact' })
      .lt('due_date', today)
      .neq('status', 'paid')

    if (totalError || pendingError || paidError || overdueError) {
      throw totalError || pendingError || paidError || overdueError
    }

    return {
      total: totalBills?.length || 0,
      pending: pendingBills?.length || 0,
      paid: paidBills?.length || 0,
      overdue: overdueBills?.length || 0
    }
  }
}

export const whatsappService = new WhatsAppService()