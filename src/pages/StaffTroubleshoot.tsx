import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Wrench,
  Search,
  Wifi,
  Router,
  Signal,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Network,
  Phone,
  MessageSquare,
  BarChart3,
  Ticket,
  Mail,
  User
} from "lucide-react";

const StaffTroubleshoot = () => {
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/staff/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Troubleshooting", href: "/staff/troubleshoot", icon: <Wrench className="h-4 w-4" /> },
    { name: "Chat Support", href: "/staff/chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const diagnosticTools = [
    {
      name: "Ping Test",
      description: "Test konektivitas ke customer gateway",
      icon: <Signal className="h-6 w-6" />,
      action: "ping"
    },
    {
      name: "Speed Test",
      description: "Uji kecepatan bandwidth customer",
      icon: <Zap className="h-6 w-6" />,
      action: "speedtest"
    },
    {
      name: "Router Status",
      description: "Cek status router dan konfigurasi",
      icon: <Router className="h-6 w-6" />,
      action: "router"
    },
    {
      name: "Network Trace",
      description: "Trace route dan packet loss analysis",
      icon: <Network className="h-6 w-6" />,
      action: "trace"
    }
  ];

  const commonIssues = [
    {
      problem: "Internet Mati Total",
      symptoms: ["No connection", "Router LED merah", "Ping timeout"],
      solutions: [
        "Cek kabel fiber optic",
        "Restart router customer", 
        "Verify router configuration",
        "Check Mikrotik user status"
      ],
      category: "connection",
      priority: "urgent"
    },
    {
      problem: "Kecepatan Lambat",
      symptoms: ["Speed test < 50% promised", "Video buffering", "Download lambat"],
      solutions: [
        "Check bandwidth allocation",
        "Verify QoS settings",
        "Test direct to modem",
        "Check for interference"
      ],
      category: "performance", 
      priority: "high"
    },
    {
      problem: "WiFi Sering Disconnect",
      symptoms: ["WiFi connected tapi no internet", "Frequent reconnections", "DNS issues"],
      solutions: [
        "Change WiFi channel",
        "Update router firmware",
        "Reset WiFi configuration",
        "Check DNS settings"
      ],
      category: "wifi",
      priority: "medium"
    }
  ];

  const recentDiagnostics = [
    {
      customer: "Budi Santoso (NSP-2021-045)",
      tool: "Ping Test",
      result: "Failed - Router tidak merespon",
      status: "failed", 
      time: "2 menit lalu"
    },
    {
      customer: "Siti Nurhaliza (NSP-2023-089)",
      tool: "Speed Test",
      result: "Download: 45 Mbps, Upload: 22 Mbps",
      status: "warning",
      time: "15 menit lalu"
    },
    {
      customer: "Ahmad Rizki (NSP-2024-001)",
      tool: "Router Status", 
      result: "Online - All services normal",
      status: "success",
      time: "1 jam lalu"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-destructive text-destructive-foreground";
      case "high": return "bg-warning text-warning-foreground";
      case "medium": return "bg-primary text-primary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <DashboardLayout
      title="Troubleshooting Tools"
      userRole="staff"
      userName="Staff Technical"
      navigation={navigation}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Lookup & Diagnostic Tools */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Diagnostic Tools</CardTitle>
            <CardDescription>Tools untuk troubleshooting masalah customer</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Search */}
            <div>
              <label className="text-sm font-medium mb-2 block">Cari Pelanggan</label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Masukkan Customer ID atau nama..."
                    className="pl-10"
                  />
                </div>
                <Button>
                  <Search className="h-4 w-4 mr-2" />
                  Cari
                </Button>
              </div>
            </div>

            {/* Diagnostic Tools Grid */}
            <div>
              <label className="text-sm font-medium mb-3 block">Pilih Diagnostic Tool</label>
              <div className="grid grid-cols-2 gap-4">
                {diagnosticTools.map((tool, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-primary">
                          {tool.icon}
                        </div>
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {tool.description}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Run Diagnostic */}
            <div className="pt-4 border-t border-border">
              <div className="flex space-x-4">
                <Button className="flex-1">
                  <Activity className="h-4 w-4 mr-2" />
                  Run Diagnostic
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedCustomer("NSP-2023-089");
                    setShowContactDialog(true);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Customer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Diagnostics */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Diagnostics</CardTitle>
            <CardDescription>History diagnostic terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDiagnostics.map((diagnostic, index) => (
                <div key={index} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">
                      {diagnostic.customer}
                    </div>
                    {getStatusIcon(diagnostic.status)}
                  </div>
                  
                  <div className="text-xs text-muted-foreground mb-1">
                    Tool: {diagnostic.tool}
                  </div>
                  
                  <div className="text-sm mb-2">
                    {diagnostic.result}
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    {diagnostic.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Common Issues Knowledge Base */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Knowledge Base - Common Issues</CardTitle>
          <CardDescription>Panduan mengatasi masalah umum customer</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonIssues.map((issue, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{issue.problem}</CardTitle>
                    <Badge className={getPriorityColor(issue.priority)}>
                      {issue.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Gejala:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {issue.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-sm mb-2">Solusi:</h4>
                    <ul className="text-sm space-y-1">
                      {issue.solutions.map((solution, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="h-3 w-3 text-success mt-1 mr-2 flex-shrink-0" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contact Customer Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Customer</DialogTitle>
            <DialogDescription>Choose how to contact the customer</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <Button className="w-full justify-start" variant="outline">
              <Phone className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>Call Customer</div>
                <div className="text-xs text-muted-foreground">+62 815-6789-0123</div>
              </div>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <MessageSquare className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>WhatsApp</div>
                <div className="text-xs text-muted-foreground">Send via WhatsApp</div>
              </div>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Mail className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>Email Customer</div>
                <div className="text-xs text-muted-foreground">customer@email.com</div>
              </div>
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <User className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>View Profile</div>
                <div className="text-xs text-muted-foreground">See customer details</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default StaffTroubleshoot;