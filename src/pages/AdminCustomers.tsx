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
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { customersAPI, packagesAPI } from "@/lib/api";
import { 
  Users, UserPlus, Search, Filter, UserX, UserCheck, Edit, BarChart3, CreditCard, 
  Network, MessageSquare, Wifi, WifiOff, Loader2
} from "lucide-react";
import { Ticket } from "lucide-react";

const AdminCustomers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "", email: "", phone: "", address: "", package_id: ""
  });

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const fetchData = async () => {
    try {
      const [customersData, packagesData] = await Promise.all([
        customersAPI.getAll(),
        packagesAPI.getAll()
      ]);
      setCustomers(customersData);
      setPackages(packagesData);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddCustomer = async () => {
    if (!newCustomer.name || !newCustomer.email || !newCustomer.phone || !newCustomer.address || !newCustomer.package_id) {
      toast({ title: "Error", description: "Lengkapi semua field", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await customersAPI.create(newCustomer);
      toast({ title: "Berhasil", description: "Pelanggan berhasil ditambahkan" });
      setShowAddDialog(false);
      setNewCustomer({ name: "", email: "", phone: "", address: "", package_id: "" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Gagal menambahkan pelanggan", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (customerId: string, newStatus: string) => {
    try {
      await customersAPI.update(customerId, { status: newStatus });
      toast({ title: "Berhasil", description: `Status pelanggan diubah ke ${newStatus}` });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active": return <Badge className="bg-success text-success-foreground"><Wifi className="h-3 w-3 mr-1" />Aktif</Badge>;
      case "suspended": return <Badge className="bg-warning text-warning-foreground"><WifiOff className="h-3 w-3 mr-1" />Suspend</Badge>;
      case "inactive": return <Badge variant="secondary">Tidak Aktif</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <DashboardLayout title="Kelola Pelanggan" userRole="admin" userName="Admin" navigation={navigation}>
        <div className="space-y-6"><Skeleton className="h-12 w-full" /><Skeleton className="h-64 w-full" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Kelola Pelanggan" userRole="admin" userName="Admin" navigation={navigation}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Pelanggan</h2>
          <p className="text-muted-foreground">Kelola data dan status pelanggan Latansa Network</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button><UserPlus className="h-4 w-4 mr-2" />Tambah Pelanggan</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader><DialogTitle>Tambah Pelanggan Baru</DialogTitle></DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label>Nama Lengkap</Label>
                <Input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="Masukkan nama lengkap" />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={newCustomer.email} onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>No. Telepon</Label>
                <Input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="08123456789" />
              </div>
              <div className="space-y-2">
                <Label>Paket Internet</Label>
                <Select value={newCustomer.package_id} onValueChange={(value) => setNewCustomer({...newCustomer, package_id: value})}>
                  <SelectTrigger><SelectValue placeholder="Pilih paket" /></SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>{pkg.name} - {formatCurrency(pkg.price)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label>Alamat Lengkap</Label>
                <Input value={newCustomer.address} onChange={(e) => setNewCustomer({...newCustomer, address: e.target.value})} placeholder="Jl. Raya No. 123" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>Batal</Button>
              <Button onClick={handleAddCustomer} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Tambah Pelanggan"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Cari nama atau email pelanggan..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48"><Filter className="h-4 w-4 mr-2" /><SelectValue placeholder="Filter Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="suspended">Suspend</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Pelanggan ({filteredCustomers.length})</CardTitle>
          <CardDescription>Informasi lengkap pelanggan dan status layanan</CardDescription>
        </CardHeader>
        <CardContent>
          {customers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Data Pelanggan</h3>
              <p className="text-muted-foreground">Klik "Tambah Pelanggan" untuk menambahkan pelanggan pertama</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pelanggan</TableHead>
                    <TableHead>Paket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tagihan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email}</div>
                          <div className="text-xs text-muted-foreground">{customer.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{customer.packages?.name || '-'}</div>
                        <div className="text-sm text-muted-foreground">{formatCurrency(customer.packages?.price || 0)}/bulan</div>
                      </TableCell>
                      <TableCell>{getStatusBadge(customer.status)}</TableCell>
                      <TableCell>{formatCurrency(customer.total_amount || 0)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => window.location.href = `/admin/customers/${customer.id}`}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          {customer.status === 'active' ? (
                            <Button size="sm" variant="outline" className="text-warning" onClick={() => handleStatusChange(customer.id, 'suspended')}>
                              <UserX className="h-3 w-3" />
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" className="text-success" onClick={() => handleStatusChange(customer.id, 'active')}>
                              <UserCheck className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total</p><p className="text-2xl font-bold">{customers.length}</p></div><Users className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Aktif</p><p className="text-2xl font-bold text-success">{customers.filter(c => c.status === 'active').length}</p></div><Wifi className="h-8 w-8 text-success" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Suspend</p><p className="text-2xl font-bold text-warning">{customers.filter(c => c.status === 'suspended').length}</p></div><WifiOff className="h-8 w-8 text-warning" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Tidak Aktif</p><p className="text-2xl font-bold text-muted-foreground">{customers.filter(c => c.status === 'inactive').length}</p></div><UserX className="h-8 w-8 text-muted-foreground" /></div></CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminCustomers;
