import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { staffAPI } from "@/lib/api";
import { Users, AlertTriangle, BarChart3, CreditCard, Network, MessageSquare, Plus, Edit, Trash2, Package, FileText, UserCog, Mail, Phone, Star } from "lucide-react";

const AdminStaff = () => {
  const [staffMembers, setStaffMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await staffAPI.getAll();
        setStaffMembers(data);
      } catch (error) {
        console.error('Error fetching staff:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  if (loading) {
    return (
      <DashboardLayout title="Kelola Staff" userRole="admin" userName="Admin" navigation={navigation}>
        <div className="space-y-6"><Skeleton className="h-12 w-full" /><Skeleton className="h-64 w-full" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Kelola Staff" userRole="admin" userName="Admin" navigation={navigation}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Kelola Staff & Teknisi</h2>
          <p className="text-muted-foreground">Manajemen tim support dan teknisi lapangan</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle><UserCog className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{staffMembers.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Aktif</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{staffMembers.filter(s => s.is_active).length}</div></CardContent></Card>
      </div>

      {staffMembers.length === 0 ? (
        <Card><CardContent className="py-12"><div className="text-center">
          <UserCog className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Staff</h3>
          <p className="text-muted-foreground">Staff akan muncul setelah akun dibuat</p>
        </div></CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {staffMembers.map((staff) => (
            <Card key={staff.id}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg">{staff.name?.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{staff.name}</CardTitle>
                    <CardDescription>{staff.user_roles?.map((r: any) => r.role).join(', ')}</CardDescription>
                    <Badge className={staff.is_active ? "bg-success" : ""}>{staff.is_active ? 'Aktif' : 'Tidak Aktif'}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm"><Mail className="h-4 w-4 mr-2 text-muted-foreground" />{staff.email}</div>
                  {staff.phone && <div className="flex items-center text-sm"><Phone className="h-4 w-4 mr-2 text-muted-foreground" />{staff.phone}</div>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminStaff;
