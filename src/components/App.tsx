import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminPackages from "./pages/AdminPackages";
import AdminReports from "./pages/AdminReports";
import AdminStaff from "./pages/AdminStaff";
import AdminRegistration from "./pages/AdminRegistration";
import AdminInstallation from "./pages/AdminInstallation";
import AdminInventory from "./pages/AdminInventory";
import AdminPayments from "./pages/AdminPayments";
import AdminProfile from "./pages/AdminProfile";
import AdminInvoices from "./pages/AdminInvoices";
import CustomerDetail from "./pages/CustomerDetail";
import AdminWhatsApp from "./pages/AdminWhatsApp";
import AdminNetwork from "./pages/AdminNetwork";
import AdminLatency from "./pages/AdminLatency";
import AdminTickets from "./pages/AdminTickets";
import AdminSettings from "./pages/AdminSettings";
import StaffDashboard from "./pages/StaffDashboard";
import StaffTickets from "./pages/StaffTickets";
import StaffTroubleshoot from "./pages/StaffTroubleshoot";
import StaffProfile from "./pages/StaffProfile";
import StaffChat from "./pages/StaffChat";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerBilling from "./pages/CustomerBilling";
import CustomerTickets from "./pages/CustomerTickets";
import CustomerHistory from "./pages/CustomerHistory";
import CustomerProfile from "./pages/CustomerProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Allowed local subnets for admin/staff access
const ALLOWED_SUBNETS = ["10.10.1.", "192.168.20.", "127.0.0.", "::1", "localhost"];

const LocalNetworkGuard = ({ children }: { children: React.ReactNode }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkLocalNetwork = async () => {
      try {
        // Fetch user's IP via public API
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip: string = data.ip;

        // Check if IP is in allowed local range
        const isLocal = ALLOWED_SUBNETS.some(subnet => ip.startsWith(subnet)) ||
          ip === "127.0.0.1" ||
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";

        setAllowed(isLocal);
      } catch {
        // If can't check, allow if accessing from localhost
        const isLocalhost = window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        setAllowed(isLocalhost);
      }
    };
    checkLocalNetwork();
  }, [location]);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Memeriksa akses jaringan...</p>
        </div>
      </div>
    );
  }

  if (!allowed) {
    return <NotFound />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Admin routes - hanya bisa diakses dari jaringan lokal */}
          <Route path="/admin/login" element={<LocalNetworkGuard><AdminLoginPage /></LocalNetworkGuard>} />
          <Route path="/admin/dashboard" element={<LocalNetworkGuard><AdminDashboard /></LocalNetworkGuard>} />
          <Route path="/admin/customers" element={<LocalNetworkGuard><AdminCustomers /></LocalNetworkGuard>} />
          <Route path="/admin/customers/:id" element={<LocalNetworkGuard><CustomerDetail /></LocalNetworkGuard>} />
          <Route path="/admin/packages" element={<LocalNetworkGuard><AdminPackages /></LocalNetworkGuard>} />
          <Route path="/admin/reports" element={<LocalNetworkGuard><AdminReports /></LocalNetworkGuard>} />
          <Route path="/admin/staff" element={<LocalNetworkGuard><AdminStaff /></LocalNetworkGuard>} />
          <Route path="/admin/registration" element={<LocalNetworkGuard><AdminRegistration /></LocalNetworkGuard>} />
          <Route path="/admin/installation" element={<LocalNetworkGuard><AdminInstallation /></LocalNetworkGuard>} />
          <Route path="/admin/inventory" element={<LocalNetworkGuard><AdminInventory /></LocalNetworkGuard>} />
          <Route path="/admin/invoices" element={<LocalNetworkGuard><AdminInvoices /></LocalNetworkGuard>} />
          <Route path="/admin/payments" element={<LocalNetworkGuard><AdminPayments /></LocalNetworkGuard>} />
          <Route path="/admin/profile" element={<LocalNetworkGuard><AdminProfile /></LocalNetworkGuard>} />
          <Route path="/admin/whatsapp" element={<LocalNetworkGuard><AdminWhatsApp /></LocalNetworkGuard>} />
          <Route path="/admin/network" element={<LocalNetworkGuard><AdminNetwork /></LocalNetworkGuard>} />
          <Route path="/admin/latency" element={<LocalNetworkGuard><AdminLatency /></LocalNetworkGuard>} />
          <Route path="/admin/tickets" element={<LocalNetworkGuard><AdminTickets /></LocalNetworkGuard>} />
          <Route path="/admin/settings" element={<LocalNetworkGuard><AdminSettings /></LocalNetworkGuard>} />

          {/* Staff routes - hanya bisa diakses dari jaringan lokal */}
          <Route path="/staff/dashboard" element={<LocalNetworkGuard><StaffDashboard /></LocalNetworkGuard>} />
          <Route path="/staff/tickets" element={<LocalNetworkGuard><StaffTickets /></LocalNetworkGuard>} />
          <Route path="/staff/troubleshoot" element={<LocalNetworkGuard><StaffTroubleshoot /></LocalNetworkGuard>} />
          <Route path="/staff/chat" element={<LocalNetworkGuard><StaffChat /></LocalNetworkGuard>} />
          <Route path="/staff/profile" element={<LocalNetworkGuard><StaffProfile /></LocalNetworkGuard>} />

          {/* Customer routes - bisa diakses dari mana aja */}
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/billing" element={<CustomerBilling />} />
          <Route path="/customer/tickets" element={<CustomerTickets />} />
          <Route path="/customer/history" element={<CustomerHistory />} />
          <Route path="/customer/profile" element={<CustomerProfile />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
