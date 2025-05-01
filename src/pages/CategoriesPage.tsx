
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import BookCard from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";

// Mock categories data - same as in Components/Categories.tsx
const categoriesEn = [
  { id: 1, name: "Fiction", count: 120, icon: "📚" },
  { id: 2, name: "Science & Technology", count: 85, icon: "🔬" },
  { id: 3, name: "Business", count: 67, icon: "💼" },
  { id: 4, name: "Self Development", count: 94, icon: "🌱" },
  { id: 5, name: "Biography", count: 53, icon: "👤" },
  { id: 6, name: "History", count: 78, icon: "🏛️" },
  { id: 7, name: "Art & Design", count: 42, icon: "🎨" },
  { id: 8, name: "Health & Fitness", count: 36, icon: "💪" },
];

const categoriesAr = [
  { id: 1, name: "الخيال", count: 120, icon: "📚" },
  { id: 2, name: "العلوم والتكنولوجيا", count: 85, icon: "🔬" },
  { id: 3, name: "الأعمال", count: 67, icon: "💼" },
  { id: 4, name: "تطوير الذات", count: 94, icon: "🌱" },
  { id: 5, name: "السيرة الذاتية", count: 53, icon: "👤" },
  { id: 6, name: "التاريخ", count: 78, icon: "🏛️" },
  { id: 7, name: "الفن والتصميم", count: 42, icon: "🎨" },
  { id: 8, name: "الصحة واللياقة", count: 36, icon: "💪" },
];

// Mock books data
const mockBooksEn = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Doe",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    rating: 4.5
  },
  {
    id: 2,
    title: "Digital Marketing Strategies",
    author: "Jane Smith",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    rating: 4.2
  },
  {
    id: 3,
    title: "Modern Web Development",
    author: "Alex Johnson",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    price: 29.99,
    rating: 4.8
  },
  {
    id: 4,
    title: "The Science of Data",
    author: "Sarah Williams",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    price: 22.99,
    rating: 4.6
  },
  {
    id: 5,
    title: "Artificial Intelligence Basics",
    author: "Michael Brown",
    coverImage: "https://picsum.photos/seed/book5/300/400",
    price: 27.99,
    rating: 4.3
  },
  {
    id: 6,
    title: "Business Leadership",
    author: "Robert Miller",
    coverImage: "https://picsum.photos/seed/book6/300/400",
    price: 18.99,
    rating: 4.4
  },
  {
    id: 7,
    title: "Psychology of Success",
    author: "Emily Davis",
    coverImage: "https://picsum.photos/seed/book7/300/400",
    price: 21.99,
    rating: 4.7
  },
  {
    id: 8,
    title: "Financial Freedom",
    author: "David Wilson",
    coverImage: "https://picsum.photos/seed/book8/300/400",
    price: 23.99,
    rating: 4.1
  }
];

// Arabic titles and authors for the same books
const mockBooksAr = [
  {
    id: 1,
    title: "فن البرمجة",
    author: "جون دو",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    price: 19.99,
    rating: 4.5
  },
  {
    id: 2,
    title: "استراتيجيات التسويق الرقمي",
    author: "جين سميث",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    price: 24.99,
    rating: 4.2
  },
  {
    id: 3,
    title: "تطوير الويب الحديث",
    author: "أليكس جونسون",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    price: 29.99,
    rating: 4.8
  },
  {
    id: 4,
    title: "علم البيانات",
    author: "سارة ويليامز",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    price: 22.99,
    rating: 4.6
  },
  {
    id: 5,
    title: "أساسيات الذكاء الاصطناعي",
    author: "مايكل براون",
    coverImage: "https://picsum.photos/seed/book5/300/400",
    price: 27.99,
    rating: 4.3
  },
  {
    id: 6,
    title: "القيادة في الأعمال",
    author: "روبرت ميلر",
    coverImage: "https://picsum.photos/seed/book6/300/400",
    price: 18.99,
    rating: 4.4
  },
  {
    id: 7,
    title: "علم نفس النجاح",
    author: "إيميلي ديفيس",
    coverImage: "https://picsum.photos/seed/book7/300/400",
    price: 21.99,
    rating: 4.7
  },
  {
    id: 8,
    title: "الحرية المالية",
    author: "ديفيد ويلسون",
    coverImage: "https://picsum.photos/seed/book8/300/400",
    price: 23.99,
    rating: 4.1
  }
];

