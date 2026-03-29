import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockPayments, mockCustomers } from "@/lib/data";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText,
  Plus,
  Search,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Edit,
  Trash2,
  Eye,
  CreditCard,
  Users,
  BarChart3,
  MessageSquare,
  Network,
  UserCog,
  Package,
  Wrench,
  Box,
  UserPlus
} from "lucide-react";

const AdminInvoices = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer_id: "",
    amount: "",
    due_date: "",
    description: ""
  });

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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR",
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Lunas</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue":
        return <Badge className="bg-destructive text-destructive-foreground"><AlertTriangle className="h-3 w-3 mr-1" />Terlambat</Badge>;
      case "failed":
        return <Badge variant="destructive">Gagal</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInvoices = mockPayments.filter(payment => {
    const customer = mockCustomers.find(c => c.id === payment.customer_id);
    const matchesSearch = 
      payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateInvoice = () => {
    if (!newInvoice.customer_id || !newInvoice.amount || !newInvoice.due_date) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Invoice Berhasil Dibuat",
      description: `Invoice untuk pelanggan telah berhasil dibuat`,
    });
    
    setIsCreateDialogOpen(false);
    setNewInvoice({
      customer_id: "",
      amount: "",
      due_date: "",
      description: ""
    });
  };

  const handleSendInvoice = (invoiceNumber: string) => {
    toast({
      title: "Invoice Terkirim",
      description: `Invoice ${invoiceNumber} berhasil dikirim via WhatsApp`,
    });
  };

  const handleDeleteInvoice = (invoiceNumber: string) => {
    toast({
      title: "Invoice Dihapus",
      description: `Invoice ${invoiceNumber} telah dihapus`,
      variant: "destructive"
    });
  };

  const stats = [
    {
      title: "Total Invoice",
      value: mockPayments.length.toString(),
      icon: <FileText className="h-8 w-8 text-primary" />
    },
    {
      title: "Invoice Pending",
      value: mockPayments.filter(p => p.status === "pending").length.toString(),
      icon: <Clock className="h-8 w-8 text-warning" />
    },
    {
      title: "Invoice Overdue",
      value: mockPayments.filter(p => p.status === "overdue").length.toString(),
      icon: <AlertTriangle className="h-8 w-8 text-destructive" />
    },
    {
      title: "Invoice Lunas",
      value: mockPayments.filter(p => p.status === "paid").length.toString(),
      icon: <CheckCircle className="h-8 w-8 text-success" />
    }
  ];

  return (
    <DashboardLayout
      title="Kelola Invoice"
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Daftar Invoice</CardTitle>
              <CardDescription>Kelola dan pantau semua invoice pelanggan</CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Invoice Baru
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Buat Invoice Baru</DialogTitle>
                  <DialogDescription>
                    Buat invoice untuk pelanggan
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer">Pelanggan</Label>
                    <Select value={newInvoice.customer_id} onValueChange={(value) => setNewInvoice({...newInvoice, customer_id: value})}>
                      <SelectTrigger id="customer">
                        <SelectValue placeholder="Pilih pelanggan" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockCustomers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah Tagihan</Label>
                    <Input 
                      id="amount" 
                      type="number"
                      placeholder="Masukkan jumlah"
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="due_date">Tanggal Jatuh Tempo</Label>
                    <Input 
                      id="due_date" 
                      type="date"
                      value={newInvoice.due_date}
                      onChange={(e) => setNewInvoice({...newInvoice, due_date: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Keterangan (Opsional)</Label>
                    <Input 
                      id="description" 
                      placeholder="Contoh: Tagihan bulan Desember"
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleCreateInvoice}>
                    Buat Invoice
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Cari invoice atau nama pelanggan..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="paid">Lunas</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Terlambat</SelectItem>
                <SelectItem value="failed">Gagal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Invoice Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Pelanggan</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Jatuh Tempo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tanggal Bayar</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.length > 0 ? (
                  filteredInvoices.map((payment) => {
                    const customer = mockCustomers.find(c => c.id === payment.customer_id);
                    return (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.invoice_number}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{customer?.name}</div>
                            <div className="text-sm text-muted-foreground">{customer?.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(payment.amount)}</TableCell>
                        <TableCell>{formatDate(payment.due_date)}</TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>{formatDate(payment.payment_date)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" title="Lihat Detail">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="ghost" title="Download PDF">
                              <Download className="h-4 w-4" />
                            </Button>
                            {payment.status !== "paid" && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  title="Kirim via WhatsApp"
                                  onClick={() => handleSendInvoice(payment.invoice_number)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="ghost" title="Edit Invoice">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  title="Hapus Invoice"
                                  onClick={() => handleDeleteInvoice(payment.invoice_number)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Tidak ada invoice ditemukan</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminInvoices;
