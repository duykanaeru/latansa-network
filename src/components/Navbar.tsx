import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Users, Settings } from "lucide-react";
import logo from "@/assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "#services" },
    { name: "Paket", href: "#packages" },
    { name: "Kontak", href: "#contact" },
  ];

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Latansa Media" className="h-10 w-10" />
              <span className="text-xl font-bold text-foreground">Latansa Network</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Login Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/login")}
              className="text-muted-foreground hover:text-primary"
            >
              <Users className="h-4 w-4 mr-2" />
              Login Pelanggan
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/login")}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admin/Staff
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-card border-t">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 pb-2 space-y-2">
              <Button 
                variant="ghost" 
                onClick={() => {
                  navigate("/login");
                  setIsOpen(false);
                }}
                className="w-full justify-start text-muted-foreground hover:text-primary"
              >
                <Users className="h-4 w-4 mr-2" />
                Login Pelanggan
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigate("/admin/login");
                  setIsOpen(false);
                }}
                className="w-full justify-start border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin/Staff
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;