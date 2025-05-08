import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  ShoppingCart,
  Users,
  Plus,
  TrendingUp,
  Clock,
  Search,
  ChevronRight,
} from "lucide-react";
import { FixedSizeList as VirtualizedList } from 'react-window';
import BookCard from "@/components/books/BookCard";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { getIdTokenResult } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// واجهات البيانات
interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  isbn: string;
  ratingCount: number;
  categoryId?: number;
  created_at?: Timestamp;
}

interface Sale {
  id: string;
  amount: number;
  date: Timestamp;
  bookId: string;
  userId: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  lastLogin?: Timestamp;
}

interface Stat {
  title: string;
  value: string;
  description: string;
  icon: JSX.Element;
  trend?: number;
}

interface SalesData {
  date: string;
  amount: number;
}

const AdminDashboardPage = () => {
  const { language } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // States
  const [stats, setStats] = useState<Stat[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("month");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // التحقق من صلاحيات المسؤول
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsAuthenticated(true);
        try {
          const tokenResult = await getIdTokenResult(user);
          const isAdminUser = !!tokenResult.claims.admin;
          setIsAdmin(isAdminUser);
          if (!isAdminUser) {
            toast({
              title: language === "en" ? "Access Denied" : "تم رفض الوصول",
              description: language === "en" 
                ? "You don't have admin privileges." 
                : "ليس لديك صلاحيات المسؤول.",
              variant: "destructive",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error checking admin status:", error);
          setError(
            language === "en"
              ? "Failed to verify admin permissions."
              : "فشل التحقق من صلاحيات المسؤول."
          );
          setIsAdmin(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsAdmin(false);
        navigate("/login");
      }
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [language, navigate, toast]);

  // جلب البيانات من Firestore
  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !isAdmin) return;

    try {
      setIsLoading(true);
      setError(null);

      // جلب الكتب مع الترتيب حسب تاريخ الإضافة
      const booksQuery = query(
        collection(db, "books"),
        orderBy("created_at", "desc"),
        limit(50)
      );
      const booksSnapshot = await getDocs(booksQuery);
      const booksData = booksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];
      setBooks(booksData);

      // جلب المبيعات الأخيرة
      const salesQuery = query(
        collection(db, "sales"),
        orderBy("date", "desc"),
        limit(10)
      );
      const salesSnapshot = await getDocs(salesQuery);
      const salesData = salesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Sale[];
      setRecentSales(salesData);

      // جلب المستخدمين الجدد
      const usersQuery = query(
        collection(db, "users"),
        orderBy("created_at", "desc"),
        limit(5)
      );
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[];
      setRecentUsers(usersData);

      // تجميع بيانات المبيعات للرسم البياني
      const today = new Date();
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const salesChartQuery = query(
        collection(db, "sales"),
        where("date", ">=", Timestamp.fromDate(monthStart)),
        orderBy("date", "asc")
      );
      const salesChartSnapshot = await getDocs(salesChartQuery);
      
      // تجميع المبيعات حسب اليوم
      const salesByDay = salesChartSnapshot.docs.reduce((acc, doc) => {
        const sale = doc.data() as Sale;
        const date = sale.date.toDate().toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + sale.amount;
        return acc;
      }, {} as Record<string, number>);

      // تحويل البيانات إلى تنسيق مناسب للرسم البياني
      const chartData = Object.entries(salesByDay).map(([date, amount]) => ({
        date,
        amount,
      }));
      setSalesData(chartData);

      // تحديث الإحصائيات
      const totalSales = salesChartSnapshot.docs.reduce(
        (sum, doc) => sum + (doc.data() as Sale).amount,
        0
      );
      const totalUsers = (await getDocs(collection(db, "users"))).size;

      const updatedStats: Stat[] = [
        {
          title: language === "en" ? "Total Books" : "إجمالي الكتب",
          value: booksData.length.toString(),
          description: language === "en" ? "Books in the store" : "كتاب في المتجر",
          icon: <BookOpen className="h-6 w-6" />,
          trend: 0,
        },
        {
          title: language === "en" ? "Total Sales" : "إجمالي المبيعات",
          value: `$${totalSales.toLocaleString()}`,
          description: language === "en" ? "Monthly sales" : "المبيعات الشهرية",
          icon: <ShoppingCart className="h-6 w-6" />,
          trend: 12.5,
        },
        {
          title: language === "en" ? "Total Users" : "إجمالي المستخدمين",
          value: totalUsers.toString(),
          description: language === "en" ? "Registered users" : "مستخدم مسجل",
          icon: <Users className="h-6 w-6" />,
          trend: 5.2,
        },
        {
          title: language === "en" ? "Average Rating" : "متوسط التقييم",
          value: (
            booksData.reduce((sum, book) => sum + (book.rating || 0), 0) /
            booksData.length
          ).toFixed(1),
          description: language === "en" ? "Book ratings" : "تقييمات الكتب",
          icon: <TrendingUp className="h-6 w-6" />,
          trend: 2.1,
        },
      ];
      setStats(updatedStats);

    } catch (error) {
      console.error("Error fetching data:", error);
      setError(
        language === "en"
          ? "Failed to load dashboard data. Please try again later."
          : "فشل تحميل بيانات لوحة التحكم. حاول مرة أخرى لاحقًا."
      );
    } finally {
      setIsLoading(false);
    }
  }, [language, isAuthenticated, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // تصفية الكتب
  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || book.categoryId?.toString() === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchTerm, categoryFilter]);

  // التنقل إلى صفحة إضافة كتاب
  const handleAddBook = useCallback(() => {
    navigate("/admin/books/add");
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-muted-foreground">
          {language === "en" ? "Loading..." : "جاري التحميل..."}
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // سيتم التعامل معه في useEffect
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {language === "en" ? "Dashboard Overview" : "نظرة عامة على لوحة التحكم"}
        </h1>
        <Button onClick={handleAddBook}>
          <Plus className="h-5 w-5 mr-2" />
          {language === "en" ? "Add New Book" : "إضافة كتاب جديد"}
        </Button>
      </div>

      {error && (
        <div className="text-center text-red-500 mb-4 p-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {/* الإحصائيات */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-full">
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center mt-1">
                <CardDescription className="flex-1">
                  {stat.description}
                </CardDescription>
                {stat.trend && (
                  <span className={`text-sm ${stat.trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend > 0 ? '+' : ''}{stat.trend}%
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* الرسم البياني للمبيعات */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {language === "en" ? "Sales Overview" : "نظرة عامة على المبيعات"}
            </CardTitle>
            <Select value={timeRange} onValueChange={(value: "week" | "month" | "year") => setTimeRange(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={language === "en" ? "Select period" : "اختر الفترة"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">
                  {language === "en" ? "Last Week" : "الأسبوع الماضي"}
                </SelectItem>
                <SelectItem value="month">
                  {language === "en" ? "Last Month" : "الشهر الماضي"}
                </SelectItem>
                <SelectItem value="year">
                  {language === "en" ? "Last Year" : "السنة الماضية"}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* آخر المبيعات والمستخدمين */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Recent Sales" : "آخر المبيعات"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentSales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">
                        ${sale.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sale.date.toDate().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {language === "en" ? "Recent Users" : "آخر المستخدمين"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={user.avatar || "https://via.placeholder.com/40"}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                      loading="lazy"
                    />
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* قائمة الكتب */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {language === "en" ? "Book Inventory" : "مخزون الكتب"}
            </CardTitle>
            <div className="flex gap-4">
              <Input
                placeholder={language === "en" ? "Search books..." : "البحث في الكتب..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[200px]"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={language === "en" ? "All Categories" : "جميع الفئات"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {language === "en" ? "All Categories" : "جميع الفئات"}
                  </SelectItem>
                  {/* إضافة الفئات هنا */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredBooks.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              {language === "en" ? "No books found." : "لم يتم العثور على كتب."}
            </div>
          ) : (
            <VirtualizedList
              height={600}
              itemCount={filteredBooks.length}
              itemSize={200}
              width="100%"
            >
              {({ index, style }) => (
                <div style={style}>
                  <BookCard
                    key={filteredBooks[index].id}
                    id={filteredBooks[index].id}
                    title={filteredBooks[index].title}
                    author={filteredBooks[index].author}
                    coverImage={filteredBooks[index].coverImage}
                    price={filteredBooks[index].price}
                    rating={filteredBooks[index].rating}
                    isbn={filteredBooks[index].isbn}
                    ratingCount={filteredBooks[index].ratingCount}
                  />
                </div>
              )}
            </VirtualizedList>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardPage;