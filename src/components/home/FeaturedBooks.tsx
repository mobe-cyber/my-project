import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import BookCard from "@/components/books/BookCard";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
// بيانات الكتب الافتراضية في حالة عدم وجود كتب في localStorage
const mockBooks = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Doe",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    rating: 4.5,
    categoryId: 2
  },
  {
    id: 2,
    title: "Digital Marketing Strategies",
    author: "Jane Smith",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    rating: 4.2,
    categoryId: 3
  },
  {
    id: 3,
    title: "Modern Web Development",
    author: "Alex Johnson",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    price: 29.99,
    rating: 4.8,
    categoryId: 2
  },
  {
    id: 4,
    title: "The Science of Data",
    author: "Sarah Williams",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    price: 22.99,
    rating: 4.6,
    categoryId: 2
  },
  {
    id: 5,
    title: "Artificial Intelligence Basics",
    author: "Michael Brown",
    coverImage: "https://picsum.photos/seed/book5/300/400",
    price: 27.99,
    rating: 4.3,
    categoryId: 2
  },
  {
    id: 6,
    title: "Business Leadership",
    author: "Robert Miller",
    coverImage: "https://picsum.photos/seed/book6/300/400",
    price: 18.99,
    rating: 4.4,
    categoryId: 3
  },
  {
    id: 7,
    title: "Psychology of Success",
    author: "Emily Davis",
    coverImage: "https://picsum.photos/seed/book7/300/400",
    price: 21.99,
    rating: 4.7,
    categoryId: 4
  },
  {
    id: 8,
    title: "Financial Freedom",
    author: "David Wilson",
    coverImage: "https://picsum.photos/seed/book8/300/400",
    price: 23.99,
    rating: 4.1,
    categoryId: 3
  }
];

// العناوين والمؤلفون باللغة العربية لنفس الكتب
const mockBooksAr = [
  {
    id: 1,
    title: "فن البرمجة",
    author: "جون دو",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    rating: 4.5,
    categoryId: 2
  },
  {
    id: 2,
    title: "استراتيجيات التسويق الرقمي",
    author: "جين سميث",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    rating: 4.2,
    categoryId: 3
  },
  {
    id: 3,
    title: "تطوير الويب الحديث",
    author: "أليكس جونسون",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    price: 29.99,
    rating: 4.8,
    categoryId: 2
  },
  {
    id: 4,
    title: "علم البيانات",
    author: "سارة ويليامز",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    price: 22.99,
    rating: 4.6,
    categoryId: 2
  },
  {
    id: 5,
    title: "أساسيات الذكاء الاصطناعي",
    author: "مايكل براون",
    coverImage: "https://picsum.photos/seed/book5/300/400",
    price: 27.99,
    rating: 4.3,
    categoryId: 2
  },
  {
    id: 6,
    title: "القيادة في الأعمال",
    author: "روبرت ميلر",
    coverImage: "https://picsum.photos/seed/book6/300/400",
    price: 18.99,
    rating: 4.4,
    categoryId: 3
  },
  {
    id: 7,
    title: "علم نفس النجاح",
    author: "إيميلي ديفيس",
    coverImage: "https://picsum.photos/seed/book7/300/400",
    price: 21.99,
    rating: 4.7,
    categoryId: 4
  },
  {
    id: 8,
    title: "الحرية المالية",
    author: "ديفيد ويلسون",
    coverImage: "https://picsum.photos/seed/book8/300/400",
    price: 23.99,
    rating: 4.1,
    categoryId: 3
  }
];

interface FeaturedBooksProps {
  title: string;
  limit?: number;
  viewAllLink?: string;
  categoryId?: number; // إضافة معرف الفئة لتصفية الكتب حسب الفئة
}

const FeaturedBooks = ({ title, limit = 6, viewAllLink, categoryId }: FeaturedBooksProps) => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // دالة لجلب الكتب من Firebase
    const fetchBooks = async () => {
      try {
        // إنشاء الاستعلام المناسب حسب وجود معرف الفئة
        let q;
        if (categoryId) {
          q = query(collection(db, "books"), where("categoryId", "==", categoryId));
        } else {
          q = collection(db, "books");
        }
        
        const querySnapshot = await getDocs(q);
        const fetchedBooks: any[] = [];
        
        querySnapshot.forEach((doc) => {
          fetchedBooks.push({
            id: doc.id,
            ...(doc.data() as Record<string, any>)
          });
        });
        
        // تحديث localStorage بالبيانات الجديدة
        localStorage.setItem('adminBooks', JSON.stringify(fetchedBooks));
        
        // تعيين الكتب في حالة المكون
        setBooks(fetchedBooks);
      } catch (error) {
        console.error("Error fetching books from Firebase:", error);
        
        // في حالة حدوث خطأ، استخدم البيانات المخزنة محلياً أو البيانات الافتراضية
        const savedBooks = localStorage.getItem('adminBooks');
        let booksToUse;
        
        if (savedBooks) {
          // إذا كانت هناك كتب في localStorage، استخدمها
          const allBooks = JSON.parse(savedBooks);
          
          // تطبيق التصفية حسب الفئة إذا تم تحديدها
          if (categoryId) {
            booksToUse = allBooks.filter((book: any) => book.categoryId === categoryId);
          } else {
            booksToUse = allBooks;
          }
        } else {
          // إذا لم تكن هناك كتب في localStorage، استخدم البيانات الوهمية
          booksToUse = language === 'en' ? mockBooks : mockBooksAr;
          
          // تطبيق التصفية حسب الفئة إذا تم تحديدها
          if (categoryId) {
            booksToUse = booksToUse.filter((book: any) => book.categoryId === categoryId);
          }
        }
        
        setBooks(booksToUse);
      }
    };
  
    // استدعاء دالة جلب الكتب
    fetchBooks();
  }, [language, categoryId]);
  
  // لا تغيير في الباقي، يبقى كما هو
  if (books.length === 0) {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">{title}</h2>
          </div>
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {language === 'en' ? 'No books available in this category.' : 'لا توجد كتب متاحة في هذه الفئة.'}
            </p>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">{title}</h2>
          {viewAllLink && books.length > limit && (
            <Button variant="outline" asChild>
              <Link to={viewAllLink}>{t('viewAll')}</Link>
            </Button>
          )}
        </div>
  
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {books.slice(0, limit).map((book) => (
            <BookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              coverImage={book.coverImage}
              price={book.price}
              rating={book.rating}
              originalPrice={book.originalPrice}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
export default FeaturedBooks;