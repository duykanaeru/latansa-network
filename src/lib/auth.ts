import { supabase } from "@/integrations/supabase/client";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'customer';
  customer_id?: string;
}

class AuthService {
  private currentUser: AppUser | null = null;

  async login(email: string, password: string): Promise<AppUser> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);

    const user = data.user;
    if (!user) throw new Error('Login gagal');

    // Get role
    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .limit(1);

    const role = (roles?.[0]?.role as AppUser['role']) || 'customer';

    // Get profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    // Get customer_id if customer
    let customer_id: string | undefined;
    if (role === 'customer') {
      const { data: customer } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .single();
      customer_id = customer?.id;
    }

    const appUser: AppUser = {
      id: user.id,
      email: user.email || '',
      name: profile?.name || user.email || '',
      role,
      customer_id
    };

    this.currentUser = appUser;
    localStorage.setItem('user', JSON.stringify(appUser));
    return appUser;
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
    this.currentUser = null;
    localStorage.removeItem('user');
  }

  getCurrentUser(): AppUser | null {
    if (this.currentUser) return this.currentUser;
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
        return this.currentUser;
      } catch {
        return null;
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  hasRole(role: string): boolean {
    return this.getCurrentUser()?.role === role;
  }
}

export const authService = new AuthService();
