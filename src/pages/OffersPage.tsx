import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { Tag, Percent } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Function to generate a random discount between 10 and 50
const generateRandomDiscount = () => Math.floor(Math.random() * (50 - 10 + 1)) + 10;

const OffersPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [offers, setOffers] = useState<any[]>([]);

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

        // Check if discount data exists in localStorage
        const storedDiscounts = localStorage.getItem("offerDiscounts");
        let booksWithOffers;

        if (storedDiscounts) {
          // If discounts exist, use them
          const discountsData = JSON.parse(storedDiscounts);
          booksWithOffers = fetchedBooks.map((book) => {
            const discount = discountsData[book.id] || generateRandomDiscount();
            const originalPrice = book.price / (1 - discount / 100); // Calculate original price
            return {
              ...book,
              discount,
              originalPrice: Number(originalPrice.toFixed(2)),
            };
          });
        } else {
          // If no discounts, generate new ones and store them
          const discountsData: { [key: string]: number } = {};
          booksWithOffers = fetchedBooks.map((book) => {
            const discount = generateRandomDiscount();
            const originalPrice = book.price / (1 - discount / 100); // Calculate original price
            discountsData[book.id] = discount;
            return {
              ...book,
              discount,
              originalPrice: Number(originalPrice.toFixed(2)),
            };
          });
          localStorage.setItem("offerDiscounts", JSON.stringify(discountsData));
        }

        setOffers(booksWithOffers);
      } catch (error) {
        console.error("Error fetching books from Firestore:", error);
        setOffers([]);
      }
    };

    fetchBooks();
  }, []);

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