export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  package_id: string;
  status: 'active' | 'suspended' | 'inactive';
  created_at: string;
  last_payment: string;
  next_payment: string;
  total_amount: number;
  mikrotik_username?: string;
}

export interface InternetPackage {
  id: string;
  name: string;
  speed_download: string;
  speed_upload: string;
  price: number;
  description: string;
  features: string[];
}

export interface Payment {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'overdue';
  payment_date: string;
  due_date: string;
  invoice_number: string;
  payment_method?: string;
}

export interface Ticket {
  id: string;
  customer_id: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'technical' | 'billing' | 'general';
  created_at: string;
  updated_at: string;
  assigned_to?: string;
  resolution?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  customer_id?: string;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'available' | 'busy' | 'offline';
  specialization: string[];
  current_tickets: number;
  max_tickets: number;
  rating: number;
  completed_tickets: number;
  location: string;
  shift: 'morning' | 'afternoon' | 'night';
}

export interface TicketActivity {
  id: string;
  ticket_id: string;
  technician_id: string;
  action: 'assigned' | 'started' | 'paused' | 'completed' | 'transferred' | 'note_added';
  description: string;
  timestamp: string;
  duration_minutes?: number;
}