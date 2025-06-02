import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookPlus, LayoutDashboard, LogOut, Settings, Shield, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useTheme();
  const { user, loading: authLoading, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // التحقق من حالة تسجيل دخول المسؤول
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast({
        title: language === "en" ? "Access Denied" : "تم رفض الوصول",
        description: language === "en"
          ? "You must login as admin to access this page"
          : "يجب عليك تسجيل الدخول كمسؤول للوصول إلى هذه الصفحة",
        variant: "destructive",
      });
      navigate("/admin/login");
    }
    setIsLoading(false);
  }, [user, authLoading, navigate, toast, language]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: language === "en" ? "Logged Out" : "تم تسجيل الخروج",
        description: language === "en"
          ? "You have successfully logged out"
          : "لقد قمت بتسجيل الخروج بنجاح",
      });
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en"
          ? "Failed to log out. Please try again."
          : "فشل تسجيل الخروج. حاول مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* لوحة جانبية للإدارة */}
      <div className="w-64 border-r border-border bg-card">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">
              {language === "en" ? "Admin Panel" : "لوحة الإدارة"}
            </h2>
          </div>
        </div>

        <Separator />

        <nav className="p-4 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/admin/dashboard")}
          >
            <LayoutDashboard className="h-5 w-5 mr-2" />
            {language === "en" ? "Dashboard" : "الرئيسية"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/admin/books")}
          >
            <BookPlus className="h-5 w-5 mr-2" />
            {language === "en" ? "Manage Books" : "إدارة الكتب"}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate("/admin/settings")}
          >
            <Settings className="h-5 w-5 mr-2" />
            {language === "en" ? "Settings" : "الإعدادات"}
          </Button>
        </nav>

        <div className="absolute bottom-0 w-64 p-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {language === "en" ? "Log Out" : "تسجيل الخروج"}
          </Button>
        </div>
      </div>

      {/* محتوى الصفحة */}
      <div className="flex-1 overflow-auto">
        <header className="border-b border-border">
          <div className="flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">
              {language === "en" ? "MobeStore Admin" : "لوحة تحكم MobeStore"}
            </h1>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;