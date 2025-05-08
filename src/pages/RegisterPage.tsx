import { useState } from "react";
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
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false); // حالة جديدة للموافقة

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
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
    
    if (formData.password.length < 6) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Password must be at least 6 characters" : "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    // فحص موافقة المستخدم
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
    } catch (error: any) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center">
            <span className="text-3xl font-bold">MobeStore</span>
          </Link>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">
            {language === "en" ? "Create an Account" : "إنشاء حساب"}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
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
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailAddress")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Enter your email" : "أدخل بريدك الإلكتروني"}
                  autoComplete="email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t("password")}</Label>
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
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === "en" ? "Password must be at least 6 characters" : "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
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
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={handleCheckboxChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    required
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    {language === "en" ? "I agree to the " : "أوافق على "}
                    <Link to="/terms" className="text-primary hover:underline">
                      {language === "en" ? "Terms of Service" : "شروط الخدمة"}
                    </Link>
                    {" "} {language === "en" ? "and" : "و"} {" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                      {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
                    </Link>
                  </Label>
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
                  <UserPlus className="h-5 w-5" />
                )}
                {isLoading ? 
                  (language === "en" ? "Creating account..." : "جاري إنشاء الحساب...") : 
                  t("createAccount")}
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {language === "en" ? "Sign In" : "تسجيل الدخول"}
              </Link>
            </p>
          </div>
          
          <div className="mt-6 text-xs text-center text-muted-foreground">
            {language === "en" ? "By creating an account, you agree to our " : "بإنشاء حساب، فإنك توافق على "} 
            <Link to="/terms" className="text-primary hover:underline">
              {language === "en" ? "Terms of Service" : "شروط الخدمة"}
            </Link>
            {" "}{language === "en" ? "and" : "و"}{" "}
            <Link to="/privacy" className="text-primary hover:underline">
              {language === "en" ? "Privacy Policy" : "سياسة الخصوصية"}
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            {language === "en" ? "← Back to Home" : "العودة إلى الصفحة الرئيسية ←"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;