import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import { FileText, CreditCard, BarChart3, MessageSquare, Download, CheckCircle, Clock, AlertTriangle, Activity, Wifi } from "lucide-react";

const CustomerHistory = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/customer/billing", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/customer/tickets", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Riwayat", href: "/customer/history", icon: <FileText className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) return;
        const { data: customerData } = await supabase.from('customers').select('*').eq('user_id', user.id).single();
        if (customerData) {
          setCustomer(customerData);
          const { data: paymentsData } = await supabase.from('payments').select('*').eq('customer_id', customerData.id).order('created_at', { ascending: false });
          setPayments(paymentsData || []);
        }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Lunas</Badge>;
      case "pending": return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue": return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Terlambat</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (<DashboardLayout title="Riwayat Aktivitas" userRole="customer" userName="Pelanggan" navigation={navigation}><div className="space-y-6"><Skeleton className="h-24 w-full" /><Skeleton className="h-64 w-full" /></div></DashboardLayout>);
  }

  return (
    <DashboardLayout title="Riwayat Aktivitas" userRole="customer" userName={customer?.name || "Pelanggan"} navigation={navigation}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total Pembayaran</p><p className="text-2xl font-bold text-primary">{formatCurrency(payments.reduce((sum, p) => sum + Number(p.amount || 0), 0))}</p></div><CreditCard className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Transaksi</p><p className="text-2xl font-bold text-success">{payments.length}</p></div><Activity className="h-8 w-8 text-success" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Status</p><p className="text-2xl font-bold text-accent">{customer?.status === 'active' ? 'Aktif' : '-'}</p></div><Wifi className="h-8 w-8 text-accent" /></div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center"><CreditCard className="h-5 w-5 mr-2" />Riwayat Pembayaran</CardTitle></CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-12"><CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Belum Ada Riwayat</h3><p className="text-muted-foreground">Data pembayaran akan muncul di sini</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Tanggal</TableHead><TableHead>Jumlah</TableHead><TableHead>Metode</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.invoice_number || '-'}</TableCell>
                    <TableCell>{formatDate(p.payment_date)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(Number(p.amount || 0))}</TableCell>
                    <TableCell>{p.payment_method || "-"}</TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default CustomerHistory;
