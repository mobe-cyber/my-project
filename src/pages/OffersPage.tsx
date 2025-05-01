
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { Tag, Percent } from "lucide-react";

// Mock data for books on offer
const offersEn = [
  {
    id: 201,
    title: "The Alchemist",
    author: "Paulo Coelho",
    coverImage: "https://picsum.photos/seed/alchemist1/300/400",
    price: 9.99,
    originalPrice: 14.99,
    discount: 33,
    rating: 4.8,
  },
  {
    id: 202,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    coverImage: "https://picsum.photos/seed/patient1/300/400",
    price: 8.99,
    originalPrice: 16.99,
    discount: 47,
    rating: 4.6,
  },
  {
    id: 203,
    title: "Educated: A Memoir",
    author: "Tara Westover",
    coverImage: "https://picsum.photos/seed/educated1/300/400",
    price: 10.99,
    originalPrice: 18.99,
    discount: 42,
    rating: 4.7,
  },
  {
    id: 204,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    coverImage: "https://picsum.photos/seed/crawdads1/300/400",
    price: 7.99,
    originalPrice: 15.99,
    discount: 50,
    rating: 4.5,
  },
  {
    id: 205,
    title: "Becoming",
    author: "Michelle Obama",
    coverImage: "https://picsum.photos/seed/becoming1/300/400",
    price: 11.99,
    originalPrice: 19.99,
    discount: 40,
    rating: 4.9,
  },
  {
    id: 206,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    coverImage: "https://picsum.photos/seed/sapiens1/300/400",
    price: 12.99,
    originalPrice: 22.99,
    discount: 43,
    rating: 4.8,
  }
];

// Arabic titles and authors for the same books
const offersAr = [
  {
    id: 201,
    title: "الخيميائي",
    author: "باولو كويلو",
    coverImage: "https://picsum.photos/seed/alchemist1/300/400",
    price: 9.99,
    originalPrice: 14.99,
    discount: 33,
    rating: 4.8,
  },
  {
    id: 202,
    title: "المريضة الصامتة",
    author: "أليكس ميخاليدس",
    coverImage: "https://picsum.photos/seed/patient1/300/400",
    price: 8.99,
    originalPrice: 16.99,
    discount: 47,
    rating: 4.6,
  },
  {
    id: 203,
    title: "متعلمة: مذكرات",
    author: "تارا ويستوفر",
    coverImage: "https://picsum.photos/seed/educated1/300/400",
    price: 10.99,
    originalPrice: 18.99,
    discount: 42,
    rating: 4.7,
  },
  {
    id: 204,
    title: "حيث تغني سرطانات النهر",
    author: "ديليا أوينز",
    coverImage: "https://picsum.photos/seed/crawdads1/300/400",
    price: 7.99,
    originalPrice: 15.99,
    discount: 50,
    rating: 4.5,
  },
  {
    id: 205,
    title: "أن تصبح",
    author: "ميشيل أوباما",
    coverImage: "https://picsum.photos/seed/becoming1/300/400",
    price: 11.99,
    originalPrice: 19.99,
    discount: 40,
    rating: 4.9,
  },
  {
    id: 206,
    title: "العاقل",
    author: "يوفال نوح هراري",
    coverImage: "https://picsum.photos/seed/sapiens1/300/400",
    price: 12.99,
    originalPrice: 22.99,
    discount: 43,
    rating: 4.8,
  }
];

const OffersPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [offers, setOffers] = useState(language === 'en' ? offersEn : offersAr);
  
  // Update offers when language changes
  useEffect(() => {
    setOffers(language === 'en' ? offersEn : offersAr);
  }, [language]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Tag className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {language === 'en' ? 'Special Offers' : 'عروض خاصة'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? 'Limited time discounts on popular titles' 
                : 'خصومات لفترة محدودة على العناوين الشهيرة'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {offers.map((book) => (
            <div key={book.id} className="relative">
              <div className="absolute top-4 right-4 z-10 bg-primary text-primary-foreground text-sm font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-md">
                <Percent className="h-3.5 w-3.5" />
                <span>{book.discount}%</span>
              </div>
              <BookCard
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                price={book.price}
                originalPrice={book.originalPrice}
                rating={book.rating}
              />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default OffersPage;
