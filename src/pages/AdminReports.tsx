import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Users, 
  DollarSign, 
  AlertTriangle,
  BarChart3,
  CreditCard,
  Network,
  MessageSquare,
  Download,
  TrendingUp,
  TrendingDown,
  Package,
  FileText
} from "lucide-react";

const AdminReports = () => {
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const revenueData = [
    { month: "Jan", revenue: 45000000, customers: 2547 },
    { month: "Feb", revenue: 48000000, customers: 2621 },
    { month: "Mar", revenue: 51000000, customers: 2734 },
    { month: "Apr", revenue: 49000000, customers: 2698 },
    { month: "Mei", revenue: 53000000, customers: 2801 },
    { month: "Jun", revenue: 56000000, customers: 2847 }
  ];

  const packageStats = [
    { name: "Paket Basic", customers: 456, revenue: 114000000, growth: 12 },
    { name: "Paket Standard", customers: 892, revenue: 401400000, growth: 18 },
    { name: "Paket Premium", customers: 623, revenue: 467250000, growth: 8 },
    { name: "Paket Ultra", customers: 145, revenue: 174000000, growth: -3 }
  ];

  return (
    <DashboardLayout
      title="Laporan & Analitik" 
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Laporan & Analitik</h2>
          <p className="text-muted-foreground">Monitor kinerja bisnis dan tren pelanggan</p>
        </div>
        <div className="flex gap-3">
          <Select defaultValue="current-month">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Bulan Ini</SelectItem>
              <SelectItem value="last-month">Bulan Lalu</SelectItem>
              <SelectItem value="last-3-months">3 Bulan Terakhir</SelectItem>
              <SelectItem value="last-6-months">6 Bulan Terakhir</SelectItem>
              <SelectItem value="current-year">Tahun Ini</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Pendapatan</TabsTrigger>
          <TabsTrigger value="customers">Pelanggan</TabsTrigger>
          <TabsTrigger value="packages">Paket</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 56M</div>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.3% dari bulan lalu
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Pelanggan</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847</div>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.2% dari bulan lalu
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Revenue per User</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 495K</div>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +5.1% dari bulan lalu
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Churn Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.3%</div>
                <div className="flex items-center text-xs text-success mt-1">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  -0.8% dari bulan lalu
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tren Pendapatan 6 Bulan Terakhir</CardTitle>
              <CardDescription>Perbandingan pendapatan dan jumlah pelanggan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <span className="font-medium w-12">{data.month}</span>
                      <div className="flex-1 bg-muted rounded-full h-8 relative overflow-hidden">
                        <div 
                          className="bg-primary h-full rounded-full flex items-center justify-end pr-3"
                          style={{ width: `${(data.revenue / 60000000) * 100}%` }}
                        >
                          <span className="text-xs font-medium text-primary-foreground">
                            Rp {(data.revenue / 1000000).toFixed(0)}M
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground ml-4">{data.customers} pelanggan</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detail Pendapatan</CardTitle>
              <CardDescription>Breakdown pendapatan berdasarkan sumber</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Pembayaran Bulanan</span>
                    <span className="text-sm font-bold">Rp 48.5M (86.6%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full" style={{ width: '86.6%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Biaya Instalasi</span>
                    <span className="text-sm font-bold">Rp 4.2M (7.5%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-accent h-3 rounded-full" style={{ width: '7.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Denda Keterlambatan</span>
                    <span className="text-sm font-bold">Rp 2.1M (3.8%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-warning h-3 rounded-full" style={{ width: '3.8%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Lainnya</span>
                    <span className="text-sm font-bold">Rp 1.2M (2.1%)</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-muted-foreground h-3 rounded-full" style={{ width: '2.1%' }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistik Pelanggan</CardTitle>
              <CardDescription>Analisis pertumbuhan dan retensi pelanggan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Pelanggan Baru (Bulan Ini)</span>
                  <div className="text-3xl font-bold">234</div>
                  <div className="flex items-center text-xs text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% dari bulan lalu
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Pelanggan Keluar</span>
                  <div className="text-3xl font-bold">67</div>
                  <div className="flex items-center text-xs text-success">
                    <TrendingDown className="h-3 w-3 mr-1" />
                    -8% dari bulan lalu
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Net Growth</span>
                  <div className="text-3xl font-bold">+167</div>
                  <div className="flex items-center text-xs text-success">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +18% dari bulan lalu
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performa Paket</CardTitle>
              <CardDescription>Statistik dan tren untuk setiap paket layanan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {packageStats.map((pkg, index) => (
                  <div key={index} className="border-b pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{pkg.name}</h4>
                        <p className="text-sm text-muted-foreground">{pkg.customers} pelanggan aktif</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">Rp {(pkg.revenue / 1000000).toFixed(1)}M</div>
                        <div className={`text-xs flex items-center justify-end ${pkg.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {pkg.growth >= 0 ? (
                            <><TrendingUp className="h-3 w-3 mr-1" />+{pkg.growth}%</>
                          ) : (
                            <><TrendingDown className="h-3 w-3 mr-1" />{pkg.growth}%</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${(pkg.customers / 2847) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminReports;