import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const LoginPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const { setUser } = useAuth();
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
      setUser(userCredential.user);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-purple-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Particles and Glow Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className="w-full max-w-md bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-2xl border border-gray-700/50 rounded-3xl p-10 shadow-2xl transition-all duration-1000 transform scale-100 opacity-100">
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center justify-center group">
            <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-400 group-hover:from-yellow-500 group-hover:to-blue-500 transition-all duration-500">
              MobeStore
            </span>
          </Link>
        </div>
        
        <h1 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-300">
          {language === 'en' ? 'Sign In' : 'تسجيل الدخول'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-sm font-medium text-gray-200">
                {t('emailAddress')}
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={language === 'en' ? "Enter your email" : "أدخل بريدك الإلكتروني"}
                autoComplete="email"
                required
                className="w-full bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-xl py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-gray-200">
                  {t('password')}
                </Label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-blue-400 hover:text-blue-300 transition-all duration-200"
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
                  className="w-full pr-14 bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-xl py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                />
                <button 
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-all duration-200"
                >
                  {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
                </button>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full flex items-center justify-center gap-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-500 rounded-xl py-4 font-bold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
              ) : (
                <LogIn className="h-7 w-7" />
              )}
              {isLoading ? 
                (language === 'en' ? 'Signing in...' : 'جاري تسجيل الدخول...') : 
                (language === 'en' ? 'Sign In' : 'تسجيل الدخول')}
            </Button>
          </div>
        </form>
        
        <div className="mt-10 text-center">
          <p className="text-sm text-gray-300">
            {t('dontHaveAccount')}{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200">
              {t('createAccount')}
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-xs text-center text-gray-400">
          {language === 'en' ? 'By signing in, you agree to our ' : 'بتسجيل الدخول، فإنك توافق على '}
          <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
            {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
          </Link>
          {' '}{language === 'en' ? 'and' : 'و'}{' '}
          <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
            {language === 'en' ? 'Privacy Policy' : 'سياسة الخصوصية'}
          </Link>
        </div>
      </div>
      
      <div className="mt-10 text-center">
        <Link to="/" className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-200">
          {language === 'en' ? '← Back to Home' : 'العودة إلى الصفحة الرئيسية ←'}
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;