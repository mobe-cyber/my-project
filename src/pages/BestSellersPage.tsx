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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to generate a random number of sales between 100 and 1000
const generateRandomSales = () => Math.floor(Math.random() * (1000 - 100 + 1)) + 100;

const BestSellersPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [books, setBooks] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const booksRef = collection(db, "books");
        const querySnapshot = await getDocs(booksRef);

        const fetchedBooks: any[] = [];
        querySnapshot.forEach((doc) => {
          const bookData = doc.data();
          fetchedBooks.push({
            id: doc.id,
            title: bookData.title,
            author: bookData.author,
            coverImage: bookData.coverImage,
            price: bookData.price,
            rating: bookData.rating,
          });
        });

        // Check if sales data exists in localStorage
        const storedSales = localStorage.getItem("bestsellerSales");
        let booksWithSales;

        if (storedSales) {
          // If sales data exists, use it
          const salesData = JSON.parse(storedSales);
          booksWithSales = fetchedBooks.map((book) => ({
            ...book,
            sold: salesData[book.id] || generateRandomSales(), // Fallback in case of mismatch
          }));
        } else {
          // If no sales data, generate new sales and store them
          const salesData: { [key: string]: number } = {};
          booksWithSales = fetchedBooks.map((book) => {
            const sold = generateRandomSales();
            salesData[book.id] = sold;
            return { ...book, sold };
          });
          localStorage.setItem("bestsellerSales", JSON.stringify(salesData));
        }

        // Sort books by "sold" in descending order
        booksWithSales.sort((a, b) => b.sold - a.sold);
        setBooks(booksWithSales);
      } catch (error) {
        console.error("Error fetching books from Firestore:", error);
        setBooks([]);
      }
    };

    fetchBooks();
  }, []);

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
              {language === 'en' ? 'Top 5 Books of All Time' : 'أفضل 5 كتب على الإطلاق'}
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
                <div
                  key={book.id}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-accent transition-colors"
                >
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
              sold={book.sold} // Pass the sold field to BookCard
            />
          ))}
        </div>

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