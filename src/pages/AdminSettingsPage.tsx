import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw, 
  Shield,
  AlertCircle,
  Globe,
  Clock,
  User
} from "lucide-react";
import { 
  getIdTokenResult, 
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider 
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

// أنواع البيانات
interface StoreSettings {
  storeName: string;
  enableSales: boolean;
  enableReviews: boolean;
  showOutOfStock: boolean;
  language: string;
  timezone: string;
  currency: string;
  maxOrdersPerUser?: number;
  minimumOrderAmount?: number;
  taxRate?: number;
  shippingFee?: number;
}

interface AdminCredentials {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  showCurrentPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
}

const AdminSettingsPage = () => {
  const { language } = useTheme();
  const { toast } = useToast();
  const { user, logout } = useAuth();

  // States
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    storeName: "MobeStore",
    enableSales: true,
    enableReviews: true,
    showOutOfStock: false,
    language: "en",
    timezone: "UTC",
    currency: "USD",
    maxOrdersPerUser: 10,
    minimumOrderAmount: 10,
    taxRate: 0,
    shippingFee: 0,
  });

  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    showCurrentPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحميل الإعدادات من Firestore
  useEffect(() => {
    const loadSettings = async () => {
      if (!user) return;
      
      try {
        const settingsDoc = await getDoc(doc(db, "settings", "store"));
        if (settingsDoc.exists()) {
          setStoreSettings(settingsDoc.data() as StoreSettings);
        }
      } catch (error) {
        console.error("Error loading settings:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" 
            ? "Failed to load settings" 
            : "فشل تحميل الإعدادات",
          variant: "destructive",
        });
      }
    };

    loadSettings();
  }, [user, language, toast]);

  // التحقق من صلاحيات المسؤول
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      try {
        const tokenResult = await getIdTokenResult(user);
        if (!tokenResult.claims.admin) {
          toast({
            title: language === "en" ? "Access Denied" : "تم رفض الوصول",
            description: language === "en" 
              ? "You don't have admin privileges" 
              : "ليس لديك صلاحيات المسؤول",
            variant: "destructive",
          });
          setTimeout(() => logout(), 2000);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" 
            ? "Failed to verify permissions" 
            : "فشل التحقق من الصلاحيات",
          variant: "destructive",
        });
        setTimeout(() => logout(), 2000);
      }
    };

    checkAdminStatus();
  }, [user, language, toast, logout]);

  // حفظ الإعدادات في Firestore
  const saveSettings = async (settings: StoreSettings) => {
    if (!user) return;

    setIsSaving(true);
    try {
      await setDoc(doc(db, "settings", "store"), settings);
      setHasUnsavedChanges(false);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" 
          ? "Settings saved successfully" 
          : "تم حفظ الإعدادات بنجاح",
      });
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Failed to save settings" 
          : "فشل حفظ الإعدادات",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // تغيير إعدادات المتجر
  const handleStoreSettingsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // تغيير الإعدادات القابلة للتبديل
  const handleToggleChange = useCallback((name: string, checked: boolean) => {
    setStoreSettings(prev => ({
      ...prev,
      [name]: checked,
    }));
    setHasUnsavedChanges(true);
  }, []);

  // إعادة تعيين الإعدادات
  const handleResetSettings = useCallback(() => {
    setIsResetDialogOpen(true);
  }, []);

  // تأكيد إعادة تعيين الإعدادات
  const confirmResetSettings = useCallback(async () => {
    const defaultSettings: StoreSettings = {
      storeName: "MobeStore",
      enableSales: true,
      enableReviews: true,
      showOutOfStock: false,
      language: "en",
      timezone: "UTC",
      currency: "USD",
      maxOrdersPerUser: 10,
      minimumOrderAmount: 10,
      taxRate: 0,
      shippingFee: 0,
    };

    setStoreSettings(defaultSettings);
    await saveSettings(defaultSettings);
    setIsResetDialogOpen(false);
  }, []);

  // تغيير كلمة المرور
  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const { currentPassword, newPassword, confirmPassword } = adminCredentials;

    if (newPassword !== confirmPassword) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "New passwords don't match" 
          : "كلمات المرور الجديدة غير متطابقة",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 8) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Password must be at least 8 characters" 
          : "يجب أن تكون كلمة المرور 8 أحرف على الأقل",
        variant: "destructive",
      });
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setAdminCredentials({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        showCurrentPassword: false,
        showNewPassword: false,
        showConfirmPassword: false,
      });

      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" 
          ? "Password updated successfully" 
          : "تم تحديث كلمة المرور بنجاح",
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" 
          ? "Failed to update password" 
          : "فشل تحديث كلمة المرور",
        variant: "destructive",
      });
    }
  }, [adminCredentials, user, language, toast]);

  // تغيير بيانات الاعتماد
  const handleCredentialChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAdminCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // تبديل رؤية كلمة المرور
  const togglePasswordVisibility = useCallback((field: string) => {
    setAdminCredentials(prev => ({
      ...prev,
      [field]: !prev[field as keyof AdminCredentials],
    }));
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-foreground">
          {language === "en" ? "Admin Settings" : "إعدادات المسؤول"}
        </h1>
        {hasUnsavedChanges && (
          <p className="text-sm text-yellow-600">
            {language === "en" 
              ? "You have unsaved changes" 
              : "لديك تغييرات غير محفوظة"}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* بطاقة حساب المسؤول */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {language === "en" ? "Admin Account" : "حساب المسؤول"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Update your admin credentials" 
                : "تحديث بيانات اعتماد المسؤول"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* حقول كلمة المرور */}
              {/* ... (نفس الكود السابق لحقول كلمة المرور) ... */}
            </form>
          </CardContent>
        </Card>

        {/* بطاقة إعدادات المتجر */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {language === "en" ? "Store Settings" : "إعدادات المتجر"}
            </CardTitle>
            <CardDescription>
              {language === "en" 
                ? "Configure your store settings" 
                : "تكوين إعدادات المتجر"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* إعدادات المتجر الأساسية */}
              <div className="space-y-2">
                <Label htmlFor="storeName">
                  {language === "en" ? "Store Name" : "اسم المتجر"}
                </Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={storeSettings.storeName}
                  onChange={handleStoreSettingsChange}
                  placeholder={language === "en" ? "Enter store name" : "أدخل اسم المتجر"}
                />
              </div>

              {/* إعدادات اللغة والمنطقة الزمنية */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    {language === "en" ? "Language" : "اللغة"}
                  </Label>
                  <Select
                    value={storeSettings.language}
                    onValueChange={(value) => {
                      setStoreSettings(prev => ({ ...prev, language: value }));
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select language" : "اختر اللغة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">
                    {language === "en" ? "Currency" : "العملة"}
                  </Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) => {
                      setStoreSettings(prev => ({ ...prev, currency: value }));
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={language === "en" ? "Select currency" : "اختر العملة"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="SAR">SAR (﷼)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* إعدادات المتجر المتقدمة */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>
                      {language === "en" ? "Enable Sales" : "تمكين المبيعات"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {language === "en" 
                        ? "Allow users to purchase books" 
                        : "السماح للمستخدمين بشراء الكتب"}
                    </p>
                  </div>
                  <Switch
                    checked={storeSettings.enableSales}
                    onCheckedChange={(checked) => handleToggleChange("enableSales", checked)}
                  />
                </div>

                {/* المزيد من الإعدادات */}
                {/* ... (باقي الإعدادات القابلة للتبديل) ... */}
              </div>

              {/* إعدادات الأسعار والضرائب */}
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">
                    {language === "en" ? "Tax Rate (%)" : "نسبة الضريبة (%)"}
                  </Label>
                  <Input
                    id="taxRate"
                    name="taxRate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={storeSettings.taxRate}
                    onChange={handleStoreSettingsChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingFee">
                    {language === "en" ? "Shipping Fee" : "رسوم الشحن"}
                  </Label>
                  <Input
                    id="shippingFee"
                    name="shippingFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={storeSettings.shippingFee}
                    onChange={handleStoreSettingsChange}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleResetSettings}
              disabled={isSaving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              {language === "en" ? "Reset to Default" : "إعادة تعيين الافتراضي"}
            </Button>
            <Button
              onClick={() => saveSettings(storeSettings)}
              disabled={isSaving || !hasUnsavedChanges}
            >
              {isSaving ? (
                <Clock className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {language === "en" ? "Save Settings" : "حفظ الإعدادات"}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* نافذة تأكيد إعادة التعيين */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" 
                ? "Reset Settings" 
                : "إعادة تعيين الإعدادات"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? "This will reset all settings to their default values. This action cannot be undone."
                : "سيؤدي هذا إلى إعادة تعيين جميع الإعدادات إلى قيمها الافتراضية. لا يمكن التراجع عن هذا الإجراء."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmResetSettings}>
              {language === "en" ? "Continue" : "متابعة"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminSettingsPage;