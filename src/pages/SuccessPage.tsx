
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Download, Book, ArrowRight, CheckCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

// Mock purchase data
const mockPurchaseEn = {
  id: "ORD-12345",
  date: "April 28, 2025",
  items: [
    { id: 1, title: "The Art of Programming", author: "John Doe", format: "PDF & ePub" },
    { id: 2, title: "Digital Marketing Strategies", author: "Jane Smith", format: "PDF & ePub" }
  ],
  total: 44.98
};

const mockPurchaseAr = {
  id: "ORD-12345",
  date: "28 أبريل 2025",
  items: [
    { id: 1, title: "فن البرمجة", author: "جون دو", format: "PDF و ePub" },
    { id: 2, title: "استراتيجيات التسويق الرقمي", author: "جين سميث", format: "PDF و ePub" }
  ],
  total: 44.98
};

const SuccessPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [purchase, setPurchase] = useState(language === 'en' ? mockPurchaseEn : mockPurchaseAr);
  const [isAnimated, setIsAnimated] = useState(false);
  
  useEffect(() => {
    setPurchase(language === 'en' ? mockPurchaseEn : mockPurchaseAr);
    
    // Show animation
    setIsAnimated(true);
    
    // Notify user about email receipt
    setTimeout(() => {
      toast({
        title: language === 'en' ? "Receipt sent" : "تم إرسال الإيصال",
        description: language === 'en' ? 
          "A receipt has been sent to your email" : 
          "تم إرسال إيصال إلى بريدك الإلكتروني",
      });
    }, 1500);
  }, [language, toast]);
  
  const handleDownload = (id: number) => {
    // In a real app, this would download the actual file
    toast({
      title: language === 'en' ? "Download started" : "بدأ التنزيل",
      description: language === 'en' ? 
        "Your book is downloading..." : 
        "جاري تحميل كتابك...",
    });
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
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className={`text-center mb-10 transition-opacity duration-1000 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 mb-6">
              <CheckCircle className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {language === 'en' ? 'Thank You for Your Purchase!' : 'شكرًا لشرائك!'}
            </h1>
            <p className="text-xl text-muted-foreground">
              {language === 'en' ? 
                'Your order has been successfully processed.' : 
                'تمت معالجة طلبك بنجاح.'}
            </p>
          </div>
          
          {/* Order Details */}
          <Card className={`mb-8 transition-transform duration-700 ${isAnimated ? 'translate-y-0' : 'translate-y-10'}`}>
            <CardHeader>
              <CardTitle>
                {language === 'en' ? 'Order Confirmation' : 'تأكيد الطلب'}
              </CardTitle>
              <CardDescription>
                {language === 'en' ? `Order ID: ${purchase.id} • ${purchase.date}` : 
                  `معرف الطلب: ${purchase.id} • ${purchase.date}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Purchased Items */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === 'en' ? 'Purchased Items' : 'العناصر المشتراة'}
                  </h3>
                  <div className="space-y-4">
                    {purchase.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border rounded-lg">
                        <div className="mb-3 sm:mb-0">
                          <div className="font-semibold">{item.title}</div>
                          <div className="text-sm text-muted-foreground">{item.author}</div>
                          <div className="text-xs text-muted-foreground mt-1">{item.format}</div>
                        </div>
                        <Button onClick={() => handleDownload(item.id)} className="flex items-center gap-2 w-full sm:w-auto">
                          <Download className="h-4 w-4" />
                          {language === 'en' ? 'Download' : 'تحميل'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Order Summary */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                  </h3>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between py-2">
                      <span className="text-muted-foreground">
                        {language === 'en' ? 'Total' : 'المجموع'}
                      </span>
                      <span className="font-semibold">{formatCurrency(purchase.total)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {language === 'en' ? 
                        'A receipt has been sent to your email address.' : 
                        'تم إرسال إيصال إلى عنوان بريدك الإلكتروني.'}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row justify-center gap-4 transition-opacity duration-1000 ${isAnimated ? 'opacity-100' : 'opacity-0'}`}>
            <Button asChild variant="outline">
              <Link to="/library" className="flex items-center gap-2">
                <Book className="h-4 w-4" />
                {language === 'en' ? 'Go to My Library' : 'الذهاب إلى مكتبتي'}
              </Link>
            </Button>
            <Button asChild>
              <Link to="/" className="flex items-center gap-2">
                {language === 'en' ? 'Continue Shopping' : 'متابعة التسوق'}
                <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SuccessPage;
