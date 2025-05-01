
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, CreditCard, Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

// Mock order summary
const mockOrderEn = {
  items: [
    { id: 1, title: "The Art of Programming", price: 19.99 },
    { id: 2, title: "Digital Marketing Strategies", price: 24.99 }
  ],
  subtotal: 44.98,
  discount: 0,
  total: 44.98
};

const mockOrderAr = {
  items: [
    { id: 1, title: "فن البرمجة", price: 19.99 },
    { id: 2, title: "استراتيجيات التسويق الرقمي", price: 24.99 }
  ],
  subtotal: 44.98,
  discount: 0,
  total: 44.98
};

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [order] = useState(language === 'en' ? mockOrderEn : mockOrderAr);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    country: "",
    postalCode: ""
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Here we would normally redirect to Stripe checkout
    // For demo purposes, we'll just simulate a successful payment after a delay
    setTimeout(() => {
      toast({
        title: language === 'en' ? "Payment successful" : "تم الدفع بنجاح",
        description: language === 'en' ? 
          "Your order has been confirmed. Redirecting to your library..." : 
          "تم تأكيد طلبك. جاري التحويل إلى مكتبتك...",
      });
      
      setTimeout(() => {
        navigate("/success");
      }, 2000);
    }, 1500);
  };
  
  // Format currency based on language
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-EG', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">
          {language === 'en' ? 'Checkout' : 'إتمام الشراء'}
        </h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit}>
              {/* Contact Information */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Contact Information' : 'معلومات الاتصال'}
                </h2>
                <div className="mb-4">
                  <Label htmlFor="email" className="mb-2 block">
                    {language === 'en' ? 'Email Address' : 'البريد الإلكتروني'}*
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={language === 'en' ? "your@email.com" : "بريدك@الإلكتروني.كوم"}
                  />
                </div>
              </div>
              
              {/* Billing Details */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Billing Details' : 'تفاصيل الفواتير'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="mb-2 block">
                      {language === 'en' ? 'First Name' : 'الاسم الأول'}*
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="mb-2 block">
                      {language === 'en' ? 'Last Name' : 'اسم العائلة'}*
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <Label htmlFor="address" className="mb-2 block">
                    {language === 'en' ? 'Address' : 'العنوان'}*
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <Label htmlFor="city" className="mb-2 block">
                      {language === 'en' ? 'City' : 'المدينة'}*
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="mb-2 block">
                      {language === 'en' ? 'Country' : 'البلد'}*
                    </Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode" className="mb-2 block">
                      {language === 'en' ? 'Postal Code' : 'الرمز البريدي'}*
                    </Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-card border border-border rounded-lg p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CreditCard className="me-2 h-5 w-5" />
                  {language === 'en' ? 'Payment Information' : 'معلومات الدفع'}
                </h2>
                
                <p className="text-muted-foreground mb-4">
                  {language === 'en' ? 
                    'Secure payment is processed by Stripe. We do not store your payment information.' : 
                    'تتم معالجة الدفع الآمن بواسطة . نحن لا نخزن معلومات الدفع الخاصة بك.'}
                </p>
                
                <div className="flex justify-center mb-4">
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/_Logo%2C_revised_2016.svg/2560px-Stripe_Logo%2C_revised_2016.svg.png" 
                    alt="Stripe" 
                    className="h-8"
                  />
                </div>
                
                <div className="flex justify-center">
                  <Button type="submit" className="w-full md:w-auto" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <span className="animate-spin me-2">⚪</span>
                        {language === 'en' ? 'Processing...' : 'جاري المعالجة...'}
                      </>
                    ) : (
                      <>
                        {language === 'en' ? 'Proceed to Payment' : 'المضي قدمًا في الدفع'}
                        <ArrowRight className={`ms-2 h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">
                {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
              </h2>
              
              <div className="space-y-4 mb-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">{item.title}</span>
                    <span>{formatCurrency(item.price)}</span>
                  </div>
                ))}
                
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="text-muted-foreground">{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{language === 'en' ? 'Discount' : 'الخصم'}</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                
                <div className="border-t border-border pt-4 font-semibold text-lg flex justify-between">
                  <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                  <span>{formatCurrency(order.total)}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Check className="h-4 w-4 me-2 text-green-500" />
                  {language === 'en' ? 'Instant Digital Delivery' : 'تسليم رقمي فوري'}
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 me-2 text-green-500" />
                  {language === 'en' ? 'Access in your Library forever' : 'الوصول إلى مكتبتك إلى الأبد'}
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 me-2 text-green-500" />
                  {language === 'en' ? 'PDF & ePub formats included' : 'تشمل صيغ PDF و ePub'}
                </div>
              </div>
              
              <div className="mt-6 text-sm text-center">
                <span className="text-muted-foreground">
                  {language === 'en' ? 'By completing your purchase, you agree to our ' : 'بإكمال الشراء، فإنك توافق على '}
                </span>
                <Link to="/terms" className="text-primary hover:underline">
                  {language === 'en' ? 'Terms of Service' : 'شروط الخدمة'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
