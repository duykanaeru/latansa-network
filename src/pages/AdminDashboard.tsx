import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { dashboardAPI } from "@/lib/api";
import { 
  Users, DollarSign, Wifi, AlertTriangle, TrendingUp, UserPlus, CreditCard, Network, 
  BarChart3, UserX, MessageSquare, Package, FileText, UserCog, Wrench, Box, Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Registrasi", href: "/admin/registration", icon: <UserPlus className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Instalasi", href: "/admin/installation", icon: <Wrench className="h-4 w-4" /> },
    { name: "Inventori", href: "/admin/inventory", icon: <Box className="h-4 w-4" /> },
    { name: "Invoice", href: "/admin/invoices", icon: <FileText className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Kelola Staff", href: "/admin/staff", icon: <UserCog className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await dashboardAPI.getAdminStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const statCards = [
    { title: "Total Pelanggan", value: loading ? "-" : (stats?.totalCustomers || 0).toString(), icon: <Users className="h-8 w-8 text-primary" /> },
    { title: "Pendapatan Bulan Ini", value: loading ? "-" : formatCurrency(stats?.monthlyRevenue || 0), icon: <DollarSign className="h-8 w-8 text-success" /> },
    { title: "Pelanggan Aktif", value: loading ? "-" : (stats?.activeCustomers || 0).toString(), icon: <Wifi className="h-8 w-8 text-accent" /> },
    { title: "Tiket Pending", value: loading ? "-" : (stats?.pendingTickets || 0).toString(), icon: <AlertTriangle className="h-8 w-8 text-warning" /> },
  ];

  return (
    <DashboardLayout title="Dashboard Administrator" userRole="admin" userName="Admin Utama" navigation={navigation}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Fitur yang sering digunakan administrator</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/customers'}>
              <UserPlus className="h-4 w-4 mr-2" />Tambah Pelanggan Baru
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/payments'}>
              <CreditCard className="h-4 w-4 mr-2" />Proses Pembayaran Manual
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/network'}>
              <Network className="h-4 w-4 mr-2" />Kontrol Mikrotik
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/admin/tickets'}>
              <AlertTriangle className="h-4 w-4 mr-2" />Kelola Tiket Support
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Jaringan</CardTitle>
            <CardDescription>Monitor kondisi jaringan per area</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Data jaringan akan ditampilkan dari MikroTik</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
