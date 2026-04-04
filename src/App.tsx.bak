import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes - dilindungi Nginx (hanya 10.10.1.x) */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<AdminCustomers />} />
          <Route path="/admin/customers/:id" element={<CustomerDetail />} />
          <Route path="/admin/packages" element={<AdminPackages />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/registration" element={<AdminRegistration />} />
          <Route path="/admin/installation" element={<AdminInstallation />} />
          <Route path="/admin/inventory" element={<AdminInventory />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/payments" element={<AdminPayments />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/whatsapp" element={<AdminWhatsApp />} />
          <Route path="/admin/network" element={<AdminNetwork />} />
          <Route path="/admin/latency" element={<AdminLatency />} />
          <Route path="/admin/tickets" element={<AdminTickets />} />
          <Route path="/admin/settings" element={<AdminSettings />} />

          {/* Staff routes - dilindungi Nginx (hanya 10.10.1.x) */}
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/tickets" element={<StaffTickets />} />
          <Route path="/staff/troubleshoot" element={<StaffTroubleshoot />} />
          <Route path="/staff/chat" element={<StaffChat />} />
          <Route path="/staff/profile" element={<StaffProfile />} />

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
