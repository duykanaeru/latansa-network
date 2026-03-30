import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/isp-hero.jpg";

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Internet Super Cepat untuk 
              <span className="text-accent"> Semua Kebutuhan</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed">
              Nikmati koneksi internet fiber optic berkualitas tinggi dengan kecepatan hingga 1 Gbps. 
              Stabil, aman, dan terpercaya untuk rumah dan bisnis Anda.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-accent" />
                <span className="font-semibold">Kecepatan Tinggi</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-accent" />
                <span className="font-semibold">Keamanan Terjamin</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-6 w-6 text-accent" />
                <span className="font-semibold">Support 24/7</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-white font-semibold px-8 py-4 text-lg"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Lihat Paket Internet
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white hover:text-primary font-semibold px-8 py-4 text-lg"
                onClick={() => navigate("/login")}
              >
                Login Pelanggan
              </Button>
            </div>
          </div>

          {/* Stats - data akan diambil dari API */}
          <div className="lg:justify-self-end">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Kenapa Pilih Latansa Network?</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Pelanggan Aktif</span>
                  <span className="text-2xl font-bold text-accent">-</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Uptime</span>
                  <span className="text-2xl font-bold text-accent">99.9%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Kecepatan Maks</span>
                  <span className="text-2xl font-bold text-accent">1 Gbps</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/90">Coverage Area</span>
                  <span className="text-2xl font-bold text-accent">Cibitung, Kalideres, Poris</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
