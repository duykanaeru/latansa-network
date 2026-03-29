import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import { CreditCard, Download, Calendar, CheckCircle, Clock, AlertTriangle, FileText, BarChart3, MessageSquare, Wallet, Receipt } from "lucide-react";

const CustomerBilling = () => {
  const [customer, setCustomer] = useState<any>(null);
  const [customerPackage, setCustomerPackage] = useState<any>(null);
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
        const { data: customerData } = await supabase.from('customers').select('*, packages(*)').eq('user_id', user.id).single();
        if (customerData) {
          setCustomer(customerData);
          setCustomerPackage(customerData.packages);
          const { data: paymentsData } = await supabase.from('payments').select('*').eq('customer_id', customerData.id).order('created_at', { ascending: false });
          setPayments(paymentsData || []);
        }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Lunas</Badge>;
      case "pending": return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue": return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Terlambat</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-";

  const currentInvoice = payments.find(p => p.status === 'pending' || p.status === 'overdue');
  const paidInvoices = payments.filter(p => p.status === 'paid').slice(0, 5);

  if (loading) {
    return (<DashboardLayout title="Pembayaran & Tagihan" userRole="customer" userName="Pelanggan" navigation={navigation}><div className="space-y-6"><Skeleton className="h-32 w-full" /><Skeleton className="h-64 w-full" /></div></DashboardLayout>);
  }

  return (
    <DashboardLayout title="Pembayaran & Tagihan" userRole="customer" userName={customer?.name || "Pelanggan"} navigation={navigation}>
      <Card className="mb-6">
        <CardHeader><CardTitle className="flex items-center"><Wallet className="h-5 w-5 mr-2" />Paket Berlangganan</CardTitle></CardHeader>
        <CardContent>
          {!customerPackage ? (
            <div className="text-center py-8"><Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Data paket tidak tersedia</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div><h3 className="font-semibold text-lg">{customerPackage.name}</h3><p className="text-muted-foreground">{customerPackage.description}</p><div className="mt-2 space-y-1"><div className="text-sm"><span className="text-muted-foreground">Download:</span> {customerPackage.speed_download}</div><div className="text-sm"><span className="text-muted-foreground">Upload:</span> {customerPackage.speed_upload}</div></div></div>
              <div><div className="text-2xl font-bold text-primary">{formatCurrency(customerPackage.price || 0)}</div><p className="text-muted-foreground">per bulan</p><Badge className={customer?.status === 'active' ? "bg-success text-success-foreground mt-2" : "mt-2"}>{customer?.status === 'active' ? 'Aktif' : 'Tidak Aktif'}</Badge></div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center"><Receipt className="h-5 w-5 mr-2" />Tagihan Aktif</CardTitle></CardHeader>
          <CardContent>
            {!currentInvoice ? (
              <div className="text-center py-8"><CheckCircle className="h-12 w-12 mx-auto text-success mb-4" /><p className="text-muted-foreground">Tidak ada tagihan aktif</p></div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between"><span className="text-muted-foreground">Invoice:</span><span className="font-medium">{currentInvoice.invoice_number}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Jumlah:</span><span className="text-2xl font-bold text-primary">{formatCurrency(Number(currentInvoice.amount))}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Jatuh Tempo:</span><span>{formatDate(currentInvoice.due_date)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Status:</span>{getStatusBadge(currentInvoice.status)}</div>
                <Button className="w-full"><CreditCard className="h-4 w-4 mr-2" />Bayar Sekarang</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Metode Pembayaran</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Transfer Bank", "Virtual Account", "QRIS", "E-Wallet"].map((method) => (
                <div key={method} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center justify-between"><div className="font-medium">{method}</div><div className="text-sm text-primary">Gratis</div></div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader><CardTitle>Riwayat Pembayaran</CardTitle></CardHeader>
        <CardContent>
          {paidInvoices.length === 0 ? (
            <div className="text-center py-8"><FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Belum ada riwayat</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Invoice</TableHead><TableHead>Tanggal</TableHead><TableHead>Jumlah</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
              <TableBody>
                {paidInvoices.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.invoice_number || '-'}</TableCell>
                    <TableCell>{formatDate(p.payment_date)}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(Number(p.amount))}</TableCell>
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

export default CustomerBilling;
