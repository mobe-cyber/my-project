import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, BookOpen } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";
import { doc, getDoc, addDoc, collection, getDocs, query, where, deleteDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price: number;
  rating: number;
  category: string;
  pages: number;
  format: string;
  isbn: string;
  description: string;
  longDescription: string;
  reviews?: Array<{
    id: string;
    username: string;
    photoURL: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Book["reviews"]>([]);
  const [isInCart, setIsInCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editRating, setEditRating] = useState<number>(0);
  const [editComment, setEditComment] = useState<string>("");
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(5); // عدد التقييمات المرئية في البداية
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "books", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const bookData = { id: docSnap.id, ...docSnap.data() } as Book;
          setBook(bookData);

          const reviewsRef = collection(db, "books", id, "reviews");
          const reviewsSnap = await getDocs(reviewsRef);
          const reviewsData = reviewsSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Book["reviews"];
          setReviews(reviewsData || []);
        } else {
          toast({
            title: language === "en" ? "Book not found" : "الكتاب غير موجود",
            description: language === "en" ? "This book does not exist in the database." : "هذا الكتاب غير موجود في قاعدة البيانات.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error("Error fetching book:", error);
        toast({
          title: language === "en" ? "Error" : "خطأ",
          description: language === "en" ? "Failed to fetch book details. Please try again later." : "فشل في جلب تفاصيل الكتاب. حاول مرة أخرى لاحقًا.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const checkCart = async () => {
      if (!user || !id) return;
      try {
        const cartRef = collection(db, "carts");
        const q = query(cartRef, where("userId", "==", user.uid), where("bookId", "==", id));
        const querySnapshot = await getDocs(q);
        setIsInCart(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking cart:", error);
      }
    };

    fetchBook();
    checkCart();
  }, [id, language, toast, user]);

  useEffect(() => {
    if (!user || !id) return;

    const checkPurchase = async () => {
      const purchasesRef = collection(db, "purchases");
      const q = query(purchasesRef, where("userId", "==", user.uid), where("bookId", "==", id));
      const querySnapshot = await getDocs(q);
      setHasPurchased(!querySnapshot.empty);
    };

    checkPurchase();
  }, [user, id]);

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please sign in to add the book to your cart." : "يرجى تسجيل الدخول لإضافة الكتاب إلى السلة.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      // تحقق إذا كان الكتاب موجود بالفعل في السلة
      const cartRef = collection(db, "carts");
      const q = query(cartRef, where("userId", "==", user.uid), where("bookId", "==", id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // الكتاب موجود بالفعل في السلة
        toast({
          title: language === "en" ? "Already in cart" : "موجود بالفعل في السلة",
          description: language === "en" ? "This book is already in your cart." : "هذا الكتاب موجود بالفعل في سلة التسوق الخاصة بك.",
        });
        setIsInCart(true);
        return;
      }

      // إضافة الكتاب إلى السلة في Firestore
      await addDoc(collection(db, "carts"), {
        userId: user.uid,
        bookId: book!.id,
        title: book!.title,
        author: book!.author,
        coverImage: book!.coverImage,
        price: book!.price,
        quantity: 1,
        addedAt: new Date().toISOString(),
      });

      setIsInCart(true);
      toast({
        title: language === "en" ? "Added to cart" : "تمت الإضافة إلى السلة",
        description: language === "en" ? "The book has been added to your cart" : "تم إضافة الكتاب إلى سلة التسوق الخاصة بك",
      });
    } catch (error) {
      console.error("Error adding book to cart:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to add book to cart." : "فشل في إضافة الكتاب إلى السلة.",
        variant: "destructive",
      });
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please sign in to purchase the book." : "يرجى تسجيل الدخول لشراء الكتاب.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    toast({
      title: language === "en" ? "Proceeding to checkout" : "جارٍ الانتقال إلى الدفع",
      description: language === "en" ? "Redirecting to payment page" : "جارٍ التحويل إلى صفحة الدفع",
    });

    navigate("/checkout", { state: { book: { id: book!.id, title: book!.title, price: book!.price } } });
  };

  const handleRead = () => {
    navigate(`/read/${id}`);
  };

  const handleWriteReview = () => {
    if (!user) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please sign in to write a review." : "يرجى تسجيل الدخول لكتابة تقييم.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setShowReviewForm(true);
  };

  const handleSubmitReview = async () => {
    if (!user || !id) return;

    if (newRating < 1 || newRating > 5) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please select a rating between 1 and 5." : "يرجى اختيار تقييم بين 1 و 5.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please write a comment." : "يرجى كتابة تعليق.",
        variant: "destructive",
      });
      return;
    }

    try {
      const newReview = {
        username: user.displayName || "Anonymous",
        photoURL: user.photoURL || "https://via.placeholder.com/40",
        rating: newRating,
        date: new Date().toISOString().split("T")[0],
        comment: newComment,
      };

      const reviewRef = await addDoc(collection(db, "books", id, "reviews"), newReview);
      const reviewWithId = { id: reviewRef.id, ...newReview };

      setReviews((prevReviews) => [...(prevReviews || []), reviewWithId]);
      setVisibleReviewsCount((prevCount) => prevCount + 1);

      setNewRating(0);
      setNewComment("");
      setShowReviewForm(false);

      toast({
        title: language === "en" ? "Review Added" : "تم إضافة التقييم",
        description: language === "en" ? "Your review has been successfully added." : "تم إضافة تقييمك بنجاح.",
      });
    } catch (error) {
      console.error("Error adding review:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to add review." : "فشل في إضافة التقييم.",
        variant: "destructive",
      });
    }
  };

  const handleEditReview = (review: Book["reviews"][0]) => {
    setEditingReviewId(review.id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  const handleUpdateReview = async (reviewId: string) => {
    if (!user || !id) return;

    if (editRating < 1 || editRating > 5) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please select a rating between 1 and 5." : "يرجى اختيار تقييم بين 1 و 5.",
        variant: "destructive",
      });
      return;
    }

    if (!editComment.trim()) {
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Please write a comment." : "يرجى كتابة تعليق.",
        variant: "destructive",
      });
      return;
    }

    try {
      const reviewRef = doc(db, "books", id, "reviews", reviewId);
      await updateDoc(reviewRef, {
        rating: editRating,
        comment: editComment,
        date: new Date().toISOString().split("T")[0],
      });

      setReviews((prevReviews) =>
        prevReviews?.map((rev) =>
          rev.id === reviewId ? { ...rev, rating: editRating, comment: editComment, date: new Date().toISOString().split("T")[0] } : rev
        )
      );

      setEditingReviewId(null);
      setEditRating(0);
      setEditComment("");

      toast({
        title: language === "en" ? "Review Updated" : "تم تحديث التقييم",
        description: language === "en" ? "Your review has been successfully updated." : "تم تحديث تقييمك بنجاح.",
      });
    } catch (error) {
      console.error("Error updating review:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to update review." : "فشل في تحديث التقييم.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!user || !id) return;

    try {
      const reviewRef = doc(db, "books", id, "reviews", reviewId);
      await deleteDoc(reviewRef);

      setReviews((prevReviews) => prevReviews?.filter((rev) => rev.id !== reviewId));
      setVisibleReviewsCount((prevCount) => Math.min(prevCount, reviews.length - 1));

      toast({
        title: language === "en" ? "Review Deleted" : "تم حذف التقييم",
        description: language === "en" ? "Your review has been successfully deleted." : "تم حذف تقييمك بنجاح.",
      });
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: language === "en" ? "Error" : "خطأ",
        description: language === "en" ? "Failed to delete review." : "فشل في حذف التقييم.",
        variant: "destructive",
      });
    }
  };

  const handleShowMoreReviews = () => {
    setVisibleReviewsCount((prevCount) => prevCount + 5);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 text-yellow-500 fill-yellow-500" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half-star" className="h-4 w-4 text-yellow-500" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return <div className="flex">{stars}</div>;
  };

  const renderRatingInput = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={`rating-star-${i}`}
          className={`h-6 w-6 cursor-pointer ${newRating >= i ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
          onClick={() => setNewRating(i)}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (loading) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground text-xl">
          {language === "en" ? "Loading book details..." : "جاري تحميل تفاصيل الكتاب..."}
        </div>
      </Layout>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="relative pb-[150%] overflow-hidden rounded-lg shadow-lg border border-border">
                <img src={book.coverImage} alt={book.title} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
          </div>

          <div className="lg:w-2/3">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground mb-4">{book.author}</p>

            <div className="flex items-center mb-6 gap-4">
              <div className="flex items-center">
                {renderStars(book.rating)}
                <span className="ms-2 text-muted-foreground">({book.rating.toFixed(1)})</span>
              </div>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">
                {reviews.length} {language === "en" ? "reviews" : "تقييمات"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-muted-foreground me-2">{t("category")}:</span>
                <Link to={`/categories/${book.category}`} className="text-primary hover:underline">
                  {book.category}
                </Link>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground me-2">{t("pages")}:</span>
                <span>{book.pages}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground me-2">{t("format")}:</span>
                <span>{book.format}</span>
              </div>
              <div className="flex items-center">
                <span className="text-muted-foreground me-2">ISBN:</span>
                <span>{book.isbn}</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">{t("description")}</h2>
              <p className="text-muted-foreground mb-4">{book.description}</p>
              <p className="text-muted-foreground">{book.longDescription}</p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center p-6 border border-border rounded-lg bg-card mb-8">
              <div className="mb-4 md:mb-0">
                <div className="text-sm text-muted-foreground mb-1">{t("price")}</div>
                <div className="text-3xl font-bold">${book.price.toFixed(2)}</div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button onClick={handleAddToCart} className="flex items-center gap-2" variant={isInCart ? "secondary" : "outline"}>
                  <ShoppingCart className="h-5 w-5" />
                  {isInCart ? (language === "en" ? "Added to Cart" : "تمت الإضافة") : t("addToCart")}
                </Button>
                {hasPurchased ? (
                  <Button onClick={handleRead} className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {language === "en" ? "Read" : "قراءة"}
                  </Button>
                ) : (
                  <Button onClick={handleBuyNow} className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t("buyNow")}
                  </Button>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">{t("reviews")}</h2>
              {reviews.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {reviews.slice(0, visibleReviewsCount).map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4 mb-2">
                            <img
                              src={review.photoURL || "https://via.placeholder.com/40"}
                              alt={`${review.username}'s profile`}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold">{review.username}</p>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="text-xs text-muted-foreground ms-2">{review.date}</span>
                              </div>
                            </div>
                          </div>
                          {user && user.displayName === review.username && (
                            <div className="flex gap-2 mt-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditReview(review)}>
                                {language === "en" ? "Edit" : "تعديل"}
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteReview(review.id)}>
                                {language === "en" ? "Delete" : "حذف"}
                              </Button>
                            </div>
                          )}
                          {editingReviewId === review.id ? (
                            <div className="mt-4">
                              <div className="mb-4">
                                <label className="block text-sm text-muted-foreground mb-1">
                                  {language === "en" ? "Edit Your Rating" : "تعديل تقييمك"}
                                </label>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={`edit-star-${i}`}
                                      className={`h-6 w-6 cursor-pointer ${editRating >= i + 1 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                                      onClick={() => setEditRating(i + 1)}
                                    />
                                  ))}
                                </div>
                              </div>
                              <div className="mb-4">
                                <label className="block text-sm text-muted-foreground mb-1">
                                  {language === "en" ? "Edit Your Comment" : "تعديل تعليقك"}
                                </label>
                                <textarea
                                  value={editComment}
                                  onChange={(e) => setEditComment(e.target.value)}
                                  className="w-full p-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                                  rows={4}
                                  placeholder={language === "en" ? "Edit your review here..." : "عدّل تقييمك هنا..."}
                                />
                              </div>
                              <div className="flex gap-2">
                                <Button onClick={() => handleUpdateReview(review.id)}>
                                  {language === "en" ? "Update Review" : "تحديث التقييم"}
                                </Button>
                                <Button variant="outline" onClick={() => setEditingReviewId(null)}>
                                  {language === "en" ? "Cancel" : "إلغاء"}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="mt-2">{review.comment}</p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {visibleReviewsCount < reviews.length && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" onClick={handleShowMoreReviews}>
                        {language === "en" ? "Show More" : "عرض المزيد"}
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">
                  {language === "en" ? "No reviews yet. Be the first to review this book!" : "لا توجد مراجعات بعد. كن أول من يراجع هذا الكتاب!"}
                </p>
              )}

              <div className="mt-6">
                <Button variant="outline" onClick={handleWriteReview}>
                  {t("writeReview")}
                </Button>

                {showReviewForm && (
                  <div className="mt-4 p-4 border border-border rounded-lg bg-card">
                    <h3 className="text-lg font-semibold mb-2">{t("writeReview")}</h3>
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground mb-1">
                        {language === "en" ? "Your Rating" : "تقييمك"}
                      </label>
                      {renderRatingInput()}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm text-muted-foreground mb-1">
                        {language === "en" ? "Your Comment" : "تعليقك"}
                      </label>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-2 border border-border rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                        rows={4}
                        placeholder={language === "en" ? "Write your review here..." : "اكتب تقييمك هنا..."}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSubmitReview}>
                        {language === "en" ? "Submit Review" : "إرسال التقييم"}
                      </Button>
                      <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                        {language === "en" ? "Cancel" : "إلغاء"}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;