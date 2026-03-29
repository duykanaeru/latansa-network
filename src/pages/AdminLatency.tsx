import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  RefreshCw,
  BarChart3,
  Users,
  CreditCard,
  MessageSquare,
  Gamepad2,
  Tv,
  Globe,
  Network,
  Ticket,
  Loader2
} from "lucide-react";

// Import logos
import facebookLogo from "@/assets/logos/facebook.svg";
import instagramLogo from "@/assets/logos/instagram.svg";
import twitterLogo from "@/assets/logos/twitter.svg";
import whatsappLogo from "@/assets/logos/whatsapp.svg";
import youtubeLogo from "@/assets/logos/youtube.svg";
import tiktokLogo from "@/assets/logos/tiktok.svg";
import mobileLegendsLogo from "@/assets/logos/mobilelegends.png";
import pubgLogo from "@/assets/logos/pubg.svg";
import freefireLogo from "@/assets/logos/freefire.png";
import genshinLogo from "@/assets/logos/genshin.png";
import codLogo from "@/assets/logos/cod.png";
import valorantLogo from "@/assets/logos/valorant.svg";
import netflixLogo from "@/assets/logos/netflix.svg";
import disneyLogo from "@/assets/logos/disney.png";
import viuLogo from "@/assets/logos/viu.png";
import iqiyiLogo from "@/assets/logos/iqiyi.png";
import primeLogo from "@/assets/logos/prime.png";
import spotifyLogo from "@/assets/logos/spotify.svg";
import { supabase } from "@/integrations/supabase/client";

interface LatencyData {
  name: string;
  latency: number | null;
  logo: string;
  loading: boolean;
}

const AdminLatency = () => {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [socialMediaLatency, setSocialMediaLatency] = useState<LatencyData[]>([
    { name: "Facebook", latency: null, logo: facebookLogo, loading: true },
    { name: "Instagram", latency: null, logo: instagramLogo, loading: true },
    { name: "Twitter/X", latency: null, logo: twitterLogo, loading: true },
    { name: "WhatsApp Web", latency: null, logo: whatsappLogo, loading: true },
    { name: "YouTube", latency: null, logo: youtubeLogo, loading: true },
    { name: "TikTok", latency: null, logo: tiktokLogo, loading: true },
  ]);
  
  const [gamingLatency, setGamingLatency] = useState<LatencyData[]>([
    { name: "Mobile Legends", latency: null, logo: mobileLegendsLogo, loading: true },
    { name: "PUBG Mobile", latency: null, logo: pubgLogo, loading: true },
    { name: "Free Fire", latency: null, logo: freefireLogo, loading: true },
    { name: "Genshin Impact", latency: null, logo: genshinLogo, loading: true },
    { name: "Call of Duty Mobile", latency: null, logo: codLogo, loading: true },
    { name: "Valorant", latency: null, logo: valorantLogo, loading: true },
  ]);
  
  const [streamingLatency, setStreamingLatency] = useState<LatencyData[]>([
    { name: "Netflix", latency: null, logo: netflixLogo, loading: true },
    { name: "Disney+", latency: null, logo: disneyLogo, loading: true },
    { name: "Viu", latency: null, logo: viuLogo, loading: true },
    { name: "iQiyi", latency: null, logo: iqiyiLogo, loading: true },
    { name: "Prime Video", latency: null, logo: primeLogo, loading: true },
    { name: "Spotify", latency: null, logo: spotifyLogo, loading: true },
  ]);

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const getLatencyColor = (latency: number | null) => {
    if (latency === null) return "text-muted-foreground";
    if (latency > 100) return "text-destructive";
    if (latency > 50) return "text-warning";
    return "text-success";
  };

  const getLatencyStatus = (latency: number | null) => {
    if (latency === null) return "Loading";
    if (latency > 100) return "Slow";
    if (latency > 50) return "OK";
    return "Good";
  };

  const handleRefreshLatency = async () => {
    setIsRefreshing(true);
    
    // Set all to loading
    setSocialMediaLatency(prev => prev.map(s => ({ ...s, loading: true, latency: null })));
    setGamingLatency(prev => prev.map(s => ({ ...s, loading: true, latency: null })));
    setStreamingLatency(prev => prev.map(s => ({ ...s, loading: true, latency: null })));

    toast({
      title: "Refresh Latency",
      description: "Mengambil data latency dari MikroTik...",
    });

    // Simulasi loading karena latency real harus diambil dari MikroTik
    setTimeout(() => {
      setSocialMediaLatency(prev => prev.map(s => ({ ...s, loading: false })));
      setGamingLatency(prev => prev.map(s => ({ ...s, loading: false })));
      setStreamingLatency(prev => prev.map(s => ({ ...s, loading: false })));
      setIsRefreshing(false);
      
      toast({
        title: "Perlu Konfigurasi",
        description: "Latency monitoring memerlukan konfigurasi MikroTik tools/ping",
        variant: "destructive"
      });
    }, 2000);
  };

  useEffect(() => {
    // Initial load - set to not loading but show null values
    setTimeout(() => {
      setSocialMediaLatency(prev => prev.map(s => ({ ...s, loading: false })));
      setGamingLatency(prev => prev.map(s => ({ ...s, loading: false })));
      setStreamingLatency(prev => prev.map(s => ({ ...s, loading: false })));
    }, 1000);
  }, []);

  const renderServiceCard = (service: LatencyData, index: number) => (
    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
      <div className="flex items-center gap-3">
        <img src={service.logo} alt={service.name} className="h-5 w-5 object-contain" />
        <span className="font-medium text-sm">{service.name}</span>
      </div>
      <div className="flex items-center gap-2">
        {service.loading ? (
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        ) : (
          <>
            <span className={`font-bold ${getLatencyColor(service.latency)}`}>
              {service.latency !== null ? `${service.latency}ms` : "-"}
            </span>
            <Badge 
              variant="secondary" 
              className={`text-xs ${
                service.latency === null ? 'bg-muted text-muted-foreground' :
                service.latency > 100 ? 'bg-destructive/10 text-destructive' : 
                service.latency > 50 ? 'bg-warning/10 text-warning' : 
                'bg-success/10 text-success'
              }`}
            >
              {getLatencyStatus(service.latency)}
            </Badge>
          </>
        )}
      </div>
    </div>
  );

  return (
    <DashboardLayout
      title="Latency Monitoring"
      userRole="admin"
      userName="Admin Utama"
      navigation={navigation}
    >
      {/* Latency Monitoring untuk Website & Aplikasi Populer */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Latency Monitoring - Website & Aplikasi Populer</CardTitle>
          <CardDescription>
            Monitor latency ke platform sosmed, gaming, dan streaming
            <br />
            <span className="text-warning">Data latency akan diambil dari MikroTik tools/ping</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Social Media & Websites */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Social Media & Websites</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {socialMediaLatency.map((service, index) => renderServiceCard(service, index))}
              </div>
            </div>

            {/* Gaming */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Gaming</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {gamingLatency.map((service, index) => renderServiceCard(service, index))}
              </div>
            </div>

            {/* Streaming */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tv className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Streaming & Entertainment</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {streamingLatency.map((service, index) => renderServiceCard(service, index))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshLatency}
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh Latency
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default AdminLatency;