const CategoriesPage = () => {
  const { categoryId } = useParams();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const [categories, setCategories] = useState(language === 'en' ? categoriesEn : categoriesAr);
  const [books, setBooks] = useState(language === 'en' ? mockBooksEn : mockBooksAr);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [sortBy, setSortBy] = useState('featured');
  
  useEffect(() => {
    setCategories(language === 'en' ? categoriesEn : categoriesAr);
    setBooks(language === 'en' ? mockBooksEn : mockBooksAr);
    
    if (categoryId) {
      const category = (language === 'en' ? categoriesEn : categoriesAr)
        .find(cat => cat.id === parseInt(categoryId));
      setSelectedCategory(category || null);
    }
  }, [categoryId, language]);
  
  // Sorting functionality
  const sortedBooks = [...books].sort((a, b) => {
    switch(sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default: // featured or any other value
        return 0; // keep original order
    }
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Categories Sidebar */}
          <div className="lg:w-1/4">
            <div className="sticky top-24 bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('categories')}</h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link 
                    key={category.id}
                    to={`/categories/${category.id}`}
                    className={`block p-2 rounded-md hover:bg-accent transition-colors ${
                      selectedCategory?.id === category.id ? 'bg-accent text-accent-foreground font-semibold' : ''
                    }`}
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name} ({category.count})
                  </Link>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-2">{language === 'en' ? 'Sort by' : 'ترتيب حسب'}</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="featured"
                      checked={sortBy === 'featured'}
                      onChange={() => setSortBy('featured')}
                      className="me-2"
                    />
                    {language === 'en' ? 'Featured' : 'مميز'}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="price-low"
                      checked={sortBy === 'price-low'}
                      onChange={() => setSortBy('price-low')}
                      className="me-2"
                    />
                    {language === 'en' ? 'Price: Low to High' : 'السعر: من الأقل إلى الأعلى'}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="price-high"
                      checked={sortBy === 'price-high'}
                      onChange={() => setSortBy('price-high')}
                      className="me-2"
                    />
                    {language === 'en' ? 'Price: High to Low' : 'السعر: من الأعلى إلى الأقل'}
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="sort"
                      value="rating"
                      checked={sortBy === 'rating'}
                      onChange={() => setSortBy('rating')}
                      className="me-2"
                    />
                    {language === 'en' ? 'Top Rated' : 'الأعلى تقييماً'}
                  </label>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-semibold mb-4">{language === 'en' ? 'Price Range' : 'نطاق السعر'}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">$0</span>
                    <span className="text-sm text-muted-foreground">$50</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="50" 
                    step="5"
                    defaultValue="50"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Books Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">
                {selectedCategory ? selectedCategory.name : t('categories')}
              </h1>
              <p className="text-muted-foreground">
                {selectedCategory ? (
                  language === 'en' ? 
                    `Showing ${selectedCategory.count} books in ${selectedCategory.name}` : 
                    `عرض ${selectedCategory.count} كتاب في ${selectedCategory.name}`
                ) : (
                  language === 'en' ? 
                    'Browse all categories and books' : 
                    'تصفح جميع الفئات والكتب'
                )}
              </p>
            </div>
            
            {!categoryId && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                {categories.map((category) => (
                  <Link 
                    key={category.id} 
                    to={`/categories/${category.id}`}
                    className="bg-card hover:bg-accent transition-colors duration-200 rounded-lg p-6 text-center shadow-sm border border-border"
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {category.count} {language === 'en' ? 'books' : 'كتاب'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedBooks.map((book) => (
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
            
            {books.length > 0 && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline">
                  {language === 'en' ? 'Load More' : 'تحميل المزيد'}
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
