import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { LogOut, Mail, Fingerprint, UserCircle } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const AccountPage = () => {
  const { user, logout, loading } = useAuth();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: language === "en" ? "Logged out" : "تم تسجيل الخروج",
        description:
          language === "en"
            ? "You have been logged out successfully."
            : "تم تسجيل خروجك بنجاح.",
      });
      navigate("/");
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-muted-foreground text-sm">
          {language === "en" ? "Loading your account..." : "جاري تحميل حسابك..."}
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <div className="text-center mb-10">
        <UserCircle className="w-20 h-20 mx-auto text-primary" />
        <h1 className="text-3xl font-bold mt-4">{user.displayName || "مستخدم"}</h1>
        <p className="text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-6">
        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 flex items-center gap-4">
            <Mail className="text-blue-500 w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">
                {language === "en" ? "Email" : "البريد الإلكتروني"}
              </p>
              <p className="text-base font-medium">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition">
          <CardContent className="p-6 flex items-center gap-4">
            <Fingerprint className="text-green-500 w-6 h-6" />
            <div>
              <p className="text-sm text-muted-foreground">UID</p>
              <p className="text-xs break-all">{user.uid}</p>
            </div>
          </CardContent>
        </Card>

        <div className="pt-4">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white hover:opacity-90 transition"
          >
            <LogOut className="w-4 h-4 me-2 animate-pulse" />
            {language === "en" ? "Logout" : "تسجيل الخروج"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
