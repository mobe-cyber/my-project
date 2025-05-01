
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

// Mock cart items
const mockCartItemsEn = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Doe",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    quantity: 1,
  },
  {
    id: 2,
    title: "Digital Marketing Strategies",
    author: "Jane Smith",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    quantity: 1,
  }
];

const mockCartItemsAr = [
  {
    id: 1,
    title: "فن البرمجة",
    author: "جون دو",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    quantity: 1,
  },
  {
    id: 2,
    title: "استراتيجيات التسويق الرقمي",
    author: "جين سميث",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    quantity: 1,
  }
];

interface CartItem {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  quantity: number;
}

const CartPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  useEffect(() => {
    setCartItems(language === 'en' ? mockCartItemsEn : mockCartItemsAr);
  }, [language]);
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };
  
  const handleRemoveItem = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    toast({
      title: language === 'en' ? "Item removed" : "تمت إزالة العنصر",
      description: language === 'en' ? "The item has been removed from your cart" : "تم إزالة العنصر من سلة التسوق الخاصة بك",
    });
  };
  
  const handleApplyPromoCode = () => {
    // Mock promo code validation
    if (promoCode.toLowerCase() === "discount20") {
      setIsPromoApplied(true);
      setDiscount(0.2); // 20% discount
      
      toast({
        title: language === 'en' ? "Promo code applied" : "تم تطبيق الرمز الترويجي",
        description: language === 'en' ? "20% discount has been applied to your order" : "تم تطبيق خصم 20٪ على طلبك",
      });
    } else {
      toast({
        title: language === 'en' ? "Invalid promo code" : "رمز ترويجي غير صالح",
        description: language === 'en' ? "Please enter a valid promo code" : "الرجاء إدخال رمز ترويجي صالح",
        variant: "destructive",
      });
    }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = isPromoApplied ? subtotal * discount : 0;
  const total = subtotal - discountAmount;
  
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
          {language === 'en' ? 'Shopping Cart' : 'سلة التسوق'}
        </h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'Your cart is empty' : 'سلة التسوق فارغة'}
            </h2>
            <p className="text-muted-foreground mb-6">
              {language === 'en' ? 
                'Looks like you haven\'t added any books to your cart yet.' : 
                'يبدو أنك لم تضف أي كتب إلى سلة التسوق الخاصة بك بعد.'}
            </p>
            <Button asChild>
              <Link to="/categories">
                {language === 'en' ? 'Browse Books' : 'تصفح الكتب'}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-start p-4">{language === 'en' ? 'Product' : 'المنتج'}</th>
                      <th className="text-start p-4 hidden sm:table-cell">{language === 'en' ? 'Price' : 'السعر'}</th>
                      <th className="text-start p-4">{language === 'en' ? 'Quantity' : 'الكمية'}</th>
                      <th className="text-start p-4 hidden sm:table-cell">{language === 'en' ? 'Total' : 'المجموع'}</th>
                      <th className="p-4"><span className="sr-only">{language === 'en' ? 'Actions' : 'إجراءات'}</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="w-16 h-24 rounded overflow-hidden me-4">
                              <img 
                                src={item.coverImage} 
                                alt={item.title} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h3 className="font-semibold">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">{item.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center">
                            <button
                              className="w-8 h-8 flex items-center justify-center border border-border rounded-s"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 border-y border-border text-center focus:outline-none"
                            />
                            <button
                              className="w-8 h-8 flex items-center justify-center border border-border rounded-e"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleRemoveItem(item.id)} className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/categories" className="text-primary hover:underline flex items-center">
                  {language === 'en' ? '← Continue Shopping' : 'متابعة التسوق ←'}
                </Link>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {language === 'en' ? 'Order Summary' : 'ملخص الطلب'}
                </h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{language === 'en' ? 'Subtotal' : 'المجموع الفرعي'}</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  
                  {isPromoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>{language === 'en' ? 'Discount' : 'الخصم'}</span>
                      <span>-{formatCurrency(discountAmount)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-border pt-3 font-semibold text-lg flex justify-between">
                    <span>{language === 'en' ? 'Total' : 'المجموع'}</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="promo-code" className="block text-sm font-medium mb-2">
                    {language === 'en' ? 'Promo Code' : 'الرمز الترويجي'}
                  </label>
                  <div className="flex">
                    <Input
                      id="promo-code"
                      placeholder={language === 'en' ? "Enter code" : "أدخل الرمز"}
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="rounded-e-none"
                      disabled={isPromoApplied}
                    />
                    <Button 
                      onClick={handleApplyPromoCode} 
                      variant="outline" 
                      className="rounded-s-none"
                      disabled={isPromoApplied || !promoCode}
                    >
                      {language === 'en' ? 'Apply' : 'تطبيق'}
                    </Button>
                  </div>
                  {isPromoApplied && (
                    <p className="text-sm text-green-600 mt-2">
                      {language === 'en' ? 'Promo code applied' : 'تم تطبيق الرمز الترويجي'}
                    </p>
                  )}
                </div>
                
                <Button className="w-full" asChild>
                  <Link to="/checkout" className="flex items-center justify-center gap-2">
                    {language === 'en' ? 'Proceed to Checkout' : 'متابعة الدفع'}
                    <ArrowRight className={`h-4 w-4 ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </Link>
                </Button>
                
                <div className="mt-4 text-sm text-muted-foreground text-center">
                  {language === 'en' ? 
                    'Secure payment processed by Stripe' : 
                    'معالجة الدفع الآمن بواسطة Stripe'}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
