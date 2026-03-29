import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Clock,
  CheckCircle,
  MapPin,
  Calendar,
  User,
  Phone
} from "lucide-react";
import { useState } from "react";

const AdminInstallation = () => {
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Registrasi", href: "/admin/registration", icon: <UserPlus className="h-4 w-4" /> },
    { name: "Instalasi", href: "/admin/installation", icon: <Wrench className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const [installations] = useState([
    {
      id: "INST001",
      customer: "Ahmad Fauzi",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, Jakarta",
      package: "Paket Premium",
      technician: "Joko Prasetyo",
      scheduledDate: "2025-01-20",
      scheduledTime: "09:00 - 12:00",
      status: "scheduled",
      priority: "normal"
    },
    {
      id: "INST002",
      customer: "Siti Nurhaliza",
      phone: "082345678901",
      address: "Jl. Sudirman No. 45, Jakarta",
      package: "Paket Standard",
      technician: "Andi Wijaya",
      scheduledDate: "2025-01-18",
      scheduledTime: "13:00 - 16:00",
      status: "in-progress",
      priority: "high"
    },
    {
      id: "INST003",
      customer: "Budi Santoso",
      phone: "083456789012",
      address: "Jl. Gatot Subroto No. 78, Jakarta",
      package: "Paket Basic",
      technician: "Rudi Hartono",
      scheduledDate: "2025-01-17",
      scheduledTime: "09:00 - 12:00",
      status: "completed",
      priority: "normal"
    },
    {
      id: "INST004",
      customer: "Dewi Lestari",
      phone: "084567890123",
      address: "Jl. Thamrin No. 90, Jakarta",
      package: "Paket Ultra",
      technician: "Joko Prasetyo",
      scheduledDate: "2025-01-21",
      scheduledTime: "14:00 - 17:00",
      status: "scheduled",
      priority: "urgent"
    },
    {
      id: "INST005",
      customer: "Eko Prasetyo",
      phone: "085678901234",
      address: "Jl. HR Rasuna Said No. 12, Jakarta",
      package: "Paket Premium",
      technician: "Andi Wijaya",
      scheduledDate: "2025-01-22",
      scheduledTime: "10:00 - 13:00",
      status: "scheduled",
      priority: "normal"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "scheduled":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Terjadwal</Badge>;
      case "in-progress":
        return <Badge className="bg-primary"><Wrench className="h-3 w-3 mr-1" />Sedang Dikerjakan</Badge>;
      case "completed":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgent</Badge>;
      case "high":
        return <Badge className="bg-warning text-warning-foreground">High</Badge>;
      case "normal":
        return <Badge variant="outline">Normal</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  const scheduledCount = installations.filter(i => i.status === "scheduled").length;
  const inProgressCount = installations.filter(i => i.status === "in-progress").length;
  const completedCount = installations.filter(i => i.status === "completed").length;

  return (
    <DashboardLayout
      title="Manajemen Instalasi" 
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Manajemen Instalasi</h2>
        <p className="text-muted-foreground">Kelola jadwal instalasi pelanggan baru</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Instalasi</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{installations.length}</div>
            <p className="text-xs text-muted-foreground">Minggu ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terjadwal</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{scheduledCount}</div>
            <p className="text-xs text-muted-foreground">Menunggu dikerjakan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sedang Dikerjakan</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Dalam proses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">Minggu ini</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua ({installations.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Terjadwal ({scheduledCount})</TabsTrigger>
          <TabsTrigger value="in-progress">Sedang Dikerjakan ({inProgressCount})</TabsTrigger>
          <TabsTrigger value="completed">Selesai ({completedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {installations.map((inst) => (
            <Card key={inst.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inst.customer}</CardTitle>
                    <CardDescription>{inst.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(inst.priority)}
                    {getStatusBadge(inst.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="font-medium">{inst.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Alamat</p>
                        <p className="font-medium">{inst.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Paket</p>
                        <p className="font-medium">{inst.package}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Teknisi</p>
                        <p className="font-medium">{inst.technician}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Jadwal</p>
                        <p className="font-medium">{inst.scheduledDate}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Waktu</p>
                        <p className="font-medium">{inst.scheduledTime}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 pt-4 border-t">
                  {inst.status === "scheduled" && (
                    <Button className="flex-1">
                      <Wrench className="h-4 w-4 mr-2" />
                      Mulai Instalasi
                    </Button>
                  )}
                  {inst.status === "in-progress" && (
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Selesaikan Instalasi
                    </Button>
                  )}
                  <Button variant="outline">Detail</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="scheduled">
          {installations.filter(i => i.status === "scheduled").map((inst) => (
            <Card key={inst.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inst.customer}</CardTitle>
                    <CardDescription>{inst.id}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {getPriorityBadge(inst.priority)}
                    {getStatusBadge(inst.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Teknisi:</strong> {inst.technician}</p>
                <p className="text-sm mb-2"><strong>Jadwal:</strong> {inst.scheduledDate} ({inst.scheduledTime})</p>
                <p className="text-sm mb-4"><strong>Alamat:</strong> {inst.address}</p>
                <Button className="w-full"><Wrench className="h-4 w-4 mr-2" />Mulai Instalasi</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="in-progress">
          {installations.filter(i => i.status === "in-progress").map((inst) => (
            <Card key={inst.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inst.customer}</CardTitle>
                    <CardDescription>{inst.id}</CardDescription>
                  </div>
                  {getStatusBadge(inst.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Teknisi:</strong> {inst.technician}</p>
                <p className="text-sm mb-4"><strong>Alamat:</strong> {inst.address}</p>
                <Button className="w-full"><CheckCircle className="h-4 w-4 mr-2" />Selesaikan Instalasi</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="completed">
          {installations.filter(i => i.status === "completed").map((inst) => (
            <Card key={inst.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{inst.customer}</CardTitle>
                    <CardDescription>{inst.id}</CardDescription>
                  </div>
                  {getStatusBadge(inst.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Teknisi:</strong> {inst.technician}</p>
                <p className="text-sm mb-2"><strong>Tanggal:</strong> {inst.scheduledDate}</p>
                <p className="text-sm"><strong>Paket:</strong> {inst.package}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminInstallation;
