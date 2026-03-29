import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { authService } from "@/lib/auth";
import { MessageSquare, CreditCard, BarChart3, FileText, Plus, User, Clock, CheckCircle, AlertCircle, Send, Loader2 } from "lucide-react";

const CustomerTickets = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [saving, setSaving] = useState(false);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [newTicket, setNewTicket] = useState({ title: "", description: "", category: "technical", priority: "medium" });

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/customer/billing", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/customer/tickets", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Riwayat", href: "/customer/history", icon: <FileText className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = authService.getCurrentUser();
        if (!user) return;
        const { data: customerData } = await supabase.from('customers').select('id').eq('user_id', user.id).single();
        if (customerData) {
          setCustomerId(customerData.id);
          const { data: ticketsData } = await supabase.from('tickets').select('*').eq('customer_id', customerData.id).order('created_at', { ascending: false });
          setTickets(ticketsData || []);
        }
      } catch (error) { console.error('Error:', error); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleCreateTicket = async () => {
    if (!customerId || !newTicket.title) { toast({ title: "Error", description: "Lengkapi judul tiket", variant: "destructive" }); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('tickets').insert({ customer_id: customerId, title: newTicket.title, description: newTicket.description, category: newTicket.category, priority: newTicket.priority });
      if (error) throw error;
      toast({ title: "Berhasil", description: "Tiket berhasil dibuat" });
      setShowNewTicket(false);
      setNewTicket({ title: "", description: "", category: "technical", priority: "medium" });
      // Refresh
      const { data } = await supabase.from('tickets').select('*').eq('customer_id', customerId).order('created_at', { ascending: false });
      setTickets(data || []);
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    finally { setSaving(false); }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open": return <Badge variant="destructive"><AlertCircle className="h-3 w-3 mr-1" />Terbuka</Badge>;
      case "in_progress": return <Badge className="bg-warning text-warning-foreground"><Clock className="h-3 w-3 mr-1" />Dikerjakan</Badge>;
      case "resolved": return <Badge className="bg-success text-success-foreground"><CheckCircle className="h-3 w-3 mr-1" />Selesai</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return (<DashboardLayout title="Tiket Support" userRole="customer" userName="Pelanggan" navigation={navigation}><Skeleton className="h-64 w-full" /></DashboardLayout>);
  }

  return (
    <DashboardLayout title="Tiket Support" userRole="customer" userName="Pelanggan" navigation={navigation}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-primary">{tickets.length}</div><div className="text-sm text-muted-foreground">Total Tiket</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-warning">{tickets.filter(t => t.status === "in_progress").length}</div><div className="text-sm text-muted-foreground">Diproses</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-success">{tickets.filter(t => t.status === "resolved").length}</div><div className="text-sm text-muted-foreground">Selesai</div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><Button className="w-full" onClick={() => setShowNewTicket(!showNewTicket)}><Plus className="h-4 w-4 mr-2" />Buat Tiket Baru</Button></CardContent></Card>
      </div>

      {showNewTicket && (
        <Card className="mb-6">
          <CardHeader><CardTitle>Buat Tiket Support Baru</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div><Label>Subjek</Label><Input value={newTicket.title} onChange={e => setNewTicket({...newTicket, title: e.target.value})} placeholder="Contoh: Internet sering putus" /></div>
              <div><Label>Kategori</Label>
                <Select value={newTicket.category} onValueChange={v => setNewTicket({...newTicket, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="technical">Teknis</SelectItem><SelectItem value="billing">Billing</SelectItem><SelectItem value="general">Umum</SelectItem></SelectContent></Select>
              </div>
              <div><Label>Prioritas</Label>
                <Select value={newTicket.priority} onValueChange={v => setNewTicket({...newTicket, priority: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="low">Rendah</SelectItem><SelectItem value="medium">Sedang</SelectItem><SelectItem value="high">Tinggi</SelectItem></SelectContent></Select>
              </div>
              <div><Label>Deskripsi</Label><Textarea value={newTicket.description} onChange={e => setNewTicket({...newTicket, description: e.target.value})} placeholder="Jelaskan masalah..." rows={5} /></div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleCreateTicket} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Mengirim...</> : <><Send className="h-4 w-4 mr-2" />Kirim Tiket</>}</Button>
                <Button variant="outline" onClick={() => setShowNewTicket(false)}>Batal</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2"><CardTitle className="text-lg">{ticket.title}</CardTitle>{getStatusBadge(ticket.status)}</div>
                  <CardDescription>{ticket.category} • {new Date(ticket.created_at).toLocaleDateString('id-ID')}</CardDescription>
                </div>
              </div>
            </CardHeader>
            {ticket.description && (
              <CardContent><p className="text-sm text-muted-foreground">{ticket.description}</p></CardContent>
            )}
          </Card>
        ))}
      </div>

      {tickets.length === 0 && (
        <Card><CardContent className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Belum Ada Tiket</h3>
          <p className="text-muted-foreground mb-4">Buat tiket baru jika membutuhkan bantuan.</p>
          <Button onClick={() => setShowNewTicket(true)}><Plus className="h-4 w-4 mr-2" />Buat Tiket</Button>
        </CardContent></Card>
      )}
    </DashboardLayout>
  );
};

export default CustomerTickets;
