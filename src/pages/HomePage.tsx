import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wifi, 
  Zap, 
  Shield, 
  HeartHandshake, 
  Phone, 
  Mail,
  MapPin,
  CheckCircle,
  MessageCircle
} from "lucide-react";
import logo from "@/assets/logo.png";
import { supabase } from "@/integrations/supabase/client";

const coverageAreas = [
  { name: "Cibitung", status: "active", description: "Bekasi, Jawa Barat" },
  { name: "Kalideres", status: "active", description: "Jakarta Barat" },
  { name: "Poris", status: "active", description: "Tangerang, Banten" },
];

const WA_NUMBER = "6287772591561";

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(price);
};

const buildWhatsAppLink = (packageName: string, speed: string, price: number) => {
  const message = encodeURIComponent(
    `Halo Latansa Network! 👋\n\nSaya tertarik dengan paket *${packageName}* (${speed}).\nHarga: Rp ${formatPrice(price)}/bulan\n\nMohon info lebih lanjut untuk pendaftaran. Terima kasih! 🙏`
  );
  return `https://wa.me/${WA_NUMBER}?text=${message}`;
};

interface PackageData {
  id: string;
  name: string;
  speed_download: string;
  speed_upload: string;
  price: number;
  description: string | null;
  features: string[] | null;
  is_active: boolean;
}

const PackageCard = ({ pkg }: { pkg: PackageData }) => (
  <Card className="border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col">
    <CardHeader className="text-center pb-4">
      <CardTitle className="text-2xl">{pkg.name}</CardTitle>
      <div className="text-4xl font-bold text-primary">{pkg.speed_download}</div>
      <div className="text-xs text-muted-foreground">↓ {pkg.speed_download} / ↑ {pkg.speed_upload}</div>
      <div className="text-3xl font-bold text-foreground mt-2">
        Rp {formatPrice(pkg.price)}
        <span className="text-base font-normal text-muted-foreground">/bulan</span>
      </div>
    </CardHeader>
    <CardContent className="space-y-4 flex-1 flex flex-col">
      <div className="space-y-3 flex-1">
        {(pkg.features || []).map((feature, idx) => (
          <div key={idx} className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      <a
        href={buildWhatsAppLink(pkg.name, pkg.speed_download, pkg.price)}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white">
          <MessageCircle className="h-4 w-4" />
          Pesan via WhatsApp
        </Button>
      </a>
    </CardContent>
  </Card>
);

const HomePage = () => {
  const [regularPackages, setRegularPackages] = useState<PackageData[]>([]);
  const [dedicatedPackages, setDedicatedPackages] = useState<PackageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true });
      
      if (!error && data) {
        const regular = data.filter(p => !p.name.toLowerCase().startsWith('dedicated'));
        const dedicated = data.filter(p => p.name.toLowerCase().startsWith('dedicated'));
        setRegularPackages(regular);
        setDedicatedPackages(dedicated);
      }
      setLoading(false);
    };
    fetchPackages();
  }, []);

  const services = [
    {
      icon: <Wifi className="h-8 w-8" />,
      title: "Internet Fiber Optic",
      description: "Koneksi internet berkecepatan tinggi dengan teknologi fiber optic terdepan"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Dedicated Internet",
      description: "Bandwidth khusus untuk bisnis dengan SLA terjamin dan support prioritas"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Network Security",
      description: "Keamanan jaringan tingkat enterprise dengan monitoring 24/7"
    },
    {
      icon: <HeartHandshake className="h-8 w-8" />,
      title: "Technical Support",
      description: "Dukungan teknis profesional siap membantu kapanpun Anda membutuhkan"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Services Section */}
      <section id="services" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Layanan Unggulan Kami
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Solusi internet terlengkap untuk kebutuhan personal hingga enterprise
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-border/50">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                    <div className="text-primary">{service.icon}</div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Regular Packages Section */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Paket Internet Reguler
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Cocok untuk kebutuhan rumah tangga dan personal
            </p>
          </div>
          {loading ? (
            <div className="text-center text-muted-foreground">Memuat paket...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {regularPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Dedicated Packages Section */}
      {dedicatedPackages.length > 0 && (
        <section className="py-20 bg-secondary/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Zap className="h-4 w-4" /> Enterprise & Bisnis
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Paket Dedicated Internet
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Bandwidth symmetrical khusus untuk bisnis dengan SLA terjamin
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {dedicatedPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coverage Area Section */}
      <section id="coverage" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Area Jangkauan</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Kami terus berkembang untuk melayani lebih banyak wilayah
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {coverageAreas.map((area, index) => (
              <Card key={index} className="text-center border-green-500/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto bg-green-500/10 p-4 rounded-full w-fit">
                    <MapPin className="h-8 w-8 text-green-500" />
                  </div>
                  <CardTitle className="text-xl">{area.name}</CardTitle>
                  <div className="inline-flex items-center gap-1 bg-green-500/10 text-green-600 px-3 py-1 rounded-full text-sm font-medium mx-auto">
                    <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                    Tersedia
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Belum ada di daerah Anda? Hubungi kami untuk info ekspansi area</p>
            <a
              href={`https://wa.me/6287772591561?text=${encodeURIComponent("Halo Latansa Network! Saya ingin menanyakan ketersediaan layanan di daerah saya.")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="gap-2 bg-green-600 hover:bg-green-700 text-white">
                <MessageCircle className="h-4 w-4" />
                Tanya Ketersediaan Area
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Hubungi Kami</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tim support kami siap membantu Anda 24/7
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Telepon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">+62 877-7259-1561</p>
                <p className="text-sm text-muted-foreground mt-2">WhatsApp 24/7</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">csln@latansa.net</p>
                <p className="text-sm text-muted-foreground mt-2">Respon dalam 1 jam</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lokasi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Jawa Timur, Indonesia</p>
                <p className="text-sm text-muted-foreground mt-2">Area coverage tersedia</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <img src={logo} alt="Latansa Media" className="h-12 w-12" />
              <span className="text-2xl font-bold">Latansa Network</span>
            </div>
            <p className="text-background/80 mb-6">
              Provider internet terpercaya dengan teknologi fiber optic terdepan
            </p>
            <div className="flex justify-center space-x-6 text-sm text-background/60">
              <span>© 2024 Latansa Network. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WA Button */}
      <a
        href={`https://wa.me/6287772591561?text=${encodeURIComponent("Halo Latansa Network! Saya membutuhkan bantuan.")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
        title="Chat via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
};

export default HomePage;