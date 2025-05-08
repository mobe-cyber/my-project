import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

// فئات المكتبة
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

const Categories = () => {
  const { language } = useTheme();
  const [categories, setCategories] = useState(language === 'en' ? categoriesEn : categoriesAr);

  // جلب الكتب من Firestore وتحديث عدد الكتب في كل فئة
  useEffect(() => {
    const booksCollection = collection(db, "books");
    const unsubscribe = onSnapshot(booksCollection, (snapshot) => {
      const books = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log("Books fetched from Firestore:", books); // تسجيل للتحقق

      // تحديث عدد الكتب في كل فئة
      const updatedCategories = (language === 'en' ? categoriesEn : categoriesAr).map(category => {
        const categoryBookCount = books.filter((book: any) => book.categoryId === category.id).length;
        return {
          ...category,
          count: categoryBookCount
        };
      });

      setCategories(updatedCategories);
    }, (error) => {
      console.error("Error fetching books: ", error);
    });

    return () => unsubscribe();
  }, [language]);

  return (
    <section className="py-12 bg-secondary/50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">
          {language === 'en' ? 'Browse by Category' : 'تصفح حسب الفئة'}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
      </div>
    </section>
  );
};

export default Categories;