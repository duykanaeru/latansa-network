import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { paymentsAPI, customersAPI } from "@/lib/api";
import { DollarSign, TrendingUp, AlertCircle, CheckCircle, Clock, Search, Filter, Download, Plus, BarChart3, Users, CreditCard, Network, MessageSquare, Loader2 } from "lucide-react";
import { Ticket } from "lucide-react";

const AdminPayments = () => {
  const { toast } = useToast();
  const [payments, setPayments] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newPayment, setNewPayment] = useState({ customer_id: "", amount: "", payment_method: "", notes: "", invoice_number: "" });

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const paymentMethods = [
    { value: "transfer", label: "Transfer Bank" },
    { value: "cash", label: "Cash" },
    { value: "ewallet", label: "E-Wallet" },
    { value: "qris", label: "QRIS" }
  ];

  const fetchData = async () => {
    try {
      const [paymentsData, customersData] = await Promise.all([
        paymentsAPI.getAll(),
        customersAPI.getAll()
      ]);
      setPayments(paymentsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleProcessPayment = async () => {
    if (!newPayment.customer_id || !newPayment.amount) {
      toast({ title: "Error", description: "Pilih pelanggan dan jumlah pembayaran", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await paymentsAPI.create({
        customer_id: newPayment.customer_id,
        amount: Number(newPayment.amount),
        payment_method: newPayment.payment_method,
        notes: newPayment.notes,
        invoice_number: newPayment.invoice_number || `INV-${Date.now()}`
      });
      toast({ title: "Berhasil", description: "Pembayaran berhasil diproses" });
      setShowPaymentDialog(false);
      setNewPayment({ customer_id: "", amount: "", payment_method: "", notes: "", invoice_number: "" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    try {
      await paymentsAPI.confirm(paymentId);
      toast({ title: "Berhasil", description: "Pembayaran dikonfirmasi" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid": return <Badge className="bg-success text-success-foreground">Lunas</Badge>;
      case "pending": return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      case "overdue": return <Badge className="bg-destructive text-destructive-foreground">Terlambat</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  const paidTotal = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const pendingCount = payments.filter(p => p.status === 'pending').length;
  const overdueCount = payments.filter(p => p.status === 'overdue').length;

  if (loading) {
    return (
      <DashboardLayout title="Manajemen Pembayaran" userRole="admin" userName="Admin" navigation={navigation}>
        <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div><Skeleton className="h-64 w-full" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manajemen Pembayaran" userRole="admin" userName="Admin" navigation={navigation}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle><DollarSign className="h-8 w-8 text-success" /></CardHeader><CardContent><div className="text-2xl font-bold">{formatCurrency(paidTotal)}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle><Clock className="h-8 w-8 text-warning" /></CardHeader><CardContent><div className="text-2xl font-bold">{pendingCount}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Transaksi</CardTitle><CheckCircle className="h-8 w-8 text-primary" /></CardHeader><CardContent><div className="text-2xl font-bold">{payments.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tunggakan</CardTitle><AlertCircle className="h-8 w-8 text-destructive" /></CardHeader><CardContent><div className="text-2xl font-bold">{overdueCount}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Data Pembayaran</CardTitle><CardDescription>Kelola semua transaksi pembayaran pelanggan</CardDescription></CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input placeholder="Cari invoice, nama pelanggan..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
              </SelectContent>
            </Select>
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
              <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Proses Pembayaran</Button></DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader><DialogTitle>Proses Pembayaran Manual</DialogTitle></DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Pilih Pelanggan</Label>
                    <Select value={newPayment.customer_id} onValueChange={(v) => setNewPayment({...newPayment, customer_id: v})}>
                      <SelectTrigger><SelectValue placeholder="Pilih pelanggan" /></SelectTrigger>
                      <SelectContent>{customers.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2"><Label>No. Invoice</Label><Input value={newPayment.invoice_number} onChange={(e) => setNewPayment({...newPayment, invoice_number: e.target.value})} placeholder="INV-2024-XXX" /></div>
                  <div className="space-y-2"><Label>Jumlah Pembayaran</Label><Input type="number" value={newPayment.amount} onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})} placeholder="499000" /></div>
                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <Select value={newPayment.payment_method} onValueChange={(v) => setNewPayment({...newPayment, payment_method: v})}>
                      <SelectTrigger><SelectValue placeholder="Pilih metode" /></SelectTrigger>
                      <SelectContent>{paymentMethods.map(m => <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-2 space-y-2"><Label>Catatan</Label><Textarea value={newPayment.notes} onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})} placeholder="Catatan pembayaran..." /></div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowPaymentDialog(false)}>Batal</Button>
                  <Button onClick={handleProcessPayment} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</> : "Proses Pembayaran"}</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {payments.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Data Pembayaran</h3>
              <p className="text-muted-foreground">Klik "Proses Pembayaran" untuk menambahkan pembayaran</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead><TableHead>Pelanggan</TableHead><TableHead>Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead><TableHead>Status</TableHead><TableHead>Metode</TableHead><TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.filter(p => statusFilter === 'all' || p.status === statusFilter).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.invoice_number || '-'}</TableCell>
                    <TableCell>{payment.customers?.name || '-'}</TableCell>
                    <TableCell className="font-semibold">{formatCurrency(Number(payment.amount || 0))}</TableCell>
                    <TableCell>{payment.payment_date ? new Date(payment.payment_date).toLocaleDateString('id-ID') : '-'}</TableCell>
                    <TableCell>{getStatusBadge(payment.status)}</TableCell>
                    <TableCell>{payment.payment_method || "-"}</TableCell>
                    <TableCell>
                      {payment.status === "pending" && (
                        <Button size="sm" onClick={() => handleConfirmPayment(payment.id)}>Konfirmasi</Button>
                      )}
                    </TableCell>
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

export default AdminPayments;
