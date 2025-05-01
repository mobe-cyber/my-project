
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Star, ShoppingCart, Download, BookOpen } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { useToast } from "@/hooks/use-toast";

// Mockup for a single book details
const mockBookEn = {
  id: 1,
  title: "The Art of Programming",
  author: "John Doe",
  coverImage: "https://picsum.photos/seed/book1/600/900",
  price: 19.99,
  rating: 4.5,
  pages: 320,
  format: "PDF & ePub",
  category: "Programming",
  description: "A comprehensive guide to the art and science of programming. This book covers fundamental concepts, best practices, and advanced techniques for aspiring developers. Perfect for beginners and intermediate programmers looking to enhance their skills.",
  longDescription: "Dive deep into the world of programming with this comprehensive guide. Starting with the basics of logic and algorithms, this book takes you through a journey of software development concepts, design patterns, and best practices used by professionals around the world. Learn how to write clean, maintainable code that scales well and performs efficiently. With practical examples and exercises in multiple programming languages, you'll gain hands-on experience that will accelerate your learning and prepare you for real-world challenges in the software industry.",
  publishDate: "2023-05-15",
  language: "English",
  isbn: "978-1-234567-89-0"
};

const mockBookAr = {
  id: 1,
  title: "فن البرمجة",
  author: "جون دو",
  coverImage: "https://picsum.photos/seed/book1/600/900",
  price: 19.99,
  rating: 4.5,
  pages: 320,
  format: "PDF و ePub",
  category: "البرمجة",
  description: "دليل شامل لفن وعلم البرمجة. يغطي هذا الكتاب المفاهيم الأساسية وأفضل الممارسات والتقنيات المتقدمة للمطورين الطموحين. مثالي للمبتدئين والمبرمجين المتوسطين الراغبين في تعزيز مهاراتهم.",
  longDescription: "انغمس في عالم البرمجة مع هذا الدليل الشامل. بدءًا من أساسيات المنطق والخوارزميات، يأخذك هذا الكتاب في رحلة عبر مفاهيم تطوير البرمجيات، وأنماط التصميم، وأفضل الممارسات المستخدمة من قبل المحترفين في جميع أنحاء العالم. تعلم كيفية كتابة كود نظيف وقابل للصيانة يتوسع بشكل جيد ويعمل بكفاءة. مع أمثلة عملية وتمارين بلغات برمجة متعددة، ستكتسب خبرة عملية ستسرع من تعلمك وتعدك لمواجهة التحديات في عالم صناعة البرمجيات.",
  publishDate: "2023-05-15",
  language: "الإنجليزية",
  isbn: "978-1-234567-89-0"
};

// Mock reviews
const mockReviewsEn = [
  { id: 1, username: "Alice", rating: 5, comment: "Excellent book! Very informative and easy to follow.", date: "2023-06-10" },
  { id: 2, username: "Bob", rating: 4, comment: "Great content but could use more examples.", date: "2023-06-20" },
  { id: 3, username: "Carol", rating: 5, comment: "This changed my perspective on programming fundamentals.", date: "2023-07-05" },
];

const mockReviewsAr = [
  { id: 1, username: "أليس", rating: 5, comment: "كتاب ممتاز! مفيد جدًا وسهل المتابعة.", date: "2023-06-10" },
  { id: 2, username: "بوب", rating: 4, comment: "محتوى رائع لكن يمكن أن يستخدم المزيد من الأمثلة.", date: "2023-06-20" },
  { id: 3, username: "كارول", rating: 5, comment: "لقد غيّر وجهة نظري حول أساسيات البرمجة.", date: "2023-07-05" },
];

