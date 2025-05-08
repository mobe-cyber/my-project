import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db, auth, storage } from "@/lib/firebase";
import { ref, getBlob } from "firebase/storage";
import { useTheme } from "@/context/ThemeContext";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";

// تعيين Worker لـ react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  categoryId: number;
  filePath: string;
  isbn?: string;
  ratingCount?: number;
  [key: string]: any;
}

const ReadPage = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const { language } = useTheme();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [fileBlob, setFileBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showBook, setShowBook] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user || !bookId) {
      console.log("No user or bookId:", { user, bookId });
      setError(
        language === "en"
          ? "Please sign in and select a book."
          : "يرجى تسجيل الدخول واختيار كتاب."
      );
      setIsLoading(false);
      navigate(user ? `/book/${bookId}` : "/login");
      return;
    }

    const checkPurchaseAndFetchBook = async () => {
      try {
        console.log("Checking purchase for user:", user.uid, "and book:", bookId);
        const purchasesRef = collection(db, "purchases");
        const q = query(purchasesRef, where("userId", "==", user.uid), where("bookId", "==", bookId));
        const querySnapshot = await getDocs(q);
        const purchaseExists = !querySnapshot.empty;
        console.log("Purchase exists:", purchaseExists);

        setHasPurchased(purchaseExists);

        if (!purchaseExists) {
          console.log("No purchase found, redirecting to book page");
          setError(
            language === "en"
              ? "You need to purchase this book to read it."
              : "تحتاج إلى شراء هذا الكتاب لقراءته."
          );
          navigate(`/book/${bookId}`);
          return;
        }

        const bookRef = doc(db, "books", bookId);
        const bookSnap = await getDoc(bookRef);
        if (bookSnap.exists()) {
          const bookData = { id: bookSnap.id, ...bookSnap.data() } as Book;
          console.log("Book data fetched:", bookData);
          setBook(bookData);

          if (bookData.filePath) {
            console.log("Fetching file from path:", bookData.filePath);
            const storageRef = ref(storage, bookData.filePath);
            const blob = await getBlob(storageRef);
            console.log("File blob fetched successfully, size:", blob.size);
            setFileBlob(blob);
          } else {
            console.log("No filePath found in book data");
            setError(
              language === "en"
                ? "No file path specified for this book. Please contact support."
                : "لا يوجد مسار ملف لهذا الكتاب. يرجى التواصل مع الدعم."
            );
          }
        } else {
          console.log("Book document does not exist");
          setError(
            language === "en"
              ? "Book not found. Please check the book ID."
              : "الكتاب غير موجود. يرجى التحقق من معرف الكتاب."
          );
        }
      } catch (error) {
        console.error("Error in checkPurchaseAndFetchBook:", error);
        if ((error as any).code === "storage/object-not-found") {
          setError(
            language === "en"
              ? "The book file is missing in storage. Please contact support with the file path: " +
                (book?.filePath || "unknown")
              : "ملف الكتاب مفقود في التخزين. يرجى التواصل مع الدعم مع مسار الملف: " +
                (book?.filePath || "غير معروف")
          );
        } else {
          setError(
            language === "en"
              ? "Failed to load the book. Please try again later. (Error: " +
                (error as Error).message +
                ")"
              : "فشل في تحميل الكتاب. حاول مرة أخرى لاحقًا. (الخطأ: " +
                (error as Error).message +
                ")"
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkPurchaseAndFetchBook();
  }, [bookId, user, navigate, language]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log("Document loaded with", numPages, "pages");
    setNumPages(numPages);
  };

  const handleReadClick = () => {
    if (fileBlob) {
      console.log("Read button clicked, showing the book");
      setShowBook(true);
    } else {
      console.log("File not loaded yet, retrying...");
      setIsLoading(true);
      setError(null);
      // إعادة المحاولة
      checkPurchaseAndFetchBook();
    }
  };

  const handleDownloadClick = () => {
    if (fileBlob) {
      console.log("Download button clicked, generating download link");
      const url = window.URL.createObjectURL(fileBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${book?.title || "book"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } else {
      console.log("No fileBlob available for download");
      setError(
        language === "en"
          ? "Cannot download the book. Please try again or contact support."
          : "لا يمكن تحميل الكتاب. حاول مرة أخرى أو تواصل مع الدعم."
      );
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{language === "en" ? "Please sign in to read the book." : "يرجى تسجيل الدخول لقراءة الكتاب."}</p>
        <Button onClick={() => navigate("/login")} className="mt-4">
          {language === "en" ? "Sign In" : "تسجيل الدخول"}
        </Button>
      </div>
    );
  }

  if (!hasPurchased) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{language === "en" ? "You need to purchase this book to read it." : "تحتاج إلى شراء هذا الكتاب لقراءته."}</p>
        <Button onClick={() => navigate(`/book/${bookId}`)} className="mt-4">
          {language === "en" ? "Go to Book" : "الذهاب إلى الكتاب"}
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>{language === "en" ? "Loading..." : "جاري التحميل..."}</p>
      </div>
    );
  }

  if (!book || error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p className="text-red-500">{error || (language === "en" ? "Book not found." : "الكتاب غير موجود.")}</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          {language === "en" ? "Back to Home" : "العودة للرئيسية"}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">{book.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">{book.author}</p>
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-full lg:w-1/3">
            <img
              src={book.coverImage || "https://via.placeholder.com/300"}
              alt={book.title}
              className="w-full h-auto rounded-lg shadow-md"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/300";
              }}
            />
          </div>
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {language === "en" ? "ISBN" : "الـ ISBN"}: {book.isbn || "N/A"}
              </p>
              <p className="text-yellow-500 mb-2 flex items-center">
                {language === "en" ? "Rating" : "التقييم"}: {book.rating || 0} <span className="ml-2">★</span> ({book.ratingCount || 0})
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-xl font-semibold mb-4">
                {language === "en" ? "Price" : "السعر"}: ${book.price || 0}
              </p>
              <Button
                onClick={handleReadClick}
                className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 mb-4"
              >
                {language === "en" ? "Read" : "قراءة"}
              </Button>
              <Button
                onClick={handleDownloadClick}
                className="w-full bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white py-3 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
              >
                {language === "en" ? "Download" : "تحميل"}
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-red-500 text-center p-3 bg-red-50 dark:bg-red-900/30 rounded-lg">
            {error}
          </div>
        )}

        {showBook && fileBlob && (
          <div className="mt-8 w-full h-[70vh] overflow-auto border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg bg-white dark:bg-gray-900">
            <Document
              file={fileBlob}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => {
                console.error("PDF load error:", error);
                setError(
                  language === "en"
                    ? "Failed to load the PDF file. (Error: " + (error as Error).message + ")"
                    : "فشل في تحميل ملف PDF. (الخطأ: " + (error as Error).message + ")"
                );
              }}
              className="p-4"
            >
              {Array.from(new Array(numPages || 0), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={window.innerWidth > 768 ? 600 : 300}
                  className="mb-4 border-b border-gray-200 dark:border-gray-700"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              ))}
            </Document>
          </div>
        )}

        {numPages && showBook && (
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-center">
            {language === "en" ? `Total Pages: ${numPages}` : `عدد الصفحات: ${numPages}`}
          </p>
        )}
      </div>
    </div>
  );
};

export default ReadPage;

function checkPurchaseAndFetchBook() {
  throw new Error("Function not implemented.");
}
