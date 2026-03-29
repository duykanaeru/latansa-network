import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import { Wifi, CreditCard, Calendar, MessageSquare, Download, Upload, AlertCircle, CheckCircle, Clock, BarChart3, FileText, Headphones, Zap } from "lucide-react";

const CustomerDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [customerPkg, setCustomerPkg] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

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

        const { data: customerData } = await supabase
          .from('customers')
          .select('*, packages(name, price, speed_download, speed_upload)')
          .eq('user_id', user.id)
          .single();

        if (customerData) {
          setCustomer(customerData);
          setCustomerPkg(customerData.packages);

          const [paymentsRes, ticketsRes] = await Promise.all([
            supabase.from('payments').select('*').eq('customer_id', customerData.id).order('created_at', { ascending: false }).limit(3),
            supabase.from('tickets').select('*').eq('customer_id', customerData.id).order('created_at', { ascending: false }).limit(5),
          ]);
          setPayments(paymentsRes.data || []);
          setTickets(ticketsRes.data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <DashboardLayout title="Dashboard Pelanggan" userRole="customer" userName="Pelanggan" navigation={navigation}>
        <div className="space-y-6"><Skeleton className="h-48" /><Skeleton className="h-64" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard Pelanggan" userRole="customer" userName={customer?.name || "Pelanggan"} navigation={navigation}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center"><Wifi className="h-5 w-5 mr-2 text-muted-foreground" />Status Koneksi</CardTitle>
            <CardDescription>
              Paket: {customerPkg?.name || '-'} • Status: 
              <Badge className={`ml-2 ${customer?.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                {customer?.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
              </Badge>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customerPkg ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center"><Download className="h-4 w-4 text-primary mx-auto mb-1" /><div className="text-2xl font-bold text-primary">{customerPkg.speed_download}</div><div className="text-sm text-muted-foreground">Download</div></div>
                <div className="text-center"><Upload className="h-4 w-4 text-accent mx-auto mb-1" /><div className="text-2xl font-bold text-accent">{customerPkg.speed_upload}</div><div className="text-sm text-muted-foreground">Upload</div></div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground"><Wifi className="h-12 w-12 mx-auto mb-4" /><p>Data koneksi tidak tersedia</p></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center"><CreditCard className="h-5 w-5 mr-2" />Tagihan</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div><div className="text-2xl font-bold">{customerPkg ? formatCurrency(customerPkg.price) : '-'}</div><div className="text-sm text-muted-foreground">per bulan</div></div>
              <Button className="w-full" onClick={() => window.location.href = '/customer/billing'}>Bayar Sekarang</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader><CardTitle>Riwayat Pembayaran</CardTitle><CardDescription>3 pembayaran terakhir</CardDescription></CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <div className="text-center py-8"><CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Belum ada riwayat pembayaran</p></div>
            ) : (
              <div className="space-y-4">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div><div className="font-medium">{formatCurrency(Number(p.amount))}</div><div className="text-sm text-muted-foreground">{p.payment_date ? new Date(p.payment_date).toLocaleDateString('id-ID') : '-'}</div></div>
                    <Badge className={p.status === 'paid' ? "bg-success text-success-foreground" : "bg-warning text-warning-foreground"}>{p.status === 'paid' ? 'Lunas' : 'Pending'}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Tiket Support</CardTitle></CardHeader>
          <CardContent>
            {tickets.length === 0 ? (
              <div className="text-center py-8"><MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground mb-4">Belum ada tiket</p>
                <Button onClick={() => window.location.href = '/customer/tickets'}><MessageSquare className="h-4 w-4 mr-2" />Buat Tiket Baru</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((t) => (
                  <div key={t.id} className="p-3 border border-border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="font-medium text-sm">{t.title}</div>
                      <Badge variant={t.status === "open" ? "destructive" : "default"} className={t.status === "resolved" ? "bg-success text-success-foreground" : t.status === "in_progress" ? "bg-warning text-warning-foreground" : ""}>
                        {t.status === "open" ? "Terbuka" : t.status === "in_progress" ? "Dikerjakan" : "Selesai"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Butuh Bantuan?</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col"><Headphones className="h-6 w-6 mb-2" /><span>Live Chat</span></Button>
              <Button variant="outline" className="h-20 flex-col"><MessageSquare className="h-6 w-6 mb-2" /><span>WhatsApp</span></Button>
              <Button variant="outline" className="h-20 flex-col"><AlertCircle className="h-6 w-6 mb-2" /><span>Lapor Gangguan</span></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
