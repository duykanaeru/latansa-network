import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { authService } from "@/lib/auth";
import { Shield, ArrowLeft } from "lucide-react";

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await authService.login(formData.email, formData.password);
      if (user.role === 'admin') {
        toast({ title: "Login Berhasil", description: "Selamat datang di panel admin!" });
        navigate("/admin/dashboard");
      } else if (user.role === 'staff') {
        toast({ title: "Login Berhasil", description: "Selamat datang di panel staff!" });
        navigate("/staff/dashboard");
      } else {
        await authService.logout();
        throw new Error("Akses ditolak: Akun Anda bukan admin/staff");
      }
    } catch (error) {
      toast({
        title: "Login Gagal",
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-destructive/10 via-background to-warning/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Kembali ke Beranda
        </Link>
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto bg-destructive rounded-full p-3 w-fit mb-4">
              <Shield className="h-8 w-8 text-destructive-foreground" />
            </div>
            <CardTitle className="text-2xl">Login Admin & Staff</CardTitle>
            <CardDescription>Portal masuk untuk administrator dan staff Latansa Network</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Masukkan email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Masukkan password" required />
              </div>
              <Button type="submit" className="w-full bg-destructive hover:bg-destructive/90" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Masuk ke Panel"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;
