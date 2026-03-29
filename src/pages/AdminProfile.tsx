import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  Bell,
  BarChart3,
  Users,
  CreditCard,
  Network,
  MessageSquare,
  Ticket
} from "lucide-react";

const AdminProfile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "Admin Utama",
    email: "admin@latansanetwork.id",
    phone: "+62 812-3456-7890",
    address: "Jakarta Selatan, Indonesia",
    role: "Administrator"
  });

  const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Kelola Pelanggan", href: "/admin/customers", icon: <Users className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/admin/payments", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/admin/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "WhatsApp Bot", href: "/admin/whatsapp", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Network Control", href: "/admin/network", icon: <Network className="h-4 w-4" /> },
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  const handleChangePassword = () => {
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully",
    });
  };

  return (
    <DashboardLayout
      title="Profile Admin"
      userRole="admin"
      userName={profileData.name}
      navigation={navigation}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.role}</p>
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>Full Access</span>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile and account settings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={profileData.role}
                      disabled
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>Save Changes</Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                <Button onClick={handleChangePassword}>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Payment Alerts</h4>
                      <p className="text-sm text-muted-foreground">Get notified about payments</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Ticket Updates</h4>
                      <p className="text-sm text-muted-foreground">Updates on support tickets</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
                <Button>
                  <Bell className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminProfile;
