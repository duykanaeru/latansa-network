import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  User, 
  Settings,
  Home,
  ChevronDown
} from "lucide-react";
import logo from "@/assets/logo.png";

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
  userRole: "admin" | "staff" | "customer";
  userName?: string;
  navigation: Array<{
    name: string;
    href: string;
    icon: ReactNode;
  }>;
}

const DashboardLayout = ({ 
  children, 
  title, 
  userRole, 
  userName = "User",
  navigation 
}: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem",
    });
    navigate("/");
  };

  const getRoleColor = () => {
    switch (userRole) {
      case "admin": return "text-destructive";
      case "staff": return "text-warning";
      case "customer": return "text-primary";
      default: return "text-muted-foreground";
    }
  };

  const getRoleLabel = () => {
    switch (userRole) {
      case "admin": return "Administrator";
      case "staff": return "Staff Support";
      case "customer": return "Pelanggan";
      default: return "User";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Latansa Media" className="h-10 w-10" />
              <div>
                <span className="text-lg font-bold text-foreground">Latansa Network</span>
                <div className={`text-xs ${getRoleColor()} font-medium`}>
                  {getRoleLabel()} Panel
                </div>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 h-10">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={getRoleColor()}>
                      {userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">{userName}</div>
                    <div className={`text-xs ${getRoleColor()}`}>{getRoleLabel()}</div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent align="end" className="w-56 bg-card z-50">
                <DropdownMenuItem onClick={() => navigate("/")}>
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Beranda
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                  const profilePath = userRole === "admin" ? "/admin/profile" 
                    : userRole === "staff" ? "/staff/profile" 
                    : "/customer/profile";
                  navigate(profilePath);
                }}>
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(userRole === "admin" ? "/admin/settings" : userRole === "staff" ? "/staff/dashboard" : "/customer/dashboard")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        </div>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;