const BookDetails = () => {
  const { id } = useParams();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const { toast } = useToast();
  const [book, setBook] = useState(language === 'en' ? mockBookEn : mockBookAr);
  const [reviews, setReviews] = useState(language === 'en' ? mockReviewsEn : mockReviewsAr);
  const [isInCart, setIsInCart] = useState(false);
  
  // In a real application, you would fetch the book details by ID
  useEffect(() => {
    // Simulate fetching book data
    console.log(`Fetching book with ID: ${id}`);
    
    // Update book and reviews based on language
    setBook(language === 'en' ? mockBookEn : mockBookAr);
    setReviews(language === 'en' ? mockReviewsEn : mockReviewsAr);
  }, [id, language]);

  const handleAddToCart = () => {
    setIsInCart(true);
    toast({
      title: language === 'en' ? "Added to cart" : "تمت الإضافة إلى السلة",
      description: language === 'en' ? "The book has been added to your cart" : "تم إضافة الكتاب إلى سلة التسوق الخاصة بك",
    });
  };

  const handleBuyNow = () => {
    // In a real app, this would redirect to checkout
    toast({
      title: language === 'en' ? "Proceeding to checkout" : "جارٍ الانتقال إلى الدفع",
      description: language === 'en' ? "Redirecting to payment page" : "جارٍ التحويل إلى صفحة الدفع",
    });
  };

  const formatRating = (rating: number) => {
    return (
      <div className="flex items-center">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <span className="ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 text-yellow-500 fill-yellow-500" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-yellow-500">
          <path fill="#eab308" d="M12 1.5V12L5.17 21.34C4.96 21.72 4.25 21.53 4.25 21.09L4.26 19.5L1.44 16.5C1.09 16.13 1.31 15.5 1.82 15.5H4.25V12.5C4.25 12.09 4.09 11.72 3.81 11.44L1.56 9.2C1.12 8.76 1.44 8 2.05 8H5.57C6.03 8 6.42 7.64 6.47 7.18L6.75 4.68C6.81 4.12 7.66 4.12 7.72 4.68L8 7.18C8.05 7.64 8.45 8 8.9 8H12.5V1.5C12.5 0.672 11.83 0 11 0H1.5C0.672 0 0 0.672 0 1.5V10.5C0 11.33 0.672 12 1.5 12H11C11.83 12 12.5 11.33 12.5 10.5V1.5Z"/>
          <path fill="none" stroke="#eab308" d="M12 17.8L5.8 21.4c-.4.3-.9-.1-.8-.5l1.1-6.3-4.6-4.5c-.3-.3-.1-.9.3-.9l6.3-.9 2.8-5.7c.2-.4.8-.4 1 0l2.8 5.7 6.3.9c.4.1.6.6.3.9l-4.6 4.5 1.1 6.3c.1.4-.4.8-.8.5L12 17.8z"/>
        </svg>
      );
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-star-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Book Cover Image */}
          <div className="lg:w-1/3">
            <div className="sticky top-24">
              <div className="relative pb-[150%] overflow-hidden rounded-lg shadow-lg border border-border">
                <img 
                  src={book.coverImage} 
                  alt={book.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Book Details */}
          <div className="lg:w-2/3">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground mb-4">{book.author}</p>
              
              <div className="flex items-center mb-6 gap-4">
                <div className="flex items-center">
                  {renderStars(book.rating)}
                  <span className="ms-2 text-muted-foreground">
                    ({book.rating.toFixed(1)})
                  </span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">
                  {reviews.length} {language === 'en' ? 'reviews' : 'تقييمات'}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <span className="text-muted-foreground me-2">{t('category')}:</span>
                  <Link to={`/categories/${book.category}`} className="text-primary hover:underline">
                    {book.category}
                  </Link>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground me-2">{t('pages')}:</span>
                  <span>{book.pages}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground me-2">{t('format')}:</span>
                  <span>{book.format}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground me-2">ISBN:</span>
                  <span>{book.isbn}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-2">{t('description')}</h2>
                <p className="text-muted-foreground mb-4">{book.description}</p>
                <p className="text-muted-foreground">{book.longDescription}</p>
              </div>
              
              <div className="flex flex-col md:flex-row justify-between items-center p-6 border border-border rounded-lg bg-card mb-8">
                <div className="mb-4 md:mb-0">
                  <div className="text-sm text-muted-foreground mb-1">{t('price')}</div>
                  <div className="text-3xl font-bold">${book.price.toFixed(2)}</div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <Button onClick={handleAddToCart} className="flex items-center gap-2" variant={isInCart ? "secondary" : "outline"}>
                    <ShoppingCart className="h-5 w-5" />
                    {isInCart ? 
                      (language === 'en' ? 'Added to Cart' : 'تمت الإضافة') : 
                      t('addToCart')}
                  </Button>
                  <Button onClick={handleBuyNow} className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('buyNow')}
                  </Button>
                </div>
              </div>
              
              {/* Reviews Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4">{t('reviews')}</h2>
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map(review => (
                      <Card key={review.id}>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{review.username}</p>
                              <div className="flex items-center mt-1">
                                {renderStars(review.rating)}
                                <span className="text-xs text-muted-foreground ms-2">
                                  {review.date}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="mt-2">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {language === 'en' ? 
                      'No reviews yet. Be the first to review this book!' : 
                      'لا توجد مراجعات بعد. كن أول من يراجع هذا الكتاب!'}
                  </p>
                )}
                
                <div className="mt-6">
                  <Button variant="outline">
                    {t('writeReview')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BookDetails;
