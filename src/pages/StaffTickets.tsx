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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ticketsAPI } from "@/lib/api";
import { Ticket, Search, Clock, CheckCircle, Wrench, MessageSquare, Eye, BarChart3, UserCheck } from "lucide-react";

const StaffTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/staff/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Troubleshooting", href: "/staff/troubleshoot", icon: <Wrench className="h-4 w-4" /> },
    { name: "Chat Support", href: "/staff/chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const fetchData = async () => {
    try {
      const data = await ticketsAPI.getAll();
      setTickets(data);
    } catch (error) { console.error('Error:', error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    try {
      await ticketsAPI.update(ticketId, { status: newStatus });
      toast({ title: "Berhasil", description: "Status tiket diperbarui" });
      fetchData();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

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
    return (<DashboardLayout title="Manajemen Tiket" userRole="staff" userName="Staff" navigation={navigation}><div className="space-y-6"><Skeleton className="h-12 w-full" /><Skeleton className="h-64 w-full" /></div></DashboardLayout>);
  }

  return (
    <DashboardLayout title="Manajemen Tiket" userRole="staff" userName="Staff" navigation={navigation}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div><h2 className="text-2xl font-bold">Tiket Support</h2><p className="text-muted-foreground">Kelola dan tangani tiket pelanggan</p></div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative"><Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" /><Input placeholder="Cari tiket..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" /></div>
            <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Status" /></SelectTrigger><SelectContent><SelectItem value="all">Semua Status</SelectItem><SelectItem value="open">Buka</SelectItem><SelectItem value="in_progress">Dikerjakan</SelectItem><SelectItem value="resolved">Selesai</SelectItem></SelectContent></Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}><SelectTrigger className="w-full lg:w-48"><SelectValue placeholder="Prioritas" /></SelectTrigger><SelectContent><SelectItem value="all">Semua</SelectItem><SelectItem value="urgent">Darurat</SelectItem><SelectItem value="high">Tinggi</SelectItem><SelectItem value="medium">Sedang</SelectItem><SelectItem value="low">Rendah</SelectItem></SelectContent></Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Daftar Tiket ({filteredTickets.length})</CardTitle></CardHeader>
        <CardContent>
          {tickets.length === 0 ? (
            <div className="text-center py-12"><Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Belum Ada Tiket</h3><p className="text-muted-foreground">Tiket akan muncul ketika pelanggan membuat laporan</p></div>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Tiket</TableHead><TableHead>Pelanggan</TableHead><TableHead>Status</TableHead><TableHead>Prioritas</TableHead><TableHead>Waktu</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell><div className="font-medium">{ticket.title}</div><div className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</div></TableCell>
                    <TableCell>{ticket.customers?.name || '-'}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{getTimeAgo(ticket.created_at)}</TableCell>
                    <TableCell>
                      <Select defaultValue={ticket.status} onValueChange={(val) => handleStatusUpdate(ticket.id, val)}>
                        <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="in_progress">Dikerjakan</SelectItem><SelectItem value="resolved">Selesai</SelectItem><SelectItem value="closed">Tutup</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Total</p><p className="text-2xl font-bold">{tickets.length}</p></div><UserCheck className="h-8 w-8 text-primary" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Menunggu</p><p className="text-2xl font-bold text-destructive">{tickets.filter(t => t.status === 'open').length}</p></div><Clock className="h-8 w-8 text-destructive" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Dikerjakan</p><p className="text-2xl font-bold text-warning">{tickets.filter(t => t.status === 'in_progress').length}</p></div><Wrench className="h-8 w-8 text-warning" /></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-muted-foreground">Selesai</p><p className="text-2xl font-bold text-success">{tickets.filter(t => t.status === 'resolved').length}</p></div><CheckCircle className="h-8 w-8 text-success" /></div></CardContent></Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffTickets;
