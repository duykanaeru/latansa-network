import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  AlertTriangle,
  BarChart3,
  CreditCard,
  Network,
  MessageSquare,
  Package,
  FileText,
  UserPlus,
  Wrench,
  Box,
  Plus,
  Edit,
  Trash2,
  TrendingDown,
  CheckCircle
} from "lucide-react";
import { useState } from "react";

const AdminInventory = () => {
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Registrasi", href: "/admin/registration", icon: <UserPlus className="h-4 w-4" /> },
    { name: "Instalasi", href: "/admin/installation", icon: <Wrench className="h-4 w-4" /> },
    { name: "Inventori", href: "/admin/inventory", icon: <Box className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const [inventory] = useState([
    {
      id: "INV001",
      name: "Router TP-Link Archer C6",
      category: "router",
      stock: 45,
      minStock: 20,
      unit: "unit",
      price: 350000,
      location: "Gudang A"
    },
    {
      id: "INV002",
      name: "Kabel Fiber Optic",
      category: "cable",
      stock: 2500,
      minStock: 1000,
      unit: "meter",
      price: 5000,
      location: "Gudang A"
    },
    {
      id: "INV003",
      name: "ONT Huawei HG8245H5",
      category: "ont",
      stock: 32,
      minStock: 30,
      unit: "unit",
      price: 450000,
      location: "Gudang B"
    },
    {
      id: "INV004",
      name: "Konektor SC/UPC",
      category: "connector",
      stock: 150,
      minStock: 100,
      unit: "pcs",
      price: 15000,
      location: "Gudang A"
    },
    {
      id: "INV005",
      name: "Patch Cord 3m",
      category: "cable",
      stock: 8,
      minStock: 50,
      unit: "pcs",
      price: 25000,
      location: "Gudang B"
    },
    {
      id: "INV006",
      name: "Splitter 1:8",
      category: "splitter",
      stock: 67,
      minStock: 30,
      unit: "unit",
      price: 75000,
      location: "Gudang A"
    },
    {
      id: "INV007",
      name: "ODP 16 Core",
      category: "odp",
      stock: 15,
      minStock: 10,
      unit: "unit",
      price: 850000,
      location: "Gudang C"
    },
    {
      id: "INV008",
      name: "Adaptor 12V 2A",
      category: "power",
      stock: 89,
      minStock: 40,
      unit: "pcs",
      price: 45000,
      location: "Gudang B"
    }
  ]);

  const getStockBadge = (stock: number, minStock: number) => {
    if (stock <= minStock) {
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />Stock Rendah</Badge>;
    } else if (stock <= minStock * 1.5) {
      return <Badge className="bg-warning text-warning-foreground">Perlu Restock</Badge>;
    }
    return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Stock Aman</Badge>;
  };

  const getCategoryName = (category: string) => {
    const categories: { [key: string]: string } = {
      router: "Router",
      cable: "Kabel",
      ont: "ONT",
      connector: "Konektor",
      splitter: "Splitter",
      odp: "ODP",
      power: "Power Supply"
    };
    return categories[category] || category;
  };

  const lowStockItems = inventory.filter(item => item.stock <= item.minStock).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);
  const totalItems = inventory.reduce((sum, item) => sum + item.stock, 0);

  return (
    <DashboardLayout
      title="Manajemen Inventori" 
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Inventori</h2>
          <p className="text-muted-foreground">Kelola stok peralatan dan material</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Item Inventori</DialogTitle>
              <DialogDescription>Tambahkan item baru ke inventori</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Nama Item</Label>
                <Input id="item-name" placeholder="Contoh: Router TP-Link" />
              </div>
              <div>
                <Label htmlFor="category">Kategori</Label>
                <Input id="category" placeholder="Contoh: Router" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Jumlah Stock</Label>
                  <Input id="stock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="unit">Satuan</Label>
                  <Input id="unit" placeholder="unit/pcs/meter" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="min-stock">Minimum Stock</Label>
                  <Input id="min-stock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="price">Harga (Rp)</Label>
                  <Input id="price" type="number" placeholder="0" />
                </div>
              </div>
              <div>
                <Label htmlFor="location">Lokasi</Label>
                <Input id="location" placeholder="Gudang A/B/C" />
              </div>
              <Button className="w-full">Simpan Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Item</CardTitle>
            <Box className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventory.length}</div>
            <p className="text-xs text-muted-foreground">Jenis item</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Quantity</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItems.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground">Total unit/pcs/meter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Nilai Inventori</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp {(totalValue / 1000000).toFixed(1)}M</div>
            <p className="text-xs text-muted-foreground">Total nilai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Stock Rendah</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Item perlu restock</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua ({inventory.length})</TabsTrigger>
          <TabsTrigger value="low-stock">Stock Rendah ({lowStockItems})</TabsTrigger>
          <TabsTrigger value="by-location">Per Lokasi</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{getCategoryName(item.category)} • {item.id}</CardDescription>
                    </div>
                    {getStockBadge(item.stock, item.minStock)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stock Tersedia</span>
                      <span className="font-semibold">{item.stock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Stock</span>
                      <span className="font-medium">{item.minStock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Harga Satuan</span>
                      <span className="font-medium">Rp {item.price.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Lokasi</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="text-sm text-muted-foreground">Total Nilai</span>
                      <span className="font-bold">Rp {(item.stock * item.price).toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Item: {item.name}</DialogTitle>
                          <DialogDescription>Update informasi item inventori</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Nama Item</Label>
                            <Input defaultValue={item.name} />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Stock</Label>
                              <Input type="number" defaultValue={item.stock} />
                            </div>
                            <div>
                              <Label>Min Stock</Label>
                              <Input type="number" defaultValue={item.minStock} />
                            </div>
                          </div>
                          <div>
                            <Label>Harga</Label>
                            <Input type="number" defaultValue={item.price} />
                          </div>
                          <Button className="w-full">Simpan Perubahan</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="low-stock">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inventory.filter(item => item.stock <= item.minStock).map((item) => (
              <Card key={item.id} className="border-destructive">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{getCategoryName(item.category)}</CardDescription>
                    </div>
                    {getStockBadge(item.stock, item.minStock)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Stock Tersedia</span>
                      <span className="font-semibold text-destructive">{item.stock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Minimum Stock</span>
                      <span className="font-medium">{item.minStock} {item.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Kekurangan</span>
                      <span className="font-bold text-destructive">
                        <TrendingDown className="h-3 w-3 inline mr-1" />
                        {item.minStock - item.stock} {item.unit}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Restock Item
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="by-location">
          {["Gudang A", "Gudang B", "Gudang C"].map((location) => {
            const locationItems = inventory.filter(item => item.location === location);
            if (locationItems.length === 0) return null;
            
            return (
              <Card key={location} className="mb-4">
                <CardHeader>
                  <CardTitle>{location}</CardTitle>
                  <CardDescription>{locationItems.length} jenis item</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {locationItems.map((item) => (
                      <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{getCategoryName(item.category)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{item.stock} {item.unit}</p>
                          {getStockBadge(item.stock, item.minStock)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminInventory;
