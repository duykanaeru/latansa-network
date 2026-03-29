import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ticketsAPI } from "@/lib/api";
import { Ticket, Clock, CheckCircle, AlertCircle, MessageSquare, Phone, Wrench, BarChart3, User } from "lucide-react";

const StaffDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [tickets, setTickets] = useState<any[]>([]);

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/staff/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Troubleshooting", href: "/staff/troubleshoot", icon: <Wrench className="h-4 w-4" /> },
    { name: "Chat Support", href: "/staff/chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ticketsAPI.getAll();
        setTickets(data);
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const openTickets = tickets.filter(t => t.status === 'open');
  const inProgressTickets = tickets.filter(t => t.status === 'in_progress');
  const resolvedToday = tickets.filter(t => t.status === 'resolved' && new Date(t.updated_at).toDateString() === new Date().toDateString());
  const urgentTickets = tickets.filter(t => (t.priority === 'urgent' || t.priority === 'high') && (t.status === 'open' || t.status === 'in_progress'));

  const stats = [
    { title: "Tiket Pending", value: openTickets.length.toString(), icon: <Clock className="h-8 w-8 text-warning" /> },
    { title: "Tiket Aktif", value: inProgressTickets.length.toString(), icon: <Wrench className="h-8 w-8 text-primary" /> },
    { title: "Selesai Hari Ini", value: resolvedToday.length.toString(), icon: <CheckCircle className="h-8 w-8 text-success" /> },
    { title: "Prioritas Tinggi", value: urgentTickets.length.toString(), icon: <AlertCircle className="h-8 w-8 text-destructive" /> },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) { case "urgent": return "bg-destructive text-destructive-foreground"; case "high": return "bg-warning text-warning-foreground"; default: return "bg-primary text-primary-foreground"; }
  };

  if (loading) {
    return (<DashboardLayout title="Dashboard Staff" userRole="staff" userName="Staff" navigation={navigation}><div className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1,2,3,4].map(i => <Skeleton key={i} className="h-24 w-full" />)}</div><Skeleton className="h-64 w-full" /></div></DashboardLayout>);
  }

  return (
    <DashboardLayout title="Dashboard Staff Support" userRole="staff" userName="Staff" navigation={navigation}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>{stat.icon}</CardHeader>
            <CardContent><div className="text-2xl font-bold">{stat.value}</div></CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Tiket Prioritas Tinggi</CardTitle><CardDescription>Tiket yang butuh penanganan segera</CardDescription></CardHeader>
          <CardContent>
            {urgentTickets.length === 0 ? (
              <div className="text-center py-12"><Ticket className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><p className="text-muted-foreground">Tidak ada tiket prioritas tinggi</p></div>
            ) : (
              <div className="space-y-4">
                {urgentTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border border-border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div><div className="font-medium">{ticket.customers?.name || '-'}</div><div className="text-sm text-muted-foreground">{ticket.title}</div></div>
                      <Badge className={getPriorityColor(ticket.priority)}>{ticket.priority === 'urgent' ? 'Darurat' : 'Tinggi'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />{new Date(ticket.created_at).toLocaleDateString('id-ID')}</div>
                      <Button size="sm"><MessageSquare className="h-3 w-3 mr-1" />Tangani</Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Aksi Cepat</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/staff/tickets'}><Ticket className="h-4 w-4 mr-2" />Lihat Semua Tiket</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/staff/chat'}><MessageSquare className="h-4 w-4 mr-2" />Live Chat</Button>
            <Button className="w-full justify-start" variant="outline" onClick={() => window.location.href = '/staff/troubleshoot'}><Wrench className="h-4 w-4 mr-2" />Troubleshoot</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffDashboard;
