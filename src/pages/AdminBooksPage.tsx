import { useState, useEffect, useCallback, useMemo, useRef,  } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  BookPlus,
  Edit,
  Trash2,
  Search,
  Download,
  Upload,
  Image as ImageIcon,
  MoreVertical,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";
import { storage, db, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as XLSX from 'xlsx';
import debounce from 'lodash/debounce';

interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  coverImage: string;
  rating?: number;
  originalPrice?: number;
  categoryId?: number;
  description?: string;
  publishDate?: string;
  isbn?: string;
  language?: string;
  pageCount?: number;
  inStock?: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

const PAGE_SIZE = 10;

const AdminBooksPage = () => {
  const { language } = useTheme();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const firstFocusableElement = useRef<HTMLButtonElement>(null); // إضافة مرجع لأول عنصر تفاعلي

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [dialogAction, setDialogAction] = useState<"add" | "edit">("add");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
  const [imagePreview, setImagePreview] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const categories = useMemo(
    () => [
      { id: 1, name: language === "en" ? "Fiction" : "الخيال" },
      { id: 2, name: language === "en" ? "Science & Technology" : "العلوم والتكنولوجيا" },
      { id: 3, name: language === "en" ? "Business" : "الأعمال" },
      { id: 4, name: language === "en" ? "Self Development" : "تطوير الذات" },
      { id: 5, name: language === "en" ? "Biography" : "السيرة الذاتية" },
      { id: 6, name: language === "en" ? "History" : "التاريخ" },
      { id: 7, name: language === "en" ? "Art & Design" : "الفن والتصميم" },
      { id: 8, name: language === "en" ? "Health & Fitness" : "الصحة واللياقة" },
    ],
    [language]
  );

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    coverImage: "",
    rating: "",
    originalPrice: "",
    categoryId: "",
    description: "",
    publishDate: "",
    isbn: "",
    language: "",
    pageCount: "",
    inStock: "",
  });

  useEffect(() => {
    setIsLoading(true);
    let q = query(collection(db, "books"), orderBy(sortBy, sortOrder), limit(PAGE_SIZE));

    if (categoryFilter) {
      q = query(q, where("categoryId", "==", parseInt(categoryFilter)));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Book[];
      setBooks(booksData);
      setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setIsLoading(false);
    }, (error) => {
      console.error("Error fetching books:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to load books." : "فشل تحميل الكتب.",
        variant: "destructive",
      });
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [categoryFilter, sortBy, sortOrder, language, toast]);

  const debouncedSetSearchTerm = useCallback(
    debounce((value: string) => setSearchTerm(value), 300),
    []
  );

  const handleImageUpload = async (file: File) => {
    try {
      const storageRef = ref(storage, `book-covers/${file.name}-${Date.now()}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      setFormData((prev) => ({ ...prev, coverImage: downloadURL }));
      setImagePreview(downloadURL);
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en" ? "Image uploaded successfully" : "تم رفع الصورة بنجاح",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to upload image" : "فشل في رفع الصورة",
        variant: "destructive",
      });
    }
  };

  const handleExportToExcel = () => {
    const exportData = books.map((book) => ({
      ID: book.id,
      Title: book.title,
      Author: book.author,
      Category: getCategoryName(book.categoryId),
      Price: book.price,
      OriginalPrice: book.originalPrice || "",
      Rating: book.rating || "",
      ISBN: book.isbn || "",
      Language: book.language || "",
      PageCount: book.pageCount || "",
      InStock: book.inStock || "",
      CreatedAt: book.created_at?.toDate().toLocaleString() || "",
      UpdatedAt: book.updated_at?.toDate().toLocaleString() || "",
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Books");
    XLSX.writeFile(wb, `books-${new Date().toISOString().split("T")[0]}.xlsx`);
  };

  const handleBulkDelete = async () => {
    if (selectedBooks.size === 0) return;

    try {
      const batch = writeBatch(db);
      selectedBooks.forEach((id) => {
        const bookRef = doc(db, "books", id);
        batch.delete(bookRef);
      });
      await batch.commit();
      setSelectedBooks(new Set());
      toast({
        title: language === "en" ? "Success" : "نجاح",
        description: language === "en"
          ? `Successfully deleted ${selectedBooks.size} books`
          : `تم حذف ${selectedBooks.size} كتب بنجاح`,
      });
    } catch (error) {
      console.error("Error in bulk delete:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to delete books" : "فشل في حذف الكتب",
        variant: "destructive",
      });
    }
  };

  const handleOpenAddDialog = useCallback(() => {
    setDialogAction("add");
    setFormData({
      title: "",
      author: "",
      price: "",
      coverImage: "",
      rating: "",
      originalPrice: "",
      categoryId: "",
      description: "",
      publishDate: "",
      isbn: "",
      language: "",
      pageCount: "",
      inStock: "",
    });
    setImagePreview("");
    setSelectedBook(null);
    setIsDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((book: Book) => {
    setDialogAction("edit");
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      price: book.price.toString(),
      coverImage: book.coverImage,
      rating: book.rating?.toString() || "",
      originalPrice: book.originalPrice?.toString() || "",
      categoryId: book.categoryId?.toString() || "",
      description: book.description || "",
      publishDate: book.publishDate || "",
      isbn: book.isbn || "",
      language: book.language || "",
      pageCount: book.pageCount?.toString() || "",
      inStock: book.inStock?.toString() || "",
    });
    setImagePreview(book.coverImage);
    setIsDialogOpen(true);
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((value: string, name: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (!formData.title || !formData.author || !formData.price || !formData.coverImage || !formData.categoryId) {
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" ? "Please fill in all required fields" : "يرجى ملء جميع الحقول المطلوبة",
          variant: "destructive",
        });
        return;
      }

      const bookData: Partial<Book> = {
        title: formData.title,
        author: formData.author,
        price: parseFloat(formData.price),
        coverImage: formData.coverImage,
        categoryId: parseInt(formData.categoryId),
        description: formData.description,
        publishDate: formData.publishDate,
        isbn: formData.isbn,
        language: formData.language,
        updated_at: Timestamp.now(),
      };

      if (formData.rating) bookData.rating = parseFloat(formData.rating);
      if (formData.originalPrice) bookData.originalPrice = parseFloat(formData.originalPrice);
      if (formData.pageCount) bookData.pageCount = parseInt(formData.pageCount);
      if (formData.inStock) bookData.inStock = parseInt(formData.inStock);

      try {
        if (dialogAction === "add") {
          bookData.created_at = Timestamp.now();
          await addDoc(collection(db, "books"), bookData);
          toast({
            title: language === "en" ? "Success" : "نجاح",
            description: language === "en" ? "Book added successfully" : "تمت إضافة الكتاب بنجاح",
          });
        } else {
          if (!selectedBook) return;
          const bookRef = doc(db, "books", selectedBook.id);
          await updateDoc(bookRef, bookData);
          toast({
            title: language === "en" ? "Success" : "نجاح",
            description: language === "en" ? "Book updated successfully" : "تم تحديث الكتاب بنجاح",
          });
        }
        setIsDialogOpen(false); // إغلاق النافذة
      } catch (error) {
        console.error("Error saving book:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" ? "Failed to save book." : "فشل حفظ الكتاب.",
          variant: "destructive",
        });
      }
    },
    [dialogAction, formData, selectedBook, language, toast]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        const bookRef = doc(db, "books", id);
        await deleteDoc(bookRef);
        toast({
          title: language === "en" ? "Success" : "نجاح",
          description: language === "en" ? "Book deleted successfully" : "تم حذف الكتاب بنجاح",
        });
      } catch (error) {
        console.error("Error deleting book:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" ? "Failed to delete book." : "فشل حذف الكتاب.",
          variant: "destructive",
        });
      }
    },
    [language, toast]
  );

  const getCategoryName = useCallback((categoryId?: number) => {
    if (!categoryId) return "-";
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : "-";
  }, [categories]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPrice =
        (!priceRange.min || book.price >= parseFloat(priceRange.min)) &&
        (!priceRange.max || book.price <= parseFloat(priceRange.max));

      const matchesRating =
        !ratingFilter ||
        (book.rating && book.rating >= parseFloat(ratingFilter));

      return matchesSearch && matchesPrice && matchesRating;
    });
  }, [books, searchTerm, priceRange, ratingFilter]);

  // إعادة التركيز بعد إغلاق الـ Dialog
  const restoreFocus = () => {
    if (firstFocusableElement.current) {
      firstFocusableElement.current.focus();
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center flex-col md:flex-row gap-4">
        <h1 className="text-3xl font-bold text-foreground">
          {language === "en" ? "Manage Books" : "إدارة الكتب"}
        </h1>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={language === "en" ? "Search books..." : "ابحث عن كتب..."}
              onChange={(e) => debouncedSetSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <Button onClick={() => setIsFilterDialogOpen(true)} variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {language === "en" ? "Filters" : "التصفية"}
          </Button>
          <Select value={categoryFilter || "all"} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={language === "en" ? "Filter by Category" : "تصفية حسب الفئة"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {language === "en" ? "All Categories" : "جميع الفئات"}
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button ref={firstFocusableElement} onClick={handleOpenAddDialog}>
            <BookPlus className="h-5 w-5 mr-2" />
            {language === "en" ? "Add New Book" : "إضافة كتاب جديد"}
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {selectedBooks.size > 0 && (
            <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4 mr-2" />
              {language === "en" ? `Delete Selected (${selectedBooks.size})` : `حذف المحدد (${selectedBooks.size})`}
            </Button>
          )}
        </div>
        <Button variant="outline" onClick={handleExportToExcel}>
          <Download className="h-4 w-4 mr-2" />
          {language === "en" ? "Export to Excel" : "تصدير إلى Excel"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center text-muted-foreground">
          {language === "en" ? "Loading..." : "جاري التحميل..."}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center text-muted-foreground">
          {language === "en" ? "No books available." : "لا توجد كتب متاحة."}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]">
                  <Checkbox
                    checked={selectedBooks.size === filteredBooks.length}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedBooks(new Set(filteredBooks.map((book) => book.id)));
                      } else {
                        setSelectedBooks(new Set());
                      }
                    }}
                  />
                </TableHead>
                <TableHead className="w-[80px]">
                  {language === "en" ? "Cover" : "الغلاف"}
                </TableHead>
                <TableHead>
                  {language === "en" ? "Title" : "العنوان"}
                </TableHead>
                <TableHead>
                  {language === "en" ? "Author" : "المؤلف"}
                </TableHead>
                <TableHead>
                  {language === "en" ? "Category" : "الفئة"}
                </TableHead>
                <TableHead>
                  {language === "en" ? "Price" : "السعر"}
                </TableHead>
                <TableHead>
                  {language === "en" ? "Rating" : "التقييم"}
                </TableHead>
                <TableHead className="text-right">
                  {language === "en" ? "Actions" : "الإجراءات"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedBooks.has(book.id)}
                      onCheckedChange={(checked) => {
                        const newSelected = new Set(selectedBooks);
                        if (checked) {
                          newSelected.add(book.id);
                        } else {
                          newSelected.delete(book.id);
                        }
                        setSelectedBooks(newSelected);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-12 w-9 object-cover rounded"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300";
                      }}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{getCategoryName(book.categoryId)}</TableCell>
                  <TableCell>
                    ${book.price.toFixed(2)}
                    {book.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through ms-2">
                        ${book.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{book.rating?.toFixed(1) || "-"}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {language === "en" ? "Actions" : "الإجراءات"}
                        </DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleOpenEditDialog(book)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {language === "en" ? "Edit" : "تعديل"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {language === "en" ? "Delete" : "حذف"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog 
        open={isDialogOpen} 
        onOpenChange={(open) => {
          if (!open) {
            setIsDialogOpen(false);
            restoreFocus(); // إعادة التركيز لأول عنصر تفاعلي
            setFormData({
              title: "",
              author: "",
              price: "",
              coverImage: "",
              rating: "",
              originalPrice: "",
              categoryId: "",
              description: "",
              publishDate: "",
              isbn: "",
              language: "",
              pageCount: "",
              inStock: "",
            });
            setImagePreview("");
            setSelectedBook(null);
            setDialogAction("add");
          } else {
            setIsDialogOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogAction === "add"
                ? language === "en"
                  ? "Add New Book"
                  : "إضافة كتاب جديد"
                : language === "en"
                ? "Edit Book"
                : "تعديل الكتاب"}
            </DialogTitle>
            <DialogDescription>
              {language === "en"
                ? "Fill in the details for the book."
                : "قم بملء تفاصيل الكتاب."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">
                  {language === "en" ? "Title" : "العنوان"} *
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder={language === "en" ? "Enter title" : "أدخل العنوان"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author">
                  {language === "en" ? "Author" : "المؤلف"} *
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  required
                  placeholder={language === "en" ? "Enter author" : "أدخل المؤلف"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="categoryId">
                  {language === "en" ? "Category" : "الفئة"} *
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleSelectChange(value, "categoryId")}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        language === "en" ? "Select a category" : "اختر فئة"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">
                  {language === "en" ? "Description" : "الوصف"}
                </Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    language === "en"
                      ? "Enter description"
                      : "أدخل وصف الكتاب"
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">
                    {language === "en" ? "Price" : "السعر"} *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    placeholder="0.00"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="originalPrice">
                    {language === "en" ? "Original Price" : "السعر الأصلي"}
                  </Label>
                  <Input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="rating">
                    {language === "en" ? "Rating (0-5)" : "التقييم (0-5)"}
                  </Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="0.0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="inStock">
                    {language === "en" ? "In Stock" : "المخزون"}
                  </Label>
                  <Input
                    id="inStock"
                    name="inStock"
                    type="number"
                    min="0"
                    value={formData.inStock}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="isbn">ISBN</Label>
                <Input
                  id="isbn"
                  name="isbn"
                  value={formData.isbn}
                  onChange={handleChange}
                  placeholder="ISBN"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="language">
                  {language === "en" ? "Language" : "اللغة"}
                </Label>
                <Input
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Book language" : "لغة الكتاب"}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="publishDate">
                  {language === "en" ? "Publish Date" : "تاريخ النشر"}
                </Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label>
                  {language === "en" ? "Cover Image" : "صورة الغلاف"} *
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="text"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleChange}
                    placeholder={language === "en" ? "Image URL" : "رابط الصورة"}
                    required
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {language === "en" ? "Upload" : "رفع"}
                  </Button>
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-24 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/300";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                {dialogAction === "add"
                  ? language === "en"
                    ? "Add Book"
                    : "إضافة الكتاب"
                  : language === "en"
                  ? "Save Changes"
                  : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {language === "en" ? "Are you sure?" : "هل أنت متأكد؟"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {language === "en"
                ? `This action will delete ${selectedBooks.size} selected books. This action cannot be undone.`
                : `سيؤدي هذا الإجراء إلى حذف ${selectedBooks.size} كتب محددة. لا يمكن التراجع عن هذا الإجراء.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {language === "en" ? "Cancel" : "إلغاء"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete}>
              {language === "en" ? "Delete" : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {language === "en" ? "Advanced Filters" : "التصفية المتقدمة"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label>
                {language === "en" ? "Price Range" : "نطاق السعر"}
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder={language === "en" ? "Min Price" : "السعر الأدنى"}
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, min: e.target.value }))
                  }
                />
                <Input
                  type="number"
                  placeholder={language === "en" ? "Max Price" : "السعر الأقصى"}
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange((prev) => ({ ...prev, max: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>
                {language === "en" ? "Minimum Rating" : "الحد الأدنى للتقييم"}
              </Label>
              <Select value={ratingFilter} onValueChange={setRatingFilter}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      language === "en" ? "Select rating" : "اختر التقييم"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {language === "en" ? "Any Rating" : "أي تقييم"}
                  </SelectItem>
                  <SelectItem value="4">
                    {language === "en" ? "4+ Stars" : "4+ نجوم"}
                  </SelectItem>
                  <SelectItem value="3">
                    {language === "en" ? "3+ Stars" : "3+ نجوم"}
                  </SelectItem>
                  <SelectItem value="2">
                    {language === "en" ? "2+ Stars" : "2+ نجوم"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{language === "en" ? "Sort By" : "ترتيب حسب"}</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      language === "en" ? "Select sort field" : "اختر حقل الترتيب"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">
                    {language === "en" ? "Date Added" : "تاريخ الإضافة"}
                  </SelectItem>
                  <SelectItem value="price">
                    {language === "en" ? "Price" : "السعر"}
                  </SelectItem>
                  <SelectItem value="rating">
                    {language === "en" ? "Rating" : "التقييم"}
                  </SelectItem>
                  <SelectItem value="title">
                    {language === "en" ? "Title" : "العنوان"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>{language === "en" ? "Sort Order" : "اتجاه الترتيب"}</Label>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      language === "en" ? "Select sort order" : "اختر اتجاه الترتيب"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">
                    {language === "en" ? "Ascending" : "تصاعدي"}
                  </SelectItem>
                  <SelectItem value="desc">
                    {language === "en" ? "Descending" : "تنازلي"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsFilterDialogOpen(false);
                setBooks([]);
              }}
            >
              {language === "en" ? "Apply Filters" : "تطبيق التصفية"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooksPage;