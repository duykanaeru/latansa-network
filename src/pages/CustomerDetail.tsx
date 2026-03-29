import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockCustomers, mockPayments, mockPackages } from "@/lib/data";
import { 
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Wifi,
  Calendar,
  CreditCard,
  Activity,
  Edit,
  Network,
  MessageSquare,
  BarChart3,
  Users,
  Ticket,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const customer = mockCustomers.find(c => c.id === id) || mockCustomers[0];
  const customerPackage = mockPackages.find(p => p.id === customer.package_id);
  const customerPayments = mockPayments.filter(p => p.customer_id === customer.id);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const connectionLogs = [
    { date: "2024-11-01 08:00", event: "Connection Active", status: "success" },
    { date: "2024-10-28 14:30", event: "Router Restarted", status: "warning" },
    { date: "2024-10-25 09:15", event: "Payment Received", status: "success" },
    { date: "2024-10-20 16:45", event: "Speed Upgrade Applied", status: "success" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success text-success-foreground">Aktif</Badge>;
      case "suspended":
        return <Badge className="bg-warning text-warning-foreground">Suspend</Badge>;
      case "inactive":
        return <Badge variant="secondary">Tidak Aktif</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Lunas</Badge>;
      case "pending":
        return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "overdue":
        return <Badge className="bg-destructive text-destructive-foreground"><AlertCircle className="h-3 w-3 mr-1" />Terlambat</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <DashboardLayout
      title="Detail Pelanggan"
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/admin/customers")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Kembali ke Daftar Pelanggan
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center text-center mb-6">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarFallback className="text-2xl">
                  {customer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <p className="text-sm text-muted-foreground">{customer.id}</p>
              {getStatusBadge(customer.status)}
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{customer.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{customer.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Bergabung: {customer.created_at}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Button className="flex-1" size="sm">
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <MessageSquare className="h-3 w-3 mr-1" />
                Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Details Tabs */}
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <Tabs defaultValue="package" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="package">Paket & Layanan</TabsTrigger>
                <TabsTrigger value="billing">Pembayaran</TabsTrigger>
                <TabsTrigger value="activity">Aktivitas</TabsTrigger>
              </TabsList>

              <TabsContent value="package" className="space-y-4 mt-6">
                <div className="grid gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold">Paket Internet Aktif</h4>
                      <Wifi className="h-5 w-5 text-primary" />
                    </div>
                    {customerPackage && (
                      <>
                        <div className="text-2xl font-bold mb-2">{customerPackage.name}</div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Download Speed:</span>
                            <span className="font-medium">{customerPackage.speed_download}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Upload Speed:</span>
                            <span className="font-medium">{customerPackage.speed_upload}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Harga:</span>
                            <span className="font-medium text-primary">
                              Rp {customerPackage.price.toLocaleString('id-ID')}/bulan
                            </span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" variant="outline">
                          Upgrade Paket
                        </Button>
                      </>
                    )}
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-3">Technical Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Mikrotik Username:</span>
                        <span className="font-mono">{customer.mikrotik_username || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status Koneksi:</span>
                        <Badge className="bg-success text-success-foreground">Online</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Online:</span>
                        <span>Active now</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="billing" className="mt-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Next Payment</div>
                      <div className="text-xl font-bold">{customer.next_payment}</div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Monthly Fee</div>
                      <div className="text-xl font-bold text-primary">
                        Rp {customer.total_amount.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {customerPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.invoice_number}</TableCell>
                          <TableCell>{payment.payment_date}</TableCell>
                          <TableCell>Rp {payment.amount.toLocaleString('id-ID')}</TableCell>
                          <TableCell>{getPaymentStatusBadge(payment.status)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="mt-6">
                <div className="space-y-3">
                  {connectionLogs.map((log, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`h-2 w-2 rounded-full ${
                        log.status === "success" ? "bg-success" :
                        log.status === "warning" ? "bg-warning" :
                        "bg-muted-foreground"
                      }`} />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{log.event}</div>
                        <div className="text-xs text-muted-foreground">{log.date}</div>
                      </div>
                      <Activity className="h-4 w-4 text-muted-foreground" />
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerDetail;
