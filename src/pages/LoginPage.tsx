
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext"; 
import { useNavigate } from "react-router-dom";
const LoginPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const { setUser } = useAuth(); // ✅ جديد
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: language === 'en' ? 
          "Please fill in all fields" : 
          "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
setUser(userCredential.user); // ✅ لتحديث المستخدم في السياق

      toast({
        title: language === 'en' ? "Success" : "نجاح",
        description: language === 'en' ? 
          "You have successfully logged in" : 
          "لقد قمت بتسجيل الدخول بنجاح",
      });
    
      navigate("/");
    } catch (error: any) {
      toast({
        title: language === 'en' ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
    
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            {/* Logo */}
            <span className="text-3xl font-bold">MobeStore</span>
          </Link>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('emailAddress')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'en' ? "Enter your email" : "أدخل بريدك الإلكتروني"}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-primary hover:underline"
                  >
                    {t('forgotPassword')}
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={language === 'en' ? "Enter your password" : "أدخل كلمة المرور"}
                    autoComplete="current-password"
                    required
                  />
                  <button 
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full flex items-center justify-center gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
                ) : (
                  <LogIn className="h-5 w-5" />
                )}
                {isLoading ? 
                  (language === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...') : 
                  (language === 'en' ? 'Sign In' : 'تسجيل الدخول')}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('dontHaveAccount')}{' '}
              <Link to="/register" className="text-primary hover:underline font-medium">
                {t('createAccount')}
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            {language === 'en' ? '← Back to Home' : 'العودة إلى الصفحة الرئيسية ←'}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
