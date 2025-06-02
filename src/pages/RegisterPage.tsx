import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Eye, EyeOff } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

const RegisterPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const { setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animateForm, setAnimateForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateForm(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please fill in all fields" : "يرجى ملء جميع الحقول",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Passwords do not match" : "كلمات المرور غير متطابقة",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.password.length < 8 || formData.password.length > 32) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Password must be between 8 and 32 characters" 
          : "يجب أن تتكون كلمة المرور من 8 إلى 32 حرفًا",
        variant: "destructive",
      });
      return;
    }

    const specialCharRegex = /[@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
    if (!specialCharRegex.test(formData.password)) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Password must contain at least one special character (@#$ etc.)" 
          : "يجب أن تحتوي كلمة المرور على علامة خاصة واحدة على الأقل (@#$ إلخ.)",
        variant: "destructive",
      });
      return;
    }

    const commonPasswords = [
      "12345678", "password", "qwerty", "123456789", "abc123",
      "password1", "11111111", "admin123", "letmein", "welcome",
    ];

    if (commonPasswords.includes(formData.password.toLowerCase())) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Password is too common. Please choose a stronger password." 
          : "كلمة المرور شائعة جدًا. يرجى اختيار كلمة مرور أقوى.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please agree to the Terms of Service and Privacy Policy." : "يرجى الموافقة على الشروط والخصوصية.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      setUser(userCredential.user);

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });
    
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en"
          ? "Account created successfully! Please check your email to verify your account."
          : "تم إنشاء الحساب بنجاح! يرجى التحقق من بريدك الإلكتروني.",
      });
    
      window.location.href = "/login";
    } catch (error) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-gray-900 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-pulse-slow delay-500"></div>
      </div>

      <div className={`w-full max-w-xl bg-gradient-to-b from-gray-900/95 to-gray-800/95 backdrop-blur-2xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl transition-all duration-1000 transform ${animateForm ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center group">
            <span className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-400 group-hover:from-yellow-500 group-hover:to-blue-500 transition-all duration-500">
              MobeStore
            </span>
          </Link>
        </div>
        
        <h1 className="text-4xl font-extrabold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-300">
          {language === "en" ? "Create an Account" : "إنشاء حساب"}
        </h1>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-medium text-gray-200">
              {language === "en" ? "Full Name" : "الاسم الكامل"}
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={language === "en" ? "Enter your name" : "أدخل اسمك"}
              autoComplete="name"
              required
              className="w-full bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-lg py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="email" className="text-sm font-medium text-gray-200">
              {t("emailAddress")}
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={language === "en" ? "Enter your email" : "أدخل بريدك الإلكتروني"}
              autoComplete="email"
              required
              className="w-full bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-lg py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="password" className="text-sm font-medium text-gray-200">
              {t("password")}
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder={language === "en" ? "Create a password" : "أنشئ كلمة مرور"}
                autoComplete="new-password"
                required
                className="w-full pr-14 bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-lg py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-all duration-200"
              >
                {showPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
            <p className="text-xs text-gray-400">
              {language === "en" 
                ? "Password must be 8-32 characters, contain at least one special character (@#$ etc.), and not be a common password." 
                : "يجب أن تتكون كلمة المرور من 8-32 حرفًا، وتحتوي على علامة خاصة واحدة على الأقل (@#$ إلخ.)، ولا تكون كلمة مرور شائعة."}
            </p>
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200">
              {t("confirmPassword")}
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={language === "en" ? "Confirm your password" : "تأكيد كلمة المرور"}
                autoComplete="new-password"
                required
                className="w-full pr-14 bg-gray-800/50 border border-gray-600/50 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50 text-white placeholder-gray-400 rounded-lg py-4 px-5 transition-all duration-300 hover:bg-gray-700/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-400 transition-all duration-200"
              >
                {showConfirmPassword ? <EyeOff className="h-6 w-6" /> : <Eye className="h-6 w-6" />}
              </button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={handleCheckboxChange}
                className="h-5 w-5 text-blue-500 focus:ring-blue-400 border-gray-600 rounded bg-gray-800 transition-all duration-200"
                required
              />
              <Label htmlFor="terms" className="text-sm text-gray-300">
                {language === "en" ? "I agree to the " : "أوافق على "}
                <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
                  {language === "en" ? "Terms of Service" : "شروط الخدمة"}
                </Link>
                {" "} {language === "en" ? "and" : "و"} {" "}
                <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
                  {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
                </Link>
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="col-span-1 md:col-span-2 w-full flex items-center justify-center gap-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-500 rounded-lg py-4 font-bold text-lg shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin h-6 w-6 border-3 border-white border-t-transparent rounded-full" />
            ) : (
              <UserPlus className="h-7 w-7" />
            )}
            {isLoading ? 
              (language === "en" ? "Creating account..." : "جاري إنشاء الحساب...") : 
              t("createAccount")}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            {t("alreadyHaveAccount")}{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-all duration-200">
              {language === "en" ? "Sign In" : "تسجيل الدخول"}
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-sm text-center text-gray-400">
          {language === "en" ? "By creating an account, you agree to our " : "بإنشاء حساب، فإنك توافق على "} 
          <Link to="/terms" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
            {language === "en" ? "Terms of Service" : "شروط الخدمة"}
          </Link>
          {" "}{language === "en" ? "and" : "و"}{" "}
          <Link to="/privacy" className="text-blue-400 hover:text-blue-300 transition-all duration-200">
            {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
          </Link>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <Link to="/" className="text-sm text-gray-300 hover:text-blue-400 transition-all duration-200">
          {language === "en" ? "← Back to Home" : "العودة إلى الصفحة الرئيسية ←"}
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;