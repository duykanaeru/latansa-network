import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Network, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Router,
  Zap,
  RefreshCw,
  BarChart3,
  Users,
  CreditCard,
  MessageSquare,
  Loader2
} from "lucide-react";
import { Ticket } from "lucide-react";

const AdminNetwork = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedAction, setSelectedAction] = useState("");
  const [targetIP, setTargetIP] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mikrotikHost, setMikrotikHost] = useState("...");
  const [mikrotikUser, setMikrotikUser] = useState("...");

  useEffect(() => {
    const loadConfig = async () => {
      const { data } = await supabase
        .from('mikrotik_config')
        .select('host, username, name')
        .eq('is_active', true)
        .limit(1)
        .single();
      if (data) {
        setMikrotikHost(data.host);
        setMikrotikUser(data.username);
      }
    };
    loadConfig();
  }, []);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const handleMikrotikAction = async () => {
    if (!selectedAction || !targetIP) {
      toast({
        title: "Error",
        description: "Pilih aksi dan masukkan username PPPoE pelanggan",
        variant: "destructive"
      });
      return;
    }

    setIsExecuting(true);

    try {
      const { data, error } = await supabase.functions.invoke('mikrotik-control', {
        body: {
          action: selectedAction,
          pppoe_username: targetIP
        }
      });

      if (error) throw error;

      const actionText = {
        isolate: "mengisolir",
        activate: "mengaktivasi", 
        bandwidth_limit: "membatasi bandwidth",
        reset_connection: "mereset koneksi"
      }[selectedAction];

      if (data.success) {
        toast({
          title: "Aksi Berhasil",
          description: data.message || `Berhasil ${actionText} pelanggan dengan IP ${targetIP}`,
        });
      } else {
        toast({
          title: "Aksi Gagal",
          description: data.error || `Gagal ${actionText} pelanggan`,
          variant: "destructive"
        });
      }
      
      setSelectedAction("");
      setTargetIP("");
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Gagal menjalankan perintah Mikrotik",
        variant: "destructive"
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    toast({
      title: "Memuat Data",
      description: "Mengambil data traffic dari MikroTik...",
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Info",
        description: "Data traffic akan ditampilkan setelah konfigurasi MikroTik API selesai",
      });
    }, 2000);
  };

  // Stats placeholder - akan diambil dari MikroTik API
  const networkStats = [
    {
      title: "Uptime Network",
      value: "-",
      usage: "Memuat dari MikroTik...",
      percentage: 0,
      icon: <CheckCircle className="h-8 w-8 text-success" />,
      status: "loading"
    },
    {
      title: "Latency Rata-rata",
      value: "-",
      usage: "Memuat dari MikroTik...",
      percentage: 0,
      icon: <Zap className="h-8 w-8 text-accent" />,
      status: "loading"
    },
    {
      title: "Active Routers",
      value: "-",
      usage: "Memuat dari MikroTik...",
      percentage: 0,
      icon: <Router className="h-8 w-8 text-warning" />,
      status: "loading"
    }
  ];

  // Network alerts placeholder
  const networkAlerts: { type: string; message: string; time: string; severity: string }[] = [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-success text-success-foreground">Online</Badge>;
      case "maintenance":
        return <Badge className="bg-warning text-warning-foreground">Maintenance</Badge>;
      case "offline":
        return <Badge className="bg-destructive text-destructive-foreground">Offline</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Network Control Center"
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Traffic Bandwidth - Large Card */}
      <Card className="mb-6 border-primary/20 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Activity className="h-12 w-12 text-primary" />
              <div>
                <CardTitle className="text-2xl">Traffic Bandwidth Saat Ini</CardTitle>
                <CardDescription>
                  Monitoring real-time traffic dari MikroTik ({mikrotikHost})
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              {isRefreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/10">
              <div className="text-sm text-muted-foreground mb-2">Total Traffic</div>
              <div className="text-5xl font-bold text-primary mb-2">-</div>
              <div className="text-lg text-muted-foreground">Gbps</div>
              <Progress value={0} className="h-3 mt-4" />
              <div className="text-xs text-muted-foreground mt-2">Menunggu data dari MikroTik</div>
            </div>
            
            <div className="text-center p-6 bg-success/5 rounded-lg border border-success/10">
              <div className="text-sm text-muted-foreground mb-2">Download</div>
              <div className="text-5xl font-bold text-success mb-2">-</div>
              <div className="text-lg text-muted-foreground">Gbps</div>
              <Progress value={0} className="h-3 mt-4" />
              <div className="text-xs text-muted-foreground mt-2">Incoming traffic</div>
            </div>
            
            <div className="text-center p-6 bg-accent/5 rounded-lg border border-accent/10">
              <div className="text-sm text-muted-foreground mb-2">Upload</div>
              <div className="text-5xl font-bold text-accent mb-2">-</div>
              <div className="text-lg text-muted-foreground">Gbps</div>
              <Progress value={0} className="h-3 mt-4" />
              <div className="text-xs text-muted-foreground mt-2">Outgoing traffic</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {networkStats.map((stat, index) => (
          <Card 
            key={index}
            className={stat.title === "Latency Rata-rata" ? "cursor-pointer hover:border-primary transition-colors" : ""}
            onClick={() => stat.title === "Latency Rata-rata" && navigate("/admin/latency")}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold flex items-center gap-2">
                {stat.status === "loading" && <Loader2 className="h-5 w-5 animate-spin" />}
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-1 mb-2">
                {stat.usage}
              </div>
              <Progress value={stat.percentage} className="h-2" />
            </CardContent>
          </Card>
        ))}
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mikrotik Connection Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Mikrotik Connection</CardTitle>
            <CardDescription>Status koneksi ke router MikroTik</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold">Router Utama</div>
                  <div className="text-sm text-muted-foreground">
                    Host: {mikrotikHost} • User: {mikrotikUser}
                  </div>
                </div>
                <Badge className="bg-warning text-warning-foreground">Konfigurasi</Badge>
              </div>
              
              <div className="text-sm text-muted-foreground mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium mb-2">Catatan:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Kredensial MikroTik sudah dikonfigurasi</li>
                  <li>Memerlukan RouterOS API port 8728 aktif</li>
                  <li>Pastikan firewall mengizinkan koneksi dari server</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Network Alerts & Quick Actions */}
        <div className="space-y-6">
          {/* Network Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Network Alerts</CardTitle>
              <CardDescription>Monitoring real-time network</CardDescription>
            </CardHeader>
            <CardContent>
              {networkAlerts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Tidak ada alert</p>
                  <p className="text-xs">Alert akan muncul dari MikroTik</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {networkAlerts.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                      <div className="mt-1">
                        {alert.severity === "high" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                        {alert.severity === "medium" && <AlertTriangle className="h-4 w-4 text-warning" />}
                        {alert.severity === "info" && <CheckCircle className="h-4 w-4 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground">{alert.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mikrotik Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Kontrol Mikrotik</CardTitle>
              <CardDescription>Kelola pelanggan secara real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="action">Pilih Aksi</Label>
                <Select value={selectedAction} onValueChange={setSelectedAction}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih aksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="isolate">Isolir Pelanggan</SelectItem>
                    <SelectItem value="activate">Aktivasi Pelanggan</SelectItem>
                    <SelectItem value="bandwidth_limit">Batasi Bandwidth</SelectItem>
                    <SelectItem value="reset_connection">Reset Koneksi</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip">Username PPPoE Pelanggan</Label>
                <Input
                  id="ip"
                  value={targetIP}
                  onChange={(e) => setTargetIP(e.target.value)}
                  placeholder="username_pppoe"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleMikrotikAction}
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Menjalankan...
                  </>
                ) : (
                  "Jalankan Perintah"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminNetwork;
