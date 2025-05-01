
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { Search } from "lucide-react";

// Import mock book data from various sources
// We'll combine books from bestsellers, offers and categories
const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call to a backend search endpoint
    const fetchResults = async () => {
      setIsLoading(true);
      
      // Mock search functionality using combined books from all pages
      // In a real application, this would be a backend API call
      
      // Get all books data from mock data in the app
      // This is just a demo, in a real app you would fetch from an API
      const mockBooksEn = [
        // Books from bestsellers
        {
          id: 101,
          title: "The Power of Habit",
          author: "Charles Duhigg",
          coverImage: "https://picsum.photos/seed/habit1/300/400",
          price: 15.99,
          rating: 4.7,
        },
        {
          id: 201,
          title: "The Alchemist",
          author: "Paulo Coelho",
          coverImage: "https://picsum.photos/seed/alchemist1/300/400",
          price: 9.99,
          originalPrice: 14.99,
          rating: 4.8,
        },
        {
          id: 1,
          title: "The Art of Programming",
          author: "John Doe",
          coverImage: "https://picsum.photos/seed/book1/300/400",
          price: 19.99,
          rating: 4.5
        },
        // Add more books as needed
      ];
      
      const mockBooksAr = [
        // Books from bestsellers (Arabic)
        {
          id: 101,
          title: "قوة العادة",
          author: "تشارلز دويج",
          coverImage: "https://picsum.photos/seed/habit1/300/400",
          price: 15.99,
          rating: 4.7,
        },
        {
          id: 201,
          title: "الخيميائي",
          author: "باولو كويلو",
          coverImage: "https://picsum.photos/seed/alchemist1/300/400",
          price: 9.99,
          originalPrice: 14.99,
          rating: 4.8,
        },
        {
          id: 1,
          title: "فن البرمجة",
          author: "جون دو",
          coverImage: "https://picsum.photos/seed/book1/300/400",
          price: 19.99,
          rating: 4.5
        },
        // Add more books as needed
      ];
      
      // Filter books by search query
      const books = language === 'en' ? mockBooksEn : mockBooksAr;
      const filtered = books.filter(book => 
        book.title.toLowerCase().includes(query.toLowerCase()) || 
        book.author.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate network delay
      setTimeout(() => {
        setResults(filtered);
        setIsLoading(false);
      }, 500);
    };

    fetchResults();
  }, [query, language]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">
              {language === 'en' ? 'Search Results' : 'نتائج البحث'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' 
                ? `Found ${results.length} results for "${query}"` 
                : `تم العثور على ${results.length} نتيجة لـ "${query}"`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-muted/30 animate-pulse h-96 rounded-lg"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.title}
                author={book.author}
                coverImage={book.coverImage}
                price={book.price}
                originalPrice={book.originalPrice}
                rating={book.rating}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">
              {language === 'en' ? 'No results found' : 'لم يتم العثور على نتائج'}
            </h2>
            <p className="text-muted-foreground">
              {language === 'en'
                ? 'Try searching with different keywords'
                : 'حاول البحث بكلمات مختلفة'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
