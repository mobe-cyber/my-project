import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Mock best selling books data
const bestSellersEn = [
  {
    id: 101,
    title: "The Psychology of Money",
    author: "Morgan Housel",
    coverImage: "https://picsum.photos/seed/psych1/300/400",
    price: 15.99,
    rating: 4.8,
    sold: 15420
  },
  {
    id: 102,
    title: "Atomic Habits",
    author: "James Clear",
    coverImage: "https://picsum.photos/seed/habits1/300/400",
    price: 14.99,
    rating: 4.9,
    sold: 12350
  },
  {
    id: 103,
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    coverImage: "https://picsum.photos/seed/think1/300/400",
    price: 12.99,
    rating: 4.7,
    sold: 10780
  },
  {
    id: 104,
    title: "The Subtle Art of Not Giving a F*ck",
    author: "Mark Manson",
    coverImage: "https://picsum.photos/seed/subtle1/300/400",
    price: 13.99,
    rating: 4.6,
    sold: 9850
  },
  {
    id: 105,
    title: "Rich Dad Poor Dad",
    author: "Robert T. Kiyosaki",
    coverImage: "https://picsum.photos/seed/rich1/300/400",
    price: 11.99,
    rating: 4.5,
    sold: 9240
  },
  {
    id: 106,
    title: "The 7 Habits of Highly Effective People",
    author: "Stephen R. Covey",
    coverImage: "https://picsum.photos/seed/seven1/300/400",
    price: 16.99,
    rating: 4.7,
    sold: 8970
  },
  {
    id: 107,
    title: "How to Win Friends and Influence People",
    author: "Dale Carnegie",
    coverImage: "https://picsum.photos/seed/win1/300/400",
    price: 10.99,
    rating: 4.6,
    sold: 8540
  },
  {
    id: 108,
    title: "The Power of Now",
    author: "Eckhart Tolle",
    coverImage: "https://picsum.photos/seed/power1/300/400",
    price: 14.49,
    rating: 4.5,
    sold: 7920
  },
  {
    id: 109,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    coverImage: "https://picsum.photos/seed/think2/300/400",
    price: 18.99,
    rating: 4.7,
    sold: 7650
  },
  {
    id: 110,
    title: "Start with Why",
    author: "Simon Sinek",
    coverImage: "https://picsum.photos/seed/why1/300/400",
    price: 13.49,
    rating: 4.6,
    sold: 7320
  },
];

// Arabic titles and authors for the same books
const bestSellersAr = [
  {
    id: 101,
    title: "علم نفس المال",
    author: "مورجان هوسيل",
    coverImage: "https://picsum.photos/seed/psych1/300/400",
    price: 15.99,
    rating: 4.8,
    sold: 15420
  },
  {
    id: 102,
    title: "العادات الذرية",
    author: "جيمس كلير",
    coverImage: "https://picsum.photos/seed/habits1/300/400",
    price: 14.99,
    rating: 4.9,
    sold: 12350
  },
  {
    id: 103,
    title: "فكر وازدد ثراء",
    author: "نابليون هيل",
    coverImage: "https://picsum.photos/seed/think1/300/400",
    price: 12.99,
    rating: 4.7,
    sold: 10780
  },
  {
    id: 104,
    title: "فن اللامبالاة",
    author: "مارك مانسون",
    coverImage: "https://picsum.photos/seed/subtle1/300/400",
    price: 13.99,
    rating: 4.6,
    sold: 9850
  },
  {
    id: 105,
    title: "الأب الغني والأب الفقير",
    author: "روبرت كيوساكي",
    coverImage: "https://picsum.photos/seed/rich1/300/400",
    price: 11.99,
    rating: 4.5,
    sold: 9240
  },
  {
    id: 106,
    title: "العادات السبع للناس الأكثر فعالية",
    author: "ستيفن كوفي",
    coverImage: "https://picsum.photos/seed/seven1/300/400",
    price: 16.99,
    rating: 4.7,
    sold: 8970
  },
  {
    id: 107,
    title: "كيف تكسب الأصدقاء وتؤثر في الناس",
    author: "ديل كارنيجي",
    coverImage: "https://picsum.photos/seed/win1/300/400",
    price: 10.99,
    rating: 4.6,
    sold: 8540
  },
  {
    id: 108,
    title: "قوة الآن",
    author: "إيكهارت تول",
    coverImage: "https://picsum.photos/seed/power1/300/400",
    price: 14.49,
    rating: 4.5,
    sold: 7920
  },
  {
    id: 109,
    title: "التفكير السريع والبطيء",
    author: "دانييل كانيمان",
    coverImage: "https://picsum.photos/seed/think2/300/400",
    price: 18.99,
    rating: 4.7,
    sold: 7650
  },
  {
    id: 110,
    title: "ابدأ بلماذا",
    author: "سايمون سينيك",
    coverImage: "https://picsum.photos/seed/why1/300/400",
    price: 13.49,
    rating: 4.6,
    sold: 7320
  },
];

const BestSellersPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [books, setBooks] = useState(language === 'en' ? bestSellersEn : bestSellersAr);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;
  
  useEffect(() => {
    setBooks(language === 'en' ? bestSellersEn : bestSellersAr);
  }, [language]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = books.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(books.length / booksPerPage);
  
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{language === 'en' ? 'Bestsellers' : 'الأكثر مبيعاً'}</h1>
          <p className="text-muted-foreground">
            {language === 'en' 
              ? 'Discover our most popular books loved by readers worldwide' 
              : 'اكتشف أكثر كتبنا شهرة التي يحبها القراء حول العالم'}
          </p>
        </div>
        
        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>
              {language === 'en' ? 'Top 10 Books of All Time' : 'أفضل 10 كتب على الإطلاق'}
            </CardTitle>
            <CardDescription>
              {language === 'en' 
                ? 'Based on total sales and reader reviews' 
                : 'بناءً على إجمالي المبيعات وتقييمات القراء'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {books.slice(0, 5).map((book, index) => (
                <div key={book.id} className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors">
                  <div className="text-2xl font-bold text-muted-foreground w-8 text-center">
                    {index + 1}
                  </div>
                  <div className="w-12 h-16 relative overflow-hidden rounded">
                    <img 
                      src={book.coverImage} 
                      alt={book.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">{book.author}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {language === 'en' ? `${book.sold.toLocaleString()} sold` : `${book.sold.toLocaleString()} مبيعات`}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {currentBooks.map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverImage={book.coverImage}
              price={book.price}
              rating={book.rating}
            />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-8">
            <PaginationContent>
              <PaginationItem>
                {currentPage === 1 ? (
                  <Button 
                    variant="ghost" 
                    size="default" 
                    className="gap-1 pl-2.5 opacity-50 cursor-not-allowed" 
                    disabled
                  >
                    <span>{language === 'en' ? 'Previous' : 'السابق'}</span>
                  </Button>
                ) : (
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className="cursor-pointer"
                  />
                )}
              </PaginationItem>
              
              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => paginate(i + 1)}
                    className="cursor-pointer"
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                {currentPage === totalPages ? (
                  <Button 
                    variant="ghost" 
                    size="default" 
                    className="gap-1 pr-2.5 opacity-50 cursor-not-allowed" 
                    disabled
                  >
                    <span>{language === 'en' ? 'Next' : 'التالي'}</span>
                  </Button>
                ) : (
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className="cursor-pointer"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </Layout>
  );
};

export default BestSellersPage;
