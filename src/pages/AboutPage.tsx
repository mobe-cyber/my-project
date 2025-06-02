import React from "react";
import Navbar from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Globe, Mail, Smartphone, Wallet, Leaf, Book, Shield, Briefcase, Landmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";

const AboutPage = () => {
  const { language } = useTheme();

  const content = {
    ar: {
      headerTitle: "عن موبي ستور",
      headerDescription: "نحن منصة رقمية رائدة لبيع وقراءة الكتب العربية. نسعى لنشر المعرفة وتسهيل الوصول للمحتوى العربي الرقمي عالي الجودة.",
      storyTitle: "قصتنا",
      storyDesc1: "في 'موبي ستور'، لم نبدأ كمجرد متجر كتب رقمية، بل كمبادرة لتغيير الطريقة التي نصل بها إلى المعرفة.",
      storyDesc2: "رأينا أن الوصول إلى الكتب، سواء كانت بالعربية أو بالإنجليزية، الأدبية منها أو التعليمية، يجب أن يكون سهلًا، سلسًا، ومتاحًا للجميع.",
      storyDesc3: "جئنا بفكرة واضحة: أن نخلق مساحة رقمية تجمع القراء بالمعرفة، أينما كانوا، ومهما كانت اهتماماتهم.",
      storyDesc4: "لهذا بنينا مكتبة رقمية متنوّعة، تضم كتبًا تغذّي الفكر، تطوّر المهارات، وتفتح آفاقًا جديدة. نعمل مع مؤلفين وناشرين متميزين لنقدّم محتوى حقيقي يضيف قيمة، ويليق بعقل القارئ الحديث.",
      storyDesc5: "'موبي ستور' ليس مجرد منصة. إنه تجربة قراءة متكاملة، تجمع بين التقنية، الشغف، والثقافة.",
      visionTitle: "رؤيتنا",
      visionDesc: "أن نصبح المنصة الرائدة في تقديم المحتوى العربي الرقمي، ونساهم في بناء مجتمع قارئ متنور من خلال توفير المعرفة بطرق ميسرة وفعالة.",
      missionTitle: "رسالتنا",
      missionDesc: "نسعى لتمكين القراء من الوصول إلى المحتوى العربي الرقمي عالي الجودة بسهولة ويسر، ودعم المؤلفين والناشرين في نشر أعمالهم.",
      benefitsTitle: "فوائد القراءة الرقمية",
      benefits: [
        { title: "وصول فوري", desc: "احصل على كتبك المفضلة فوراً بعد الشراء.", icon: Smartphone },
        { title: "سهولة الحمل", desc: "احمل آلاف الكتب في جهازك دون عناء.", icon: Book },
        { title: "تكلفة منخفضة", desc: "استمتع بأسعار تنافسية مقارنة بالكتب الورقية.", icon: Wallet },
        { title: "صديق للبيئة", desc: "ساهم في حماية البيئة بتقليل استخدام الورق.", icon: Leaf },
      ],
      categoriesTitle: "أفضل فئات الكتب لدينا",
      categories: [
        { title: "الخيال", path: "/categories/1", icon: BookOpen },
        { title: "البرمجة والأمن السيبراني", path: "/categories/2", icon: Shield },
        { title: "الأعمال", path: "/categories/3", icon: Briefcase },
        { title: "التاريخ", path: "/categories/6", icon: Landmark },
      ],
      contactTitle: "تواصل معنا",
      contactDesc: "نحن دائماً سعداء بالتواصل مع قرائنا وشركائنا. إذا كان لديك أي استفسار، لا تتردد في التواصل معنا.",
      emailLabel: "البريد الإلكتروني",
      email: "mobe.store0@gmail.com",
      sendMessage: "إرسال رسالة",
      browseLibrary: "تصفح الكتب",
      contactUs: "تواصل معنا",
      yearsOfLeadership: "نصنع محتوى رقمي يُحدث فرقًا",
    },
    en: {
      headerTitle: "About MobeStore",
      headerDescription: "We are a leading digital platform for selling and reading Arabic eBooks. We aim to spread knowledge and facilitate access to high-quality Arabic digital content.",
      storyTitle: "Our Story",
      storyDesc1: "At MobeStore, we didn’t start as just a digital bookstore, but as an initiative to change how we access knowledge.",
      storyDesc2: "We saw that access to books—whether Arabic or English, literary or educational—should be easy, seamless, and available to all.",
      storyDesc3: "We came with a clear vision: to create a digital space that connects readers with knowledge, wherever they are, and whatever their interests.",
      storyDesc4: "That’s why we built a diverse digital library, featuring books that nourish the mind, develop skills, and open new horizons. We collaborate with distinguished authors and publishers to offer authentic content that adds value and suits the modern reader’s intellect.",
      storyDesc5: "MobeStore is not just a platform; it’s a complete reading experience that blends technology, passion, and culture.",
      visionTitle: "Our Vision",
      visionDesc: "To become the leading platform for delivering Arabic digital content, contributing to building an enlightened reading community by providing knowledge in accessible and effective ways.",
      missionTitle: "Our Mission",
      missionDesc: "We strive to empower readers with easy access to high-quality Arabic digital content and support authors and publishers in distributing their works.",
      benefitsTitle: "Benefits of Digital Reading",
      benefits: [
        { title: "Instant Access", desc: "Get your favorite books immediately after purchase.", icon: Smartphone },
        { title: "Easy to Carry", desc: "Carry thousands of books on your device effortlessly.", icon: Book },
        { title: "Cost-Effective", desc: "Enjoy competitive prices compared to physical books.", icon: Wallet },
        { title: "Eco-Friendly", desc: "Contribute to environmental protection by reducing paper usage.", icon: Leaf },
      ],
      categoriesTitle: "Our Top Book Categories",
      categories: [
        { title: "Fiction", path: "/categories/1", icon: BookOpen },
        { title: "Programming & Cybersecurity", path: "/categories/2", icon: Shield },
        { title: "Business", path: "/categories/3", icon: Briefcase },
        { title: "History", path: "/categories/6", icon: Landmark },
      ],
      contactTitle: "Contact Us",
      contactDesc: "We are always happy to connect with our readers and partners. If you have any inquiries, feel free to reach out.",
      emailLabel: "Email",
      email: "mobe.store0@gmail.com",
      sendMessage: "Send Message",
      browseLibrary: "Browse the books",
      contactUs: "Contact Us",
      yearsOfLeadership: "We Create Digital Content That Makes a Difference",
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* قسم الترويسة */}
        <div className="bg-gradient-to-r from-brand-blue to-brand-lightBlue text-white py-20">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 text-white">{t.headerTitle}</h1>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed text-white/90">{t.headerDescription}</p>
          </div>
        </div>

        {/* قسم القصة */}
        <section className="py-16 container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.storyTitle}</h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.storyDesc1}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.storyDesc2}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.storyDesc3}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{t.storyDesc4}</p>
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{t.storyDesc5}</p>
              <div className="flex gap-4">
                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-white" asChild>
                  <Link to="/categories">{t.browseLibrary}</Link>
                </Button>
                <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue/10 dark:text-gray-100 dark:border-gray-600" asChild>
                  <Link to="/contact">{t.contactUs}</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/mobestore-e1db5.firebasestorage.app/o/siteimg%2F737c6e4f-fce3-41b3-b520-e20499872f91.png?alt=media&token=2f5eabe7-8ebe-4c04-a06b-1f09961e9076"
                alt="مكتبة رقمية"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-brand-cream dark:bg-gray-700 p-6 rounded-lg shadow-md">
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{t.yearsOfLeadership}</p>
              </div>
            </div>
          </div>
        </section>

        {/* قسم الرؤية والرسالة */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
                <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
                  <Target className="h-8 w-8 text-brand-blue dark:text-blue-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t.visionTitle}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.visionDesc}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-sm">
                <div className="inline-block p-3 bg-green-100 dark:bg-green-900 rounded-lg mb-4">
                  <BookOpen className="h-8 w-8 text-green-600 dark:text-green-200" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">{t.missionTitle}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{t.missionDesc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* قسم فوائد القراءة الرقمية */}
        <section className="py-16 container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">{t.benefitsTitle}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {t.benefits.map((benefit, index) => (
              <div key={index} className="text-center p-6 bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full mb-4">
                  <benefit.icon className="h-8 w-8 text-brand-blue dark:text-blue-200" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">{benefit.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* قسم أفضل فئات الكتب */}
        <section className="bg-gray-50 dark:bg-gray-800 py-16">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">{t.categoriesTitle}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {t.categories.map((category, index) => (
                <Link
                  key={index}
                  to={category.path}
                  className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6 text-center transition-transform hover:scale-105"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full mb-4">
                    <category.icon className="h-8 w-8 text-brand-blue dark:text-blue-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* قسم التواصل */}
        <section className="py-16 container mx-auto">
          <div className="bg-brand-cream dark:bg-gray-700 p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">{t.contactTitle}</h2>
                <p className="text-gray-700 dark:text-gray-300 mb-8">{t.contactDesc}</p>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="h-6 w-6 text-brand-blue dark:text-blue-200 ml-3 mt-1" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{t.emailLabel}</p>
                      <a href={`mailto:${t.email}`} className="text-brand-blue dark:text-blue-200 hover:underline">
                        {t.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <Button className="bg-brand-blue hover:bg-brand-blue/90 text-lg py-6 px-8 text-white" asChild>
                  <Link to="/contact">
                    <Mail className="ml-2 h-5 w-5" />
                    {t.sendMessage}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;