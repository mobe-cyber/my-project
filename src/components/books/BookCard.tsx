// BookCard.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { auth } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BookCardProps {
  id: number | string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  originalPrice?: number;
  className?: string;
  isbn?: string; // إضافة خاصية اختيارية
  ratingCount?: number; // إضافة خاصية اختيارية
}

const BookCard = ({ id, title, author, coverImage, price, originalPrice, rating, className, isbn, ratingCount }: BookCardProps) => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [hasPurchased, setHasPurchased] = useState(false);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const checkPurchase = async () => {
      const purchasesRef = collection(db, "purchases");
      const q = query(purchasesRef, where("userId", "==", user.uid), where("bookId", "==", id.toString()));
      const querySnapshot = await getDocs(q);
      setHasPurchased(!querySnapshot.empty);
    };

    checkPurchase();
  }, [user, id]);

  const handlePurchase = () => {
    if (!user) {
      alert(t("pleaseSignInToPurchase"));
      return;
    }
    navigate('/checkout', { state: { book: { id, title, price, author } } });
  };

  const currencyFormatter = new Intl.NumberFormat(language === 'en' ? 'en-US' : 'ar-EG', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  return (
    <div className={cn(
      "flex flex-col overflow-hidden bg-background border border-border rounded-lg shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <Link to={`/book/${id}`} className="relative h-64 overflow-hidden">
        <img 
          src={coverImage} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/300";
          }}
        />
      </Link>
      
      <div className="flex flex-col flex-grow p-4">
        <Link to={`/book/${id}`} className="hover:text-primary transition-colors">
          <h3 className="font-medium text-lg line-clamp-2 min-h-[3.5rem]">{title}</h3>
        </Link>
        <p className="text-muted-foreground text-sm mb-3">{author}</p>
        
        <div className="mt-auto">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
              <span className="ms-1 text-sm">{rating.toFixed(1)}</span>
              {ratingCount && <span className="ms-1 text-xs text-muted-foreground">({ratingCount})</span>}
            </div>
            <div className="text-right">
              {originalPrice && (
                <span className="text-sm text-muted-foreground line-through block">
                  {currencyFormatter.format(originalPrice)}
                </span>
              )}
              <span className="font-semibold text-primary">
                {currencyFormatter.format(price)}
              </span>
              {isbn && <p className="text-xs text-muted-foreground mt-1">ISBN: {isbn}</p>}
            </div>
          </div>
          
          {hasPurchased ? (
            <Button className="w-full" variant="default" asChild>
              <Link to={`/read/${id}`}>
                {language === 'en' ? 'Read' : 'قراءة'}
              </Link>
            </Button>
          ) : (
            <Button className="w-full" variant="default" onClick={handlePurchase}>
              {t('buyNow')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookCard;