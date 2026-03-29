import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  Mail,
  Calendar
} from "lucide-react";
import { useState } from "react";

const AdminRegistration = () => {
  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Paket Internet", href: "/admin/packages", icon: <Package className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Registrasi", href: "/admin/registration", icon: <UserPlus className="h-4 w-4" /> },
    { name: "Laporan", href: "/admin/reports", icon: <FileText className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <AlertTriangle className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const [registrations] = useState([
    {
      id: "REG001",
      name: "Ahmad Fauzi",
      phone: "081234567890",
      email: "ahmad@email.com",
      address: "Jl. Merdeka No. 123, Jakarta",
      package: "Paket Premium",
      status: "pending",
      submittedDate: "2025-01-15",
      notes: "Ingin instalasi hari Sabtu"
    },
    {
      id: "REG002",
      name: "Siti Nurhaliza",
      phone: "082345678901",
      email: "siti@email.com",
      address: "Jl. Sudirman No. 45, Jakarta",
      package: "Paket Standard",
      status: "approved",
      submittedDate: "2025-01-14",
      notes: ""
    },
    {
      id: "REG003",
      name: "Budi Santoso",
      phone: "083456789012",
      email: "budi@email.com",
      address: "Jl. Gatot Subroto No. 78, Jakarta",
      package: "Paket Basic",
      status: "pending",
      submittedDate: "2025-01-15",
      notes: "Lokasi di lantai 5"
    },
    {
      id: "REG004",
      name: "Dewi Lestari",
      phone: "084567890123",
      email: "dewi@email.com",
      address: "Jl. Thamrin No. 90, Jakarta",
      package: "Paket Ultra",
      status: "rejected",
      submittedDate: "2025-01-13",
      notes: "Area belum tercakup"
    }
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "approved":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Disetujui</Badge>;
      case "rejected":
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Ditolak</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pendingCount = registrations.filter(r => r.status === "pending").length;
  const approvedCount = registrations.filter(r => r.status === "approved").length;
  const rejectedCount = registrations.filter(r => r.status === "rejected").length;

  return (
    <DashboardLayout
      title="Registrasi Pelanggan" 
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Registrasi Pelanggan Baru</h2>
        <p className="text-muted-foreground">Kelola pendaftaran pelanggan baru</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Registrasi</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Menunggu Review</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Perlu tindakan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Disetujui</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
            <p className="text-xs text-muted-foreground">Siap instalasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ditolak</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedCount}</div>
            <p className="text-xs text-muted-foreground">Tidak lolos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">Semua ({registrations.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
          <TabsTrigger value="approved">Disetujui ({approvedCount})</TabsTrigger>
          <TabsTrigger value="rejected">Ditolak ({rejectedCount})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {registrations.map((reg) => (
            <Card key={reg.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reg.name}</CardTitle>
                    <CardDescription>{reg.id}</CardDescription>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Telepon</p>
                        <p className="font-medium">{reg.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{reg.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Alamat</p>
                        <p className="font-medium">{reg.address}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Paket Dipilih</p>
                        <p className="font-medium">{reg.package}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground">Tanggal Daftar</p>
                        <p className="font-medium">{reg.submittedDate}</p>
                      </div>
                    </div>
                    {reg.notes && (
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm text-muted-foreground">Catatan</p>
                          <p className="font-medium">{reg.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {reg.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="flex-1">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Setujui
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Setujui Registrasi</DialogTitle>
                          <DialogDescription>
                            Setujui registrasi {reg.name} dan jadwalkan instalasi
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="installation-date">Tanggal Instalasi</Label>
                            <Input id="installation-date" type="date" />
                          </div>
                          <div>
                            <Label htmlFor="technician">Teknisi</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih teknisi" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tech1">Joko Prasetyo</SelectItem>
                                <SelectItem value="tech2">Andi Wijaya</SelectItem>
                                <SelectItem value="tech3">Rudi Hartono</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="w-full">Konfirmasi Persetujuan</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" className="flex-1">
                          <XCircle className="h-4 w-4 mr-2" />
                          Tolak
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Tolak Registrasi</DialogTitle>
                          <DialogDescription>
                            Berikan alasan penolakan untuk {reg.name}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="reason">Alasan Penolakan</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih alasan" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="coverage">Area tidak tercakup</SelectItem>
                                <SelectItem value="capacity">Kapasitas penuh</SelectItem>
                                <SelectItem value="verification">Data tidak valid</SelectItem>
                                <SelectItem value="other">Lainnya</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button variant="destructive" className="w-full">Konfirmasi Penolakan</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending">
          {registrations.filter(r => r.status === "pending").map((reg) => (
            <Card key={reg.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reg.name}</CardTitle>
                    <CardDescription>{reg.id}</CardDescription>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Paket:</strong> {reg.package}</p>
                <p className="text-sm mb-2"><strong>Telepon:</strong> {reg.phone}</p>
                <p className="text-sm mb-4"><strong>Alamat:</strong> {reg.address}</p>
                <div className="flex gap-2">
                  <Button className="flex-1"><CheckCircle className="h-4 w-4 mr-2" />Setujui</Button>
                  <Button variant="destructive" className="flex-1"><XCircle className="h-4 w-4 mr-2" />Tolak</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="approved">
          {registrations.filter(r => r.status === "approved").map((reg) => (
            <Card key={reg.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reg.name}</CardTitle>
                    <CardDescription>{reg.id}</CardDescription>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Paket:</strong> {reg.package}</p>
                <p className="text-sm mb-2"><strong>Telepon:</strong> {reg.phone}</p>
                <p className="text-sm"><strong>Alamat:</strong> {reg.address}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected">
          {registrations.filter(r => r.status === "rejected").map((reg) => (
            <Card key={reg.id} className="mb-4">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{reg.name}</CardTitle>
                    <CardDescription>{reg.id}</CardDescription>
                  </div>
                  {getStatusBadge(reg.status)}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2"><strong>Paket:</strong> {reg.package}</p>
                <p className="text-sm mb-2"><strong>Alasan:</strong> {reg.notes}</p>
                <p className="text-sm"><strong>Tanggal:</strong> {reg.submittedDate}</p>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AdminRegistration;
