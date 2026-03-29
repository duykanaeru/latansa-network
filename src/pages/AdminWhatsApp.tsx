import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageSquare, 
  Settings,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  BarChart3,
  CreditCard,
  Network,
  Shield,
  Phone,
  Bot,
  Calendar,
  DollarSign
} from "lucide-react";
import { useState } from "react";
import { mockCustomers, mockPayments } from "@/lib/data";
import { Ticket } from "lucide-react";

const AdminWhatsApp = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [autoReminder, setAutoReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const waStats = [
    {
      title: "Pesan Terkirim Hari Ini",
      value: "247",
      change: "+18% dari kemarin",
      icon: <Send className="h-8 w-8 text-primary" />,
    },
    {
      title: "Reminder Aktif",
      value: "89",
      change: "23 jatuh tempo hari ini",
      icon: <Clock className="h-8 w-8 text-warning" />,
    },
    {
      title: "Pembayaran Setelah Reminder",
      value: "156",
      change: "85% response rate",
      icon: <CheckCircle className="h-8 w-8 text-success" />,
    },
    {
      title: "Pelanggan Aktif",
      value: "342",
      change: "Terdaftar di WhatsApp",
      icon: <Users className="h-8 w-8 text-info" />,
    }
  ];

  const messageTemplates = [
    {
      id: "1",
      name: "Reminder H-3",
      type: "reminder",
      status: "active",
      message: "Halo {nama_pelanggan}, tagihan internet Anda sebesar Rp {jumlah_tagihan} akan jatuh tempo pada {tanggal_jatuh_tempo}. Silakan lakukan pembayaran untuk menghindari pemutusan layanan."
    },
    {
      id: "2", 
      name: "Reminder H-1",
      type: "urgent",
      status: "active",
      message: "URGENT: Tagihan internet Anda sebesar Rp {jumlah_tagihan} jatuh tempo BESOK ({tanggal_jatuh_tempo}). Segera lakukan pembayaran untuk menghindari pemutusan layanan."
    },
    {
      id: "3",
      name: "Konfirmasi Pembayaran",
      type: "confirmation",
      status: "active",
      message: "Terima kasih {nama_pelanggan}! Pembayaran Anda sebesar Rp {jumlah_bayar} telah diterima. Layanan internet Anda akan tetap aktif."
    }
  ];

  const recentMessages = [
    {
      id: "1",
      customer: "Ahmad Rizki",
      phone: "+62812345678",
      type: "reminder",
      status: "delivered",
      sent_at: "2024-01-15 09:30",
      amount: 150000
    },
    {
      id: "2",
      customer: "Siti Nurhaliza", 
      phone: "+62823456789",
      type: "urgent",
      status: "read",
      sent_at: "2024-01-15 08:15",
      amount: 200000
    },
    {
      id: "3",
      customer: "Budi Santoso",
      phone: "+62834567890", 
      type: "confirmation",
      status: "delivered",
      sent_at: "2024-01-15 07:45",
      amount: 175000
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return <Badge className="bg-success text-success-foreground">Terkirim</Badge>;
      case "read":
        return <Badge className="bg-info text-info-foreground">Dibaca</Badge>;
      case "failed":
        return <Badge className="bg-destructive text-destructive-foreground">Gagal</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "reminder":
        return <Badge variant="outline">Reminder</Badge>;
      case "urgent":
        return <Badge className="bg-warning text-warning-foreground">Urgent</Badge>;
      case "confirmation":
        return <Badge className="bg-success text-success-foreground">Konfirmasi</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Bot WhatsApp Penagihan"
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Connection Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-6 w-6" />
              <CardTitle>Status Koneksi WhatsApp</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              {isConnected ? (
                <Badge className="bg-success text-success-foreground">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Terhubung
                </Badge>
              ) : (
                <Badge className="bg-destructive text-destructive-foreground">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Tidak Terhubung
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Hubungkan bot WhatsApp untuk mengirim reminder tagihan otomatis
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="wa-token">WhatsApp Business API Token</Label>
                  <Input id="wa-token" placeholder="Masukkan token API" type="password" />
                </div>
                <div>
                  <Label htmlFor="wa-phone">Nomor WhatsApp Business</Label>
                  <Input id="wa-phone" placeholder="+628xxxxx" />
                </div>
              </div>
              <Button onClick={() => setIsConnected(true)}>
                <Phone className="h-4 w-4 mr-2" />
                Hubungkan WhatsApp
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-success">
                Bot WhatsApp berhasil terhubung dan siap mengirim pesan
              </p>
              <Button variant="outline" onClick={() => setIsConnected(false)}>
                Putuskan Koneksi
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {waStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Pengaturan</TabsTrigger>
          <TabsTrigger value="templates">Template Pesan</TabsTrigger>
          <TabsTrigger value="messages">Riwayat Pesan</TabsTrigger>
          <TabsTrigger value="analytics">Analitik</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Pengaturan Reminder Otomatis</CardTitle>
              <CardDescription>
                Konfigurasi pengiriman reminder tagihan otomatis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Aktifkan Reminder Otomatis</Label>
                  <p className="text-sm text-muted-foreground">
                    Kirim reminder tagihan secara otomatis sebelum jatuh tempo
                  </p>
                </div>
                <Switch checked={autoReminder} onCheckedChange={setAutoReminder} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reminder-days">Kirim Reminder (hari sebelum jatuh tempo)</Label>
                  <Select value={reminderDays} onValueChange={setReminderDays}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Hari</SelectItem>
                      <SelectItem value="3">3 Hari</SelectItem>
                      <SelectItem value="7">7 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reminder-time">Waktu Pengiriman</Label>
                  <Input id="reminder-time" type="time" defaultValue="09:00" />
                </div>
              </div>

              <div className="flex space-x-4">
                <Button>
                  <Settings className="h-4 w-4 mr-2" />
                  Simpan Pengaturan
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Test Kirim Pesan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Template Pesan</CardTitle>
              <CardDescription>
                Kelola template pesan untuk berbagai jenis notifikasi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messageTemplates.map((template) => (
                  <Card key={template.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {getTypeBadge(template.type)}
                          <Badge 
                            className={template.status === 'active' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}
                          >
                            {template.status === 'active' ? 'Aktif' : 'Nonaktif'}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          value={template.message}
                          className="min-h-20"
                          readOnly
                        />
                        <div className="flex space-x-2">
                          <Button size="sm">Edit</Button>
                          <Button size="sm" variant="outline">Preview</Button>
                          <Button size="sm" variant="outline">Test</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button className="mt-4">
                <MessageSquare className="h-4 w-4 mr-2" />
                Tambah Template Baru
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="messages">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pesan</CardTitle>
              <CardDescription>
                Monitor pesan WhatsApp yang telah dikirim
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>Nomor HP</TableHead>
                      <TableHead>Jenis</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waktu Kirim</TableHead>
                      <TableHead>Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell className="font-medium">
                          {message.customer}
                        </TableCell>
                        <TableCell>{message.phone}</TableCell>
                        <TableCell>{getTypeBadge(message.type)}</TableCell>
                        <TableCell className="font-semibold">
                          Rp {message.amount.toLocaleString('id-ID')}
                        </TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell>{message.sent_at}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              Detail
                            </Button>
                            <Button size="sm" variant="outline">
                              Kirim Ulang
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tingkat Response</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Pesan Terkirim</span>
                    <span className="font-semibold">247</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Pesan Dibaca</span>
                    <span className="font-semibold">210 (85%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Response Pembayaran</span>
                    <span className="font-semibold">156 (74%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Efektivitas Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Reminder H-3</span>
                    <span className="font-semibold">68% response</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Reminder H-1</span>
                    <span className="font-semibold">89% response</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Konfirmasi</span>
                    <span className="font-semibold">95% delivered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminWhatsApp;