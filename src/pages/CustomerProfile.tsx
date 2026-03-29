import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail,
  Phone,
  MapPin,
  Lock,
  Wifi,
  CreditCard,
  Calendar,
  BarChart3,
  MessageSquare,
  FileText
} from "lucide-react";

const CustomerProfile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    customerId: "NSP-2023-089",
    name: "Siti Nurhaliza",
    email: "siti.nurhaliza@email.com",
    phone: "+62 815-6789-0123",
    address: "Jl. Sudirman No. 123, Jakarta Selatan",
    package: "Home Pro - 100 Mbps",
    joinDate: "15 Maret 2023",
    status: "active"
  });

  const navigation = [
    { name: "Dashboard", href: "/customer/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Pembayaran", href: "/customer/billing", icon: <CreditCard className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/customer/tickets", icon: <MessageSquare className="h-4 w-4" /> },
    { name: "Riwayat", href: "/customer/history", icon: <FileText className="h-4 w-4" /> },
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <DashboardLayout
      title="Profile Pelanggan"
      userRole="customer"
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
              <p className="text-sm text-muted-foreground">{profileData.customerId}</p>
              <Badge className="mt-2 bg-success text-success-foreground">
                <Wifi className="h-3 w-3 mr-1" />
                Active Customer
              </Badge>
            </div>

            <div className="space-y-4 mt-8">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs">{profileData.address}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Member sejak {profileData.joinDate}</span>
              </div>
            </div>

            {/* Subscription Info */}
            <div className="mt-8 pt-6 border-t">
              <h3 className="font-semibold mb-3">Current Package</h3>
              <div className="p-4 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{profileData.package}</div>
                    <div className="text-sm text-muted-foreground">Rp 499.000/bulan</div>
                  </div>
                  <Wifi className="h-6 w-6 text-primary" />
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">
                Upgrade Paket
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-id">Customer ID</Label>
                    <Input
                      id="customer-id"
                      value={profileData.customerId}
                      disabled
                    />
                  </div>
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
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="address">Installation Address</Label>
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
                <Button>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>

                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CustomerProfile;
