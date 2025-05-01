
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

interface BookCardProps {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  originalPrice?: number;
  className?: string;
}

const BookCard = ({ id, title, author, coverImage, price, originalPrice, rating, className }: BookCardProps) => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  
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
            </div>
          </div>
          
          <Button className="w-full" variant="default">
            {t('buyNow')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
