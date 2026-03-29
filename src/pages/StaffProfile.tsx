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
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Award,
  Clock,
  CheckCircle,
  BarChart3,
  Ticket,
  Wrench,
  MessageSquare
} from "lucide-react";

const StaffProfile = () => {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    name: "Staff Technical",
    email: "staff@latansanetwork.id",
    phone: "+62 813-4567-8901",
    address: "Jakarta Barat, Indonesia",
    role: "Technical Support",
    specialization: "Network & Router Configuration",
    shift: "Pagi (08:00 - 16:00)"
  });

  const stats = {
    completedTickets: 145,
    avgResponseTime: "12 menit",
    customerRating: 4.8,
    currentTickets: 3
  };

  const navigation = [
    { name: "Dashboard", href: "/staff/dashboard", icon: <BarChart3 className="h-4 w-4" /> },
    { name: "Tiket Support", href: "/staff/tickets", icon: <Ticket className="h-4 w-4" /> },
    { name: "Troubleshooting", href: "/staff/troubleshoot", icon: <Wrench className="h-4 w-4" /> },
    { name: "Chat Support", href: "/staff/chat", icon: <MessageSquare className="h-4 w-4" /> },
  ];

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
  };

  return (
    <DashboardLayout
      title="Profile Staff"
      userRole="staff"
      userName={profileData.name}
      navigation={navigation}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-2xl bg-warning text-warning-foreground">
                  {profileData.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-muted-foreground">{profileData.role}</p>
              <Badge className="mt-2 bg-warning text-warning-foreground">
                <Award className="h-3 w-3 mr-1" />
                {profileData.specialization}
              </Badge>
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
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{profileData.shift}</span>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.completedTickets}</div>
                <div className="text-xs text-muted-foreground">Tiket Selesai</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">{stats.customerRating}</div>
                <div className="text-xs text-muted-foreground">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-warning">{stats.avgResponseTime}</div>
                <div className="text-xs text-muted-foreground">Avg Response</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{stats.currentTickets}</div>
                <div className="text-xs text-muted-foreground">Active Now</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Settings */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your profile and preferences</CardDescription>
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
                    <Label htmlFor="specialization">Specialization</Label>
                    <Input
                      id="specialization"
                      value={profileData.specialization}
                      onChange={(e) => setProfileData({...profileData, specialization: e.target.value})}
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
                <Button>
                  <Lock className="h-4 w-4 mr-2" />
                  Change Password
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StaffProfile;
