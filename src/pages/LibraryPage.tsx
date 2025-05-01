
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Download, 
  Search, 
  Book, 
  Grid3X3, 
  List, 
  SortDesc 
} from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

// Mock library books
const libraryBooksEn = [
  {
    id: 1,
    title: "The Art of Programming",
    author: "John Doe",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    format: "PDF & ePub",
    purchaseDate: "Apr 28, 2025",
    fileSize: "4.2 MB"
  },
  {
    id: 2,
    title: "Digital Marketing Strategies",
    author: "Jane Smith",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    format: "PDF & ePub",
    purchaseDate: "Apr 28, 2025",
    fileSize: "3.8 MB"
  },
  {
    id: 3,
    title: "Modern Web Development",
    author: "Alex Johnson",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    format: "PDF & ePub",
    purchaseDate: "Mar 15, 2025",
    fileSize: "5.6 MB"
  },
  {
    id: 4,
    title: "The Science of Data",
    author: "Sarah Williams",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    format: "PDF & ePub",
    purchaseDate: "Feb 20, 2025",
    fileSize: "7.1 MB"
  }
];

const libraryBooksAr = [
  {
    id: 1,
    title: "فن البرمجة",
    author: "جون دو",
    coverImage: "https://picsum.photos/seed/book1/300/400",
    format: "PDF و ePub",
    purchaseDate: "28 أبريل 2025",
    fileSize: "4.2 ميجابايت"
  },
  {
    id: 2,
    title: "استراتيجيات التسويق الرقمي",
    author: "جين سميث",
    coverImage: "https://picsum.photos/seed/book2/300/400",
    format: "PDF و ePub",
    purchaseDate: "28 أبريل 2025",
    fileSize: "3.8 ميجابايت"
  },
  {
    id: 3,
    title: "تطوير الويب الحديث",
    author: "أليكس جونسون",
    coverImage: "https://picsum.photos/seed/book3/300/400",
    format: "PDF و ePub",
    purchaseDate: "15 مارس 2025",
    fileSize: "5.6 ميجابايت"
  },
  {
    id: 4,
    title: "علم البيانات",
    author: "سارة ويليامز",
    coverImage: "https://picsum.photos/seed/book4/300/400",
    format: "PDF و ePub",
    purchaseDate: "20 فبراير 2025",
    fileSize: "7.1 ميجابايت"
  }
];

interface LibraryBook {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  format: string;
  purchaseDate: string;
  fileSize: string;
}

const LibraryPage = () => {
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortOrder, setSortOrder] = useState<"title" | "date">("date");
  
  useEffect(() => {
    // Update books based on language
    setBooks(language === 'en' ? libraryBooksEn : libraryBooksAr);
  }, [language]);
  
  // Filter books based on search query
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    book.author.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort books based on selected order
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortOrder === "title") {
      return a.title.localeCompare(b.title);
    } else {
      // Assuming newer purchases are listed first
      return 0; // In a real app, would compare actual dates
    }
  });
  
  const handleDownload = (id: number) => {
    // In a real app, this would download the actual file
    toast({
      title: language === 'en' ? "Download started" : "بدأ التنزيل",
      description: language === 'en' ? 
        "Your book is downloading..." : 
        "جاري تحميل كتابك...",
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {language === 'en' ? 'My Library' : 'مكتبتي'}
            </h1>
            <p className="text-muted-foreground">
              {language === 'en' ? 
                `${books.length} books in your library` : 
                `${books.length} كتاب في مكتبتك`}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Input
                placeholder={language === 'en' ? "Search your books..." : "ابحث في كتبك..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pe-10"
              />
              <Search className="absolute top-1/2 transform -translate-y-1/2 right-3 h-4 w-4 text-muted-foreground" />
            </div>
            
            {/* View & Sort Controls */}
            <div className="flex rounded-md border border-border">
              <button 
                className={`flex items-center justify-center p-2 ${
                  viewMode === "grid" ? 'bg-muted' : ''
                }`}
                onClick={() => setViewMode("grid")}
                title={language === 'en' ? "Grid view" : "عرض شبكي"}
              >
                <Grid3X3 className="h-5 w-5" />
              </button>
              <button 
                className={`flex items-center justify-center p-2 border-l border-border ${
                  viewMode === "list" ? 'bg-muted' : ''
                }`}
                onClick={() => setViewMode("list")}
                title={language === 'en' ? "List view" : "عرض قائمة"}
              >
                <List className="h-5 w-5" />
              </button>
              <button 
                className="flex items-center justify-center p-2 border-l border-border"
                onClick={() => setSortOrder(sortOrder === "title" ? "date" : "title")}
                title={language === 'en' ? "Change sort order" : "تغيير ترتيب العرض"}
              >
                <SortDesc className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Library Content */}
        {books.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Book className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'Your library is empty' : 'مكتبتك فارغة'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {language === 'en' ? 
                'Looks like you haven\'t purchased any books yet. Start exploring our collection to find your next read!' : 
                'يبدو أنك لم تشتر أي كتب بعد. ابدأ باستكشاف مجموعتنا للعثور على قراءتك التالية!'}
            </p>
            <Button asChild>
              <Link to="/categories">
                {language === 'en' ? 'Browse Books' : 'تصفح الكتب'}
              </Link>
            </Button>
          </div>
        ) : (
          <div>
            {filteredBooks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {language === 'en' ? 
                    'No books match your search query.' : 
                    'لا توجد كتب تطابق استعلام البحث الخاص بك.'}
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {sortedBooks.map((book) => (
                  <div key={book.id} className="flex flex-col">
                    <div className="relative pb-[140%] overflow-hidden rounded-lg shadow-md border border-border mb-3">
                      <img 
                        src={book.coverImage} 
                        alt={book.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-semibold line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                    <div className="mt-auto">
                      <Button 
                        onClick={() => handleDownload(book.id)}
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        {language === 'en' ? 'Download' : 'تحميل'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedBooks.map((book) => (
                  <Card key={book.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-24 h-36 sm:me-6 mb-4 sm:mb-0 flex-shrink-0">
                          <img 
                            src={book.coverImage} 
                            alt={book.title} 
                            className="w-full h-full object-cover rounded border border-border"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                          <p className="text-muted-foreground mb-2">{book.author}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>
                              <span className="font-medium">
                                {language === 'en' ? 'Format: ' : 'الصيغة: '}
                              </span>
                              {book.format}
                            </div>
                            <div>
                              <span className="font-medium">
                                {language === 'en' ? 'Size: ' : 'الحجم: '}
                              </span>
                              {book.fileSize}
                            </div>
                            <div>
                              <span className="font-medium">
                                {language === 'en' ? 'Purchased: ' : 'تاريخ الشراء: '}
                              </span>
                              {book.purchaseDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex sm:flex-col sm:justify-center mt-4 sm:mt-0 gap-3 sm:ms-6 flex-shrink-0">
                          <Button 
                            onClick={() => handleDownload(book.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            PDF
                          </Button>
                          <Button 
                            onClick={() => handleDownload(book.id)}
                            variant="outline"
                            size="sm"
                            className="flex items-center justify-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            ePub
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LibraryPage;
