import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Users, 
  CreditCard, 
  AlertTriangle,
  BarChart3,
  Network,
  MessageSquare,
  Shield,
  Bell,
  Mail,
  Server,
  Database,
  Wifi,
  DollarSign,
  Clock,
  Settings as SettingsIcon
} from "lucide-react";

const AdminSettings = () => {
  const { toast } = useToast();
  const [mikrotikConfig, setMikrotikConfig] = useState({
    id: '',
    name: 'Router Utama',
    host: '',
    port: 8728,
    username: '',
    password: '',
    use_ssl: false,
  });
  const [isSavingNetwork, setIsSavingNetwork] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  useEffect(() => {
    loadMikrotikConfig();
  }, []);

  const loadMikrotikConfig = async () => {
    const { data, error } = await supabase
      .from('mikrotik_config')
      .select('*')
      .eq('is_active', true)
      .limit(1)
      .single();

    if (data && !error) {
      setMikrotikConfig({
        id: data.id,
        name: data.name,
        host: data.host,
        port: data.port,
        username: data.username,
        password: data.password,
        use_ssl: data.use_ssl,
      });
    }
  };

  const handleSaveNetwork = async () => {
    setIsSavingNetwork(true);
    try {
      const updateData = {
        name: mikrotikConfig.name,
        host: mikrotikConfig.host,
        port: mikrotikConfig.port,
        username: mikrotikConfig.username,
        password: mikrotikConfig.password,
        use_ssl: mikrotikConfig.use_ssl,
        updated_at: new Date().toISOString(),
      };

      if (mikrotikConfig.id) {
        const { error } = await supabase
          .from('mikrotik_config')
          .update(updateData)
          .eq('id', mikrotikConfig.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('mikrotik_config')
          .insert({ ...updateData, is_active: true });
        if (error) throw error;
      }

      toast({
        title: "Berhasil",
        description: "Konfigurasi MikroTik berhasil disimpan",
      });
    } catch (error: any) {
      toast({
        title: "Gagal",
        description: error.message || "Gagal menyimpan konfigurasi",
        variant: "destructive",
      });
    } finally {
      setIsSavingNetwork(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingConnection(true);
    try {
      const { data, error } = await supabase.functions.invoke('mikrotik-control', {
        body: { action: 'get_traffic' }
      });
      if (error) throw error;
      if (data?.success) {
        toast({ title: "Koneksi Berhasil", description: `Terhubung ke MikroTik ${mikrotikConfig.host}` });
      } else {
        toast({ title: "Koneksi Gagal", description: data?.error || "Tidak bisa terhubung ke MikroTik", variant: "destructive" });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSave = (section: string) => {
    toast({
      title: "Pengaturan Disimpan",
      description: `Pengaturan ${section} telah berhasil disimpan`,
    });
  };

  return (
    <DashboardLayout
      title="Pengaturan Sistem" 
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-6 gap-2">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="packages">Paket</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>Konfigurasi dasar sistem ISP</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="company-name">Nama Perusahaan</Label>
                  <Input id="company-name" defaultValue="Latansa Network" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-email">Email Perusahaan</Label>
                  <Input id="company-email" type="email" defaultValue="admin@latansanetwork.com" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-phone">Telepon Support</Label>
                  <Input id="company-phone" defaultValue="+62 21 5555 0000" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company-address">Alamat Kantor</Label>
                  <Input id="company-address" defaultValue="Jl. Gatot Subroto No. 123, Jakarta" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Pengaturan Waktu</h4>
                <div className="grid gap-2">
                  <Label htmlFor="timezone">Zona Waktu</Label>
                  <Input id="timezone" defaultValue="Asia/Jakarta (GMT+7)" disabled />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="date-format">Format Tanggal</Label>
                  <Input id="date-format" defaultValue="DD/MM/YYYY" />
                </div>
              </div>

              <Button onClick={() => handleSave("Umum")}>
                Simpan Pengaturan Umum
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Package Settings */}
        <TabsContent value="packages" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wifi className="h-5 w-5" />
                Pengaturan Paket Internet
              </CardTitle>
              <CardDescription>Kelola paket dan layanan internet</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Auto Upgrade/Downgrade</p>
                  <p className="text-sm text-muted-foreground">Otomatis ubah paket berdasarkan pembayaran</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">Paket Trial</p>
                  <p className="text-sm text-muted-foreground">Aktifkan paket trial untuk pelanggan baru</p>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Batas Kecepatan Default</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="min-speed">Kecepatan Minimum (Mbps)</Label>
                    <Input id="min-speed" type="number" defaultValue="5" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-speed">Kecepatan Maximum (Mbps)</Label>
                    <Input id="max-speed" type="number" defaultValue="1000" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Fair Usage Policy (FUP)</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="fup-limit">Batas FUP (GB)</Label>
                    <Input id="fup-limit" type="number" defaultValue="500" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="fup-speed">Kecepatan Setelah FUP (Mbps)</Label>
                    <Input id="fup-speed" type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Paket")}>
                Simpan Pengaturan Paket
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Pengaturan Billing
              </CardTitle>
              <CardDescription>Konfigurasi sistem pembayaran dan tagihan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Siklus Billing</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="billing-cycle">Siklus Default</Label>
                    <Input id="billing-cycle" defaultValue="Bulanan" disabled />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="billing-date">Tanggal Jatuh Tempo</Label>
                    <Input id="billing-date" type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Pengingat Pembayaran</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Kirim Reminder Otomatis</p>
                    <p className="text-sm text-muted-foreground">Via WhatsApp & Email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-1">Pengingat 1 (hari sebelum)</Label>
                    <Input id="reminder-1" type="number" defaultValue="7" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-2">Pengingat 2 (hari sebelum)</Label>
                    <Input id="reminder-2" type="number" defaultValue="3" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reminder-3">Pengingat 3 (di hari H)</Label>
                    <Input id="reminder-3" type="number" defaultValue="0" disabled />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Tindakan Tunggakan</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="grace-period">Masa Tenggang (hari)</Label>
                    <Input id="grace-period" type="number" defaultValue="3" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="auto-isolate">Auto Isolir Setelah (hari)</Label>
                    <Input id="auto-isolate" type="number" defaultValue="7" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto Isolir</p>
                    <p className="text-sm text-muted-foreground">Otomatis isolir pelanggan yang menunggak</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Denda & Biaya</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="late-fee">Denda Keterlambatan (Rp)</Label>
                    <Input id="late-fee" type="number" defaultValue="50000" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="reconnect-fee">Biaya Reaktivasi (Rp)</Label>
                    <Input id="reconnect-fee" type="number" defaultValue="100000" />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Billing")}>
                Simpan Pengaturan Billing
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Network Settings */}
        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Pengaturan Network & MikroTik
              </CardTitle>
              <CardDescription>Konfigurasi koneksi router MikroTik</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Koneksi MikroTik</h4>
                <div className="grid gap-2">
                  <Label htmlFor="mikrotik-name">Nama Router</Label>
                  <Input 
                    id="mikrotik-name" 
                    value={mikrotikConfig.name}
                    onChange={(e) => setMikrotikConfig(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Router Utama"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="mikrotik-host">Host / IP Address</Label>
                    <Input 
                      id="mikrotik-host" 
                      value={mikrotikConfig.host}
                      onChange={(e) => setMikrotikConfig(prev => ({ ...prev, host: e.target.value }))}
                      placeholder="192.168.1.1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mikrotik-port">Port REST API</Label>
                    <Input 
                      id="mikrotik-port" 
                      type="number" 
                      value={mikrotikConfig.port}
                      onChange={(e) => setMikrotikConfig(prev => ({ ...prev, port: parseInt(e.target.value) || 0 }))}
                      placeholder="8728"
                    />
                    <p className="text-xs text-muted-foreground">Default REST API: 80 (HTTP) / 443 (HTTPS)</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="mikrotik-user">Username</Label>
                    <Input 
                      id="mikrotik-user" 
                      value={mikrotikConfig.username}
                      onChange={(e) => setMikrotikConfig(prev => ({ ...prev, username: e.target.value }))}
                      placeholder="admin"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mikrotik-pass">Password</Label>
                    <Input 
                      id="mikrotik-pass" 
                      type="password"
                      value={mikrotikConfig.password}
                      onChange={(e) => setMikrotikConfig(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Gunakan SSL/HTTPS</p>
                    <p className="text-sm text-muted-foreground">Koneksi terenkripsi ke MikroTik REST API</p>
                  </div>
                  <Switch 
                    checked={mikrotikConfig.use_ssl}
                    onCheckedChange={(checked) => setMikrotikConfig(prev => ({ ...prev, use_ssl: checked }))}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSaveNetwork} disabled={isSavingNetwork}>
                  {isSavingNetwork ? "Menyimpan..." : "Simpan Konfigurasi MikroTik"}
                </Button>
                <Button variant="outline" onClick={handleTestConnection} disabled={isTestingConnection}>
                  {isTestingConnection ? "Menguji..." : "Test Koneksi"}
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Monitoring Jaringan</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="ping-interval">Interval Ping (detik)</Label>
                    <Input id="ping-interval" type="number" defaultValue="30" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="timeout">Timeout (detik)</Label>
                    <Input id="timeout" type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Bandwidth Management</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Dynamic Queue</p>
                    <p className="text-sm text-muted-foreground">Pengaturan bandwidth dinamis</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Burst Mode</p>
                    <p className="text-sm text-muted-foreground">Kecepatan burst untuk pelanggan</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>Kelola notifikasi dan pemberitahuan sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Notifikasi Pembayaran</p>
                      <p className="text-sm text-muted-foreground">Email konfirmasi pembayaran ke pelanggan</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Notifikasi Tiket</p>
                      <p className="text-sm text-muted-foreground">Update status tiket support</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Notifikasi Gangguan</p>
                      <p className="text-sm text-muted-foreground">Info gangguan jaringan</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">WhatsApp Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Reminder Pembayaran</p>
                      <p className="text-sm text-muted-foreground">Pengingat via WhatsApp</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Notifikasi Isolir</p>
                      <p className="text-sm text-muted-foreground">Pemberitahuan saat layanan diisolir</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Konfirmasi Aktivasi</p>
                      <p className="text-sm text-muted-foreground">Pemberitahuan saat layanan diaktifkan</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Admin Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Pelanggan Baru</p>
                      <p className="text-sm text-muted-foreground">Notifikasi saat ada pelanggan baru</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Pembayaran Masuk</p>
                      <p className="text-sm text-muted-foreground">Notifikasi saat pembayaran diterima</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Tiket Baru</p>
                      <p className="text-sm text-muted-foreground">Notifikasi saat ada tiket support baru</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSave("Notifikasi")}>
                Simpan Pengaturan Notifikasi
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Pengaturan Keamanan
              </CardTitle>
              <CardDescription>Konfigurasi keamanan dan akses sistem</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Kebijakan Password</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="min-password">Panjang Minimum Password</Label>
                    <Input id="min-password" type="number" defaultValue="8" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password-expiry">Masa Berlaku Password (hari)</Label>
                    <Input id="password-expiry" type="number" defaultValue="90" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Require Special Characters</p>
                    <p className="text-sm text-muted-foreground">Password harus mengandung karakter khusus</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Two-Factor Authentication (2FA)</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable 2FA untuk Admin</p>
                    <p className="text-sm text-muted-foreground">Keamanan tambahan untuk akun administrator</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable 2FA untuk Staff</p>
                    <p className="text-sm text-muted-foreground">Keamanan tambahan untuk akun staff</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Session Management</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="session-timeout">Session Timeout (menit)</Label>
                    <Input id="session-timeout" type="number" defaultValue="60" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="max-login">Max Login Attempts</Label>
                    <Input id="max-login" type="number" defaultValue="5" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Auto Logout on Idle</p>
                    <p className="text-sm text-muted-foreground">Logout otomatis saat tidak aktif</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">IP Whitelist</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable IP Whitelist</p>
                    <p className="text-sm text-muted-foreground">Batasi akses berdasarkan IP</p>
                  </div>
                  <Switch />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                  <Input id="allowed-ips" placeholder="192.168.1.1, 192.168.1.2" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Audit Log</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Enable Audit Log</p>
                    <p className="text-sm text-muted-foreground">Catat semua aktivitas sistem</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="log-retention">Log Retention Period (hari)</Label>
                  <Input id="log-retention" type="number" defaultValue="365" />
                </div>
              </div>

              <Button onClick={() => handleSave("Keamanan")}>
                Simpan Pengaturan Keamanan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminSettings;