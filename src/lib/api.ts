/**
 * API Service menggunakan Lovable Cloud (Supabase)
 * Semua data diambil langsung dari database
 */

import { supabase } from "@/integrations/supabase/client";

// ==================== CUSTOMERS API ====================
export const customersAPI = {
  getAll: async (params?: { status?: string; search?: string }) => {
    let query = supabase.from('customers').select('*, packages(name, price)');
    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    if (params?.search) {
      query = query.or(`name.ilike.%${params.search}%,email.ilike.%${params.search}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*, packages(name, price, speed_download, speed_upload, description)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },

  create: async (customerData: {
    name: string; email: string; phone: string; address: string;
    package_id: string; mikrotik_username?: string; user_id?: string;
  }) => {
    const { data, error } = await supabase.from('customers').insert(customerData).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Record<string, any>) => {
    const { data, error } = await supabase.from('customers').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== PACKAGES API ====================
export const packagesAPI = {
  getAll: async (params?: { active?: boolean }) => {
    let query = supabase.from('packages').select('*');
    if (params?.active !== undefined) {
      query = query.eq('is_active', params.active);
    }
    const { data, error } = await query.order('price', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  create: async (pkgData: {
    name: string; speed_download: string; speed_upload: string;
    price: number; description?: string; features?: string[];
  }) => {
    const { data, error } = await supabase.from('packages').insert(pkgData).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Record<string, any>) => {
    const { data, error } = await supabase.from('packages').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase.from('packages').delete().eq('id', id);
    if (error) throw error;
  },
};

// ==================== PAYMENTS API ====================
export const paymentsAPI = {
  getAll: async (params?: { status?: string; customer_id?: string }) => {
    let query = supabase.from('payments').select('*, customers(name, email)');
    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    if (params?.customer_id) {
      query = query.eq('customer_id', params.customer_id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (paymentData: {
    customer_id: string; amount: number; payment_method?: string;
    notes?: string; invoice_number?: string; due_date?: string;
  }) => {
    const { data, error } = await supabase.from('payments').insert(paymentData).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Record<string, any>) => {
    const { data, error } = await supabase.from('payments').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },

  confirm: async (id: string) => {
    const { data, error } = await supabase
      .from('payments')
      .update({ status: 'paid', payment_date: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ==================== TICKETS API ====================
export const ticketsAPI = {
  getAll: async (params?: { status?: string; priority?: string; customer_id?: string }) => {
    let query = supabase.from('tickets').select('*, customers(name, email, phone)');
    if (params?.status && params.status !== 'all') {
      query = query.eq('status', params.status);
    }
    if (params?.priority && params.priority !== 'all') {
      query = query.eq('priority', params.priority);
    }
    if (params?.customer_id) {
      query = query.eq('customer_id', params.customer_id);
    }
    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  create: async (ticketData: {
    customer_id: string; title: string; description: string;
    priority?: string; category?: string;
  }) => {
    const { data, error } = await supabase.from('tickets').insert(ticketData).select().single();
    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Record<string, any>) => {
    const { data, error } = await supabase.from('tickets').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
  },
};

// ==================== STAFF/PROFILES API ====================
export const staffAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .order('created_at', { ascending: false });
    if (error) throw error;
    // Filter to only staff/admin roles
    return (data || []).filter((p: any) => 
      p.user_roles?.some((r: any) => r.role === 'staff' || r.role === 'admin')
    );
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, user_roles(role)')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  },
};

// ==================== DASHBOARD STATS ====================
export const dashboardAPI = {
  getAdminStats: async () => {
    const [customers, payments, tickets] = await Promise.all([
      supabase.from('customers').select('id, status', { count: 'exact' }),
      supabase.from('payments').select('id, amount, status'),
      supabase.from('tickets').select('id, status'),
    ]);

    const totalCustomers = customers.count || 0;
    const activeCustomers = customers.data?.filter(c => c.status === 'active').length || 0;
    const paidPayments = payments.data?.filter(p => p.status === 'paid') || [];
    const monthlyRevenue = paidPayments.reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingTickets = tickets.data?.filter(t => t.status === 'open' || t.status === 'in_progress').length || 0;

    return { totalCustomers, activeCustomers, monthlyRevenue, pendingTickets };
  },
};

export default {
  customers: customersAPI,
  packages: packagesAPI,
  payments: paymentsAPI,
  tickets: ticketsAPI,
  staff: staffAPI,
  dashboard: dashboardAPI,
};
