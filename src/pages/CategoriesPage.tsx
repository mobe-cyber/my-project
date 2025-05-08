import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// واجهة الكتاب
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  categoryId: number;
  isbn?: string;
  ratingCount?: number;
}

// واجهة الفئة
interface Category {
  id: number;
  name: string;
  count: number;
  icon: string;
}

const CategoriesPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [categories, setCategories] = useState<Category[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // قائمة الفئات الثابتة (يمكن استبدالها بجلب من Firestore لاحقًا)
  const categoriesEn = [
    { id: 1, name: "Fiction", count: 0, icon: "📚" },
    { id: 2, name: "Science & Technology", count: 0, icon: "🔬" },
    { id: 3, name: "Business", count: 0, icon: "💼" },
    { id: 4, name: "Self Development", count: 0, icon: "🌱" },
    { id: 5, name: "Biography", count: 0, icon: "👤" },
    { id: 6, name: "History", count: 0, icon: "🏛️" },
    { id: 7, name: "Art & Design", count: 0, icon: "🎨" },
    { id: 8, name: "Health & Fitness", count: 0, icon: "💪" },
  ];

  const categoriesAr = [
    { id: 1, name: "الخيال", count: 0, icon: "📚" },
    { id: 2, name: "العلوم والتكنولوجيا", count: 0, icon: "🔬" },
    { id: 3, name: "الأعمال", count: 0, icon: "💼" },
    { id: 4, name: "تطوير الذات", count: 0, icon: "🌱" },
    { id: 5, name: "السيرة الذاتية", count: 0, icon: "👤" },
    { id: 6, name: "التاريخ", count: 0, icon: "🏛️" },
    { id: 7, name: "الفن والتصميم", count: 0, icon: "🎨" },
    { id: 8, name: "الصحة واللياقة", count: 0, icon: "💪" },
  ];

  useEffect(() => {
    const fetchCategoriesAndBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // تحديد الفئات بناءً على اللغة
        const baseCategories = language === "en" ? categoriesEn : categoriesAr;
        setCategories(baseCategories);

        // جلب الكتب من Firestore
        const booksCollection = collection(db, "books");
        let booksQuery;

        // فلترة بناءً على التصنيف إذا كان موجود
        if (categoryId) {
          const catId = parseInt(categoryId);
          booksQuery = query(booksCollection, where("categoryId", "==", catId));
          const category = baseCategories.find((cat) => cat.id === catId);
          setSelectedCategory(category || null);
        } else {
          booksQuery = booksCollection; // كل الكتب إذا ما فيش تصنيف
        }

        // تنفيذ الاستعلام
        const booksSnapshot = await getDocs(booksQuery);
        const booksData: Book[] = booksSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Record<string, unknown>),
        })) as Book[];

        // فلترة بناءً على نطاق السعر
        const filteredBooks = booksData.filter((book) => book.price <= priceRange);

        setBooks(filteredBooks);

        // تحديث عدد الكتب في كل فئة
        const updatedCategories = baseCategories.map((category) => {
          const count = filteredBooks.filter((book) => book.categoryId === category.id).length;
          return { ...category, count };
        });
        setCategories(updatedCategories);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(
          language === "en"
            ? "Failed to load books. Please try again later."
            : "فشل تحميل الكتب. حاول مرة أخرى لاحقًا."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndBooks();
  }, [categoryId, language, priceRange]);

  // ترتيب الكتب
  const sortedBooks = [...books].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default: // featured
        return 0;
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-card border border-border rounded-lg p-6 shadow-md">
              <h2 className="text-xl font-bold mb-4 text-foreground">{t("categories")}</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className={`block p-2 rounded-md hover:bg-accent transition-colors ${
                      selectedCategory?.id === category.id
                        ? "bg-accent text-accent-foreground font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name} ({category.count})
                  </Link>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-2 text-foreground">
                  {language === "en" ? "Sort by" : "ترتيب حسب"}
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="featured"
                      checked={sortBy === "featured"}
                      onChange={() => setSortBy("featured")}
                      className="me-2"
                    />
                    {language === "en" ? "Featured" : "مميز"}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="price-low"
                      checked={sortBy === "price-low"}
                      onChange={() => setSortBy("price-low")}
                      className="me-2"
                    />
                    {language === "en" ? "Price: Low to High" : "السعر: من الأقل إلى الأعلى"}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="price-high"
                      checked={sortBy === "price-high"}
                      onChange={() => setSortBy("price-high")}
                      className="me-2"
                    />
                    {language === "en" ? "Price: High to Low" : "السعر: من الأعلى إلى الأقل"}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="rating"
                      checked={sortBy === "rating"}
                      onChange={() => setSortBy("rating")}
                      className="me-2"
                    />
                    {language === "en" ? "Top Rated" : "الأعلى تقييماً"}
                  </label>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold mb-4 text-foreground">
                  {language === "en" ? "Price Range" : "نطاق السعر"}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>$0</span>
                    <span>${priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Books Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2 text-foreground">
                {selectedCategory ? selectedCategory.name : t("categories")}
              </h1>
              <p className="text-muted-foreground">
                {selectedCategory ? (
                  language === "en"
                    ? `Showing ${sortedBooks.length} books in ${selectedCategory.name}`
                    : `عرض ${sortedBooks.length} كتاب في ${selectedCategory.name}`
                ) : (
                  language === "en"
                    ? "Browse all categories and books"
                    : "تصفح جميع الفئات والكتب"
                )}
              </p>
            </div>

            {error && (
              <div className="text-center text-red-500 mb-4">{error}</div>
            )}

            {!categoryId && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className="bg-card hover:bg-accent transition-colors duration-200 rounded-lg p-6 text-center shadow-sm border border-border hover:shadow-md"
                  >
                    <div className="text-3xl mb-2 text-foreground">{category.icon}</div>
                    <h3 className="font-semibold mb-1 text-foreground">{category.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {category.count} {language === "en" ? "books" : "كتاب"}
                    </p>
                  </Link>
                ))}
              </div>
            )}

            {isLoading && !error && (
              <div className="text-center text-muted-foreground">
                {language === "en" ? "Loading..." : "جاري التحميل..."}
              </div>
            )}

            {sortedBooks.length === 0 && !isLoading && categoryId && (
              <div className="text-center text-muted-foreground">
                {language === "en" ? "No books found in this category." : "لا توجد كتب في هذه الفئة."}
              </div>
            )}

            {sortedBooks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    title={book.title}
                    author={book.author}
                    coverImage={book.coverImage || "https://via.placeholder.com/300"}
                    price={book.price}
                    rating={book.rating}
                    isbn={book.isbn}
                    ratingCount={book.ratingCount}
                  />
                ))}
              </div>
            )}

            {sortedBooks.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => {}}>
                  {language === "en" ? "Load More" : "تحميل المزيد"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoriesPage;