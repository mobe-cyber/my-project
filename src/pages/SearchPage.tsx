import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { Search } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      setIsLoading(true);

      try {
        const booksRef = collection(db, "books");
        const querySnapshot = await getDocs(booksRef);

        const filteredBooks: any[] = [];
        const uniqueBooks = new Set<string>();

        querySnapshot.forEach((doc) => {
          const bookData = doc.data();
          const bookTitle = bookData.title;
          if (bookTitle && bookTitle.toLowerCase().includes(queryParam.toLowerCase()) && !uniqueBooks.has(doc.id)) {
            uniqueBooks.add(doc.id);
            filteredBooks.push({
              id: doc.id,
              title: bookData.title,
              author: bookData.author,
              coverImage: bookData.coverImage,
              price: bookData.price,
              originalPrice: bookData.originalPrice,
              rating: bookData.rating,
            });
          }
        });

        setResults(filteredBooks);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults([]);
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

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
                ? `Found ${results.length} results for "${queryParam}"`
                : `تم العثور على ${results.length} نتيجة لـ "${queryParam}"`}
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