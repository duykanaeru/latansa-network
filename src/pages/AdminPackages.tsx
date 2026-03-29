import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { packagesAPI } from "@/lib/api";
import { Users, DollarSign, Wifi, BarChart3, CreditCard, Network, MessageSquare, Plus, Edit, Trash2, Package, Loader2 } from "lucide-react";

const AdminPackages = () => {
  const { toast } = useToast();
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPkg, setNewPkg] = useState({ name: "", speed_download: "", speed_upload: "", price: "", description: "", features: "" });

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const fetchPackages = async () => {
    try {
      const data = await packagesAPI.getAll();
      setPackages(data);
    } catch (error) {
      toast({ title: "Error", description: "Gagal memuat paket", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPackages(); }, []);

  const handleAddPackage = async () => {
    if (!newPkg.name || !newPkg.speed_download || !newPkg.speed_upload || !newPkg.price) {
      toast({ title: "Error", description: "Lengkapi semua field wajib", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await packagesAPI.create({
        name: newPkg.name,
        speed_download: newPkg.speed_download,
        speed_upload: newPkg.speed_upload,
        price: Number(newPkg.price),
        description: newPkg.description,
        features: newPkg.features.split(',').map(f => f.trim()).filter(Boolean)
      });
      toast({ title: "Berhasil", description: "Paket berhasil ditambahkan" });
      setShowAddDialog(false);
      setNewPkg({ name: "", speed_download: "", speed_upload: "", price: "", description: "", features: "" });
      fetchPackages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    try {
      await packagesAPI.delete(id);
      toast({ title: "Berhasil", description: "Paket berhasil dihapus" });
      fetchPackages();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  if (loading) {
    return (
      <DashboardLayout title="Kelola Paket Internet" userRole="admin" userName="Admin Utama" navigation={navigation}>
        <div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6">{[1,2].map(i => <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />)}</div></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Kelola Paket Internet" userRole="admin" userName="Admin Utama" navigation={navigation}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Paket Internet</h2>
          <p className="text-muted-foreground">Kelola paket layanan internet untuk pelanggan</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Tambah Paket Baru</Button></DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Paket Internet Baru</DialogTitle>
              <DialogDescription>Masukkan detail paket internet yang akan ditawarkan</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div><Label>Nama Paket</Label><Input value={newPkg.name} onChange={e => setNewPkg({...newPkg, name: e.target.value})} placeholder="Contoh: Paket Premium" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Kecepatan Download</Label><Input value={newPkg.speed_download} onChange={e => setNewPkg({...newPkg, speed_download: e.target.value})} placeholder="100 Mbps" /></div>
                <div><Label>Kecepatan Upload</Label><Input value={newPkg.speed_upload} onChange={e => setNewPkg({...newPkg, speed_upload: e.target.value})} placeholder="50 Mbps" /></div>
              </div>
              <div><Label>Harga per Bulan (Rp)</Label><Input type="number" value={newPkg.price} onChange={e => setNewPkg({...newPkg, price: e.target.value})} placeholder="750000" /></div>
              <div><Label>Deskripsi</Label><Textarea value={newPkg.description} onChange={e => setNewPkg({...newPkg, description: e.target.value})} placeholder="Deskripsi paket..." /></div>
              <div><Label>Fitur (pisahkan dengan koma)</Label><Textarea value={newPkg.features} onChange={e => setNewPkg({...newPkg, features: e.target.value})} placeholder="Unlimited bandwidth, Free router, 24/7 support" /></div>
              <Button className="w-full" onClick={handleAddPackage} disabled={saving}>
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Menyimpan...</> : "Simpan Paket"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Paket</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{packages.length}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Paket Aktif</CardTitle><Wifi className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{packages.filter(p => p.is_active).length}</div></CardContent></Card>
      </div>

      {packages.length === 0 ? (
        <Card><CardContent className="py-12 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Paket</h3>
          <p className="text-muted-foreground">Klik "Tambah Paket Baru" untuk menambahkan paket pertama</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <CardDescription>Download: {pkg.speed_download} • Upload: {pkg.speed_upload}</CardDescription>
                  </div>
                  <Badge variant={pkg.is_active ? "default" : "secondary"}>{pkg.is_active ? "Aktif" : "Tidak Aktif"}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-3xl font-bold">{formatCurrency(pkg.price)}</span>
                    <span className="text-muted-foreground">/bulan</span>
                  </div>
                  {pkg.description && <p className="text-sm text-muted-foreground">{pkg.description}</p>}
                  {pkg.features?.length > 0 && (
                    <div className="flex flex-wrap gap-1">{pkg.features.map((f: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{f}</Badge>)}</div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1"><Edit className="h-4 w-4 mr-2" />Edit</Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDeletePackage(pkg.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AdminPackages;
