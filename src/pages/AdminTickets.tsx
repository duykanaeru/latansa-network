import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ticketsAPI, customersAPI } from "@/lib/api";
import { Ticket, Search, Clock, CheckCircle, AlertTriangle, MessageSquare, BarChart3, Wrench, Users, CreditCard, Network, UserCheck } from "lucide-react";

const AdminTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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
      const [ticketsData, customersData] = await Promise.all([
        ticketsAPI.getAll(),
        customersAPI.getAll()
      ]);
      setTickets(ticketsData);
      setCustomers(customersData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title?.toLowerCase().includes(searchTerm.toLowerCase()) || ticket.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge className="bg-destructive text-destructive-foreground"><Clock className="h-3 w-3 mr-1" />Buka</Badge>;
      case "in_progress": return <Badge className="bg-warning text-warning-foreground"><Wrench className="h-3 w-3 mr-1" />Dikerjakan</Badge>;
      case "resolved": return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>;
      case "closed": return <Badge variant="secondary">Ditutup</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge className="bg-destructive text-destructive-foreground">Darurat</Badge>;
      case "high": return <Badge className="bg-warning text-warning-foreground">Tinggi</Badge>;
      case "medium": return <Badge className="bg-primary text-primary-foreground">Sedang</Badge>;
      case "low": return <Badge variant="secondary">Rendah</Badge>;
      default: return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return "-";
    const diffInHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    if (diffInHours < 1) return "Baru saja";
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    return `${Math.floor(diffInHours / 24)} hari lalu`;
  };

  if (loading) {
    return (
      <DashboardLayout title="Manajemen Tiket" userRole="admin" userName="Admin" navigation={navigation}>
        <div className="space-y-6"><Skeleton className="h-12 w-full" /><Skeleton className="h-64 w-full" /></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Manajemen Tiket" userRole="admin" userName="Admin" navigation={navigation}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Semua Tiket Support</h2>
          <p className="text-muted-foreground">Monitor dan kelola semua tiket pelanggan</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
              <Input placeholder="Cari tiket..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="open">Buka</SelectItem>
                <SelectItem value="in_progress">Dikerjakan</SelectItem>
                <SelectItem value="resolved">Selesai</SelectItem>
                <SelectItem value="closed">Ditutup</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Prioritas" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Prioritas</SelectItem>
                <SelectItem value="urgent">Darurat</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="low">Rendah</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Tiket ({filteredTickets.length})</CardTitle>
          <CardDescription>Semua tiket support pelanggan</CardDescription>
        </CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12">
              <Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Belum Ada Tiket</h3>
              <p className="text-muted-foreground">Tiket akan muncul ketika pelanggan membuat laporan</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiket</TableHead><TableHead>Pelanggan</TableHead>
                  <TableHead>Prioritas</TableHead><TableHead>Status</TableHead><TableHead>Dibuat</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell>
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-sm text-muted-foreground">{ticket.category}</div>
                    </TableCell>
                    <TableCell>{ticket.customers?.name || '-'}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getTimeAgo(ticket.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold">{tickets.length}</div><p className="text-sm text-muted-foreground">Total Tiket</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-destructive">{tickets.filter(t => t.status === 'open').length}</div><p className="text-sm text-muted-foreground">Terbuka</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-warning">{tickets.filter(t => t.status === 'in_progress').length}</div><p className="text-sm text-muted-foreground">Dikerjakan</p></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-success">{tickets.filter(t => t.status === 'resolved').length}</div><p className="text-sm text-muted-foreground">Selesai</p></div></CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminTickets;
