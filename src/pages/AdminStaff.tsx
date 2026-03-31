import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Users, BarChart3, CreditCard, Network, MessageSquare, Plus, UserCog, Mail, Phone, Package, FileText, AlertTriangle, Shield, User } from "lucide-react";

const AdminStaff = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", role: "staff" });
  const { toast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Kelola Staff", href: "/admin/staff", icon: <UserCog className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .order("created_at", { ascending: false });
      if (!error && data) setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleAdd = async () => {
    if (!form.name || !form.email || !form.password || !form.role) {
      toast({ title: "Error", description: "Semua field wajib diisi", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await supabase.functions.invoke("manage-users", {
        body: { action: "create_user", ...form },
        headers: { Authorization: `Bearer ${session?.access_token}` }
      });
      if (res.error) throw new Error(res.error.message);
      toast({ title: "Berhasil!", description: `User ${form.name} berhasil ditambahkan sebagai ${form.role}` });
      setAddOpen(false);
      setForm({ name: "", email: "", phone: "", password: "", role: "staff" });
      fetchUsers();
    } catch (e: any) {
      toast({ title: "Gagal", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (roles: any[]) => {
    const role = roles?.[0]?.role || "customer";
    const colors: Record<string, string> = { admin: "bg-red-500", staff: "bg-blue-500", customer: "bg-green-500" };
    return <Badge className={`${colors[role]} text-white`}>{role}</Badge>;
  };

  const UserCard = ({ user }: { user: any }) => (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{user.name?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="font-semibold">{user.name}</p>
              {getRoleBadge(user.user_roles)}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-3 w-3" />{user.email}
            </div>
            {user.phone && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Phone className="h-3 w-3" />{user.phone}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const admins = users.filter(u => u.user_roles?.[0]?.role === "admin");
  const staff = users.filter(u => u.user_roles?.[0]?.role === "staff");
  const customers = users.filter(u => u.user_roles?.[0]?.role === "customer");

  return (
    <DashboardLayout title="Manajemen User" userRole="admin" userName="Admin" navigation={navigation}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manajemen User</h2>
          <p className="text-muted-foreground">Kelola Admin, Staff, dan Customer</p>
        </div>
        <Dialog open={addOpen} onOpenChange={setAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Tambah User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah User Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div>
                <Label>Nama Lengkap</Label>
                <Input placeholder="Nama lengkap" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" placeholder="email@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
              </div>
              <div>
                <Label>No. HP (opsional)</Label>
                <Input placeholder="08xxxxxxxxxx" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
              </div>
              <div>
                <Label>Password</Label>
                <Input type="password" placeholder="Min. 8 karakter" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              </div>
              <div>
                <Label>Role</Label>
                <Select value={form.role} onValueChange={v => setForm({...form, role: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleAdd} disabled={submitting}>
                {submitting ? "Menyimpan..." : "Tambah User"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><Shield className="h-4 w-4 text-red-500" />Admin</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{admins.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><UserCog className="h-4 w-4 text-blue-500" />Staff</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{staff.length}</div></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground flex items-center gap-2"><User className="h-4 w-4 text-green-500" />Customer</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{customers.length}</div></CardContent></Card>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground py-12">Memuat data...</div>
      ) : (
        <div className="space-y-8">
          {admins.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-500" /> Admin ({admins.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {admins.map(u => <UserCard key={u.id} user={u} />)}
              </div>
            </div>
          )}
          {staff.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <UserCog className="h-5 w-5 text-blue-500" /> Staff ({staff.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {staff.map(u => <UserCard key={u.id} user={u} />)}
              </div>
            </div>
          )}
          {customers.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <User className="h-5 w-5 text-green-500" /> Customer ({customers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {customers.map(u => <UserCard key={u.id} user={u} />)}
              </div>
            </div>
          )}
          {users.length === 0 && (
            <Card><CardContent className="py-12 text-center">
              <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Belum ada user</p>
            </CardContent></Card>
          )}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStaff;
