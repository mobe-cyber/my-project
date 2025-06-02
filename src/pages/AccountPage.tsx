import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import {
  LogOut,
  BookOpen,
  Download,
  Trash2,
  Edit,
  Palette,
  Globe,
  Bell,
  Lock,
  Trophy,
  Clock,
  BarChart,
  Heart,
  Star,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, getDocs, updateDoc, setDoc } from "firebase/firestore";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// تعريف الأنواع
interface Profile {
  displayName: string;
  email: string;
  photoURL: string;
  createdAt?: string;
}

interface Book {
  id: string;
  title: string;
  url: string;
  status?: string;
  favorite?: boolean;
  date?: string;
  deleted?: boolean;
}

interface ReadingProgress {
  id: string;
  title: string;
  url: string;
  progress: number;
  pagesRead: number;
  pagesTotal: number;
  pagesLeft: number;
  lastRead?: string;
}

interface Achievement {
  id: string;
  name: string;
  badge: string;
  description: string;
  progress: number;
  target: number;
}

interface Stats {
  totalReadingTime: number;
  booksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  monthlyBooks: number;
  monthlyPages: number;
  monthlyTime: number;
  monthlyGrowth: number;
  lastLogin: string;
  activeSessions: number;
  dailyGoal: number;
}

// مكون فرعي لعرض ملف المستخدم
const ProfileSection = ({
  profile,
  user,
  handleUpdateProfile,
  handleChangePassword,
  t,
  theme,
}: {
  profile: Profile;
  user: any;
  handleUpdateProfile: () => void;
  handleChangePassword: () => void;
  t: (key: string) => string;
  theme: string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl p-6 mb-10 border-t-4 border-primary overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader className="text-center">
      <Avatar className="w-40 h-40 mx-auto mb-6 border-4 border-white dark:border-border shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-xl">
        <AvatarImage src={profile.photoURL || undefined} alt={profile.displayName || "User"} />
        <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
          {profile.displayName?.[0] || "U"}
        </AvatarFallback>
      </Avatar>
      <CardTitle className="text-4xl font-extrabold tracking-tight">{profile.displayName || user.displayName || "User"}</CardTitle>
      <p className="text-xl text-muted-foreground mt-2">{profile.email || user.email || "No email"}</p>
    </CardHeader>
    <CardContent className="text-center space-y-6">
      <div className="flex justify-center gap-4">
        <Button
          onClick={handleUpdateProfile}
          variant="outline"
          className="bg-white text-primary hover:bg-primary/10 dark:bg-card dark:text-primary dark:hover:bg-primary/20 px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg btn-secondary"
        >
          <Edit className="w-6 h-6 mr-2" />
          {t("updateProfile")}
        </Button>
        <Button
          onClick={handleChangePassword}
          variant="outline"
          className="bg-white text-destructive hover:bg-destructive/10 dark:bg-card dark:text-destructive dark:hover:bg-destructive/20 px-6 py-3 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg btn-secondary"
        >
          <Lock className="w-6 h-6 mr-2" />
          {t("changePassword")}
        </Button>
      </div>
    </CardContent>
  </Card>
);

// مكون فرعي لعرض إحصائيات القراءة
const ReadingStatsSection = ({
  stats,
  customGoal,
  handleSetCustomGoal,
  t,
  theme,
}: {
  stats: Stats;
  customGoal: number;
  handleSetCustomGoal: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (key: string) => string;
  theme: string;
}) => {
  const progressPercentage = useMemo(
    () => (stats.currentStreak || 0) / (customGoal || 30) * 100,
    [stats.currentStreak, customGoal]
  );

  const monthlyData = useMemo(
    () => ({
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [
        {
          label: t("pagesRead"),
          data: [200, 300, 250, 400, stats.monthlyPages || 0],
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.5)",
          tension: 0.4,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "#fff",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: "rgb(59, 130, 246)",
        },
      ],
    }),
    [stats.monthlyPages, t]
  );

  return (
    <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-accent overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 dark:from-accent/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
      <CardHeader>
        <CardTitle className="text-3xl font-semibold flex items-center">
          <BarChart className="w-7 h-7 mr-3 text-accent" />
          {t("readingStats")}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md">
          <p className="text-md text-muted-foreground">{t("totalTime")}</p>
          <p className="text-2xl font-bold">{Math.floor((stats.totalReadingTime || 0) / 60)}h {((stats.totalReadingTime || 0) % 60)}m</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md">
          <p className="text-md text-muted-foreground">{t("booksCompleted")}</p>
          <p className="text-2xl font-bold">{stats.booksCompleted || 0}</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md">
          <p className="text-md text-muted-foreground">{t("currentStreak")}</p>
          <p className="text-2xl font-bold">{stats.currentStreak || 0} {t("days")}</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md">
          <p className="text-md text-muted-foreground">{t("longestStreak")}</p>
          <p className="text-2xl font-bold">{stats.longestStreak || 0} {t("days")}</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md">
          <p className="text-md text-muted-foreground">{t("dailyGoal")}</p>
          <div className="flex items-center justify-center gap-2">
            <input
              type="number"
              value={customGoal}
              onChange={handleSetCustomGoal}
              className="w-20 p-2 border rounded-lg text-foreground bg-card text-center border-border focus:ring-2 focus:ring-accent dark:focus:ring-accent-foreground transition-all duration-300"
              min="1"
            />
            <span className="text-xl">{t("minutes")}</span>
          </div>
          <Progress
            value={progressPercentage}
            className="mt-2 h-2 bg-border rounded-full [&>div]:bg-accent [&>div]:transition-all [&>div]:duration-500"
          />
          <p className="text-md text-muted-foreground mt-1">{progressPercentage.toFixed(1)}%</p>
        </div>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <Line
            data={monthlyData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: { color: theme === "dark" ? "#d1d5db" : "#374151", font: { size: 14 } },
                },
                tooltip: {
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  titleFont: { size: 14 },
                  bodyFont: { size: 12 },
                },
              },
              scales: {
                x: { ticks: { color: theme === "dark" ? "#d1d5db" : "#374151", font: { size: 12 } } },
                y: { ticks: { color: theme === "dark" ? "#d1d5db" : "#374151", font: { size: 12 } } },
              },
              animation: {
                duration: 1500,
                easing: "easeOutQuart",
              },
            }}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

// مكون فرعي لعرض تقدم القراءة
const ReadingProgressSection = ({
  readingProgress,
  handleOpenBook,
  t,
}: {
  readingProgress: ReadingProgress[];
  handleOpenBook: (url: string) => void;
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-primary overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <Clock className="w-7 h-7 mr-3 text-primary" />
        {t("readingProgress")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {readingProgress.length > 0 ? (
        <div className="space-y-6">
          {readingProgress.map((book) => (
            <div
              key={book.id}
              className="p-6 bg-muted rounded-xl shadow-md transition-all duration-300 hover:bg-muted/80 hover:shadow-lg animate-fade-in"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xl font-bold">{book.title || "Untitled"}</p>
                  <p className="text-sm text-muted-foreground">{t("lastRead")}: {book.lastRead || "N/A"}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOpenBook(book.url)}
                  className="text-primary hover:text-primary-foreground transition-colors duration-200"
                >
                  <BookOpen className="w-5 h-5 mr-1" />
                  {t("open")}
                </Button>
              </div>
              <Progress
                value={book.progress || 0}
                className="mt-4 h-2 bg-border rounded-full [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-500"
              />
              <div className="grid grid-cols-2 gap-4 mt-2 text-sm text-muted-foreground">
                <p>{t("progress")}: {book.progress || 0}%</p>
                <p>
                  {t("pages")}: {book.pagesRead || 0}/{book.pagesTotal || 0}
                </p>
                <p>{t("pagesLeft")}: {book.pagesLeft || 0}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-lg animate-fade-in">{t("noBooksInProgress")}</p>
      )}
    </CardContent>
  </Card>
);

// مكون فرعي لعرض الإنجازات
const AchievementsSection = ({
  achievements,
  t,
}: {
  achievements: Achievement[];
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-accent overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 dark:from-accent/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <Trophy className="w-7 h-7 mr-3 text-accent" />
        {t("achievements")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {achievements.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="p-6 bg-muted rounded-xl shadow-md transition-all duration-300 hover:bg-muted/80 hover:shadow-lg animate-fade-in"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-bold">
                    {achievement.name || "Achievement"} <span className="text-2xl">{achievement.badge || "🏆"}</span>
                  </p>
                  <p className="text-md text-muted-foreground">{achievement.description || "No description"}</p>
                </div>
                <Progress
                  value={(achievement.progress / achievement.target) * 100}
                  className="w-1/3 h-2 bg-border rounded-full [&>div]:bg-accent [&>div]:transition-all [&>div]:duration-500"
                />
              </div>
              <p className="text-md text-muted-foreground mt-2">
                {achievement.progress}/{achievement.target}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-center text-lg animate-fade-in">{t("noAchievements")}</p>
      )}
    </CardContent>
  </Card>
);

// مكون فرعي لعرض المكتبة الشخصية
const PersonalLibrarySection = ({
  purchasedBooks,
  handleDownloadBook,
  handleDeleteBook,
  t,
}: {
  purchasedBooks: Book[];
  handleDownloadBook: (url: string, title: string) => void;
  handleDeleteBook: (bookId: string) => void;
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-destructive overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-secondary/10 dark:from-destructive/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <Heart className="w-7 h-7 mr-3 text-destructive" />
        {t("personalLibrary")}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      <div className="p-6 bg-muted rounded-xl shadow-md transition-all duration-300 hover:bg-muted/80 hover:shadow-lg">
        <h3 className="text-xl font-bold">{t("readBooks")}</h3>
        <ul className="mt-4 space-y-3">
          {purchasedBooks.filter((book) => book.status === "Downloaded").length > 0 ? (
            purchasedBooks
              .filter((book) => book.status === "Downloaded")
              .map((book) => (
                <li
                  key={book.id}
                  className="flex justify-between items-center text-foreground py-2 border-b border-border last:border-b-0 animate-fade-in"
                >
                  <span className="truncate">{book.title || "Untitled"}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownloadBook(book.url, book.title)}
                      className="text-accent hover:text-accent-foreground transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 mr-1" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBook(book.id)}
                      className="text-destructive hover:text-destructive-foreground transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                </li>
              ))
          ) : (
            <p className="text-muted-foreground animate-fade-in">{t("noReadBooks")}</p>
          )}
        </ul>
      </div>
      <div className="p-6 bg-muted rounded-xl shadow-md transition-all duration-300 hover:bg-muted/80 hover:shadow-lg">
        <h3 className="text-xl font-bold">{t("favoriteBooks")}</h3>
        <ul className="mt-4 space-y-3">
          {purchasedBooks.filter((book) => book.favorite).length > 0 ? (
            purchasedBooks
              .filter((book) => book.favorite)
              .map((book) => (
                <li
                  key={book.id}
                  className="text-foreground py-2 border-b border-border last:border-b-0 animate-fade-in"
                >
                  {book.title || "Untitled"} <Star className="inline w-5 h-5 text-accent ml-1" />
                </li>
              ))
          ) : (
            <p className="text-muted-foreground animate-fade-in">{t("noFavoriteBooks")}</p>
          )}
        </ul>
      </div>
      <div className="p-6 bg-muted rounded-xl shadow-md transition-all duration-300 hover:bg-muted/80 hover:shadow-lg">
        <h3 className="text-xl font-bold">{t("recentlyCompleted")}</h3>
        <ul className="mt-4 space-y-3">
          {purchasedBooks.filter((book) => book.status === "Downloaded" && book.date).length > 0 ? (
            purchasedBooks
              .filter((book) => book.status === "Downloaded" && book.date)
              .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
              .slice(0, 2)
              .map((book) => (
                <li
                  key={book.id}
                  className="text-foreground py-2 border-b border-border last:border-b-0 animate-fade-in"
                >
                  {book.title || "Untitled"}
                </li>
              ))
          ) : (
            <p className="text-muted-foreground animate-fade-in">{t("noRecentlyCompleted")}</p>
          )}
        </ul>
      </div>
    </CardContent>
  </Card>
);

// مكون فرعي لعرض التقارير الشهرية
const MonthlyReportsSection = ({
  stats,
  t,
}: {
  stats: Stats;
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-accent overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 dark:from-accent/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <BarChart className="w-7 h-7 mr-3 text-accent" />
        {t("monthlyReports")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md animate-fade-in">
          <p className="text-md text-muted-foreground">{t("booksRead")}</p>
          <p className="text-2xl font-bold">{stats.monthlyBooks || 0}</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md animate-fade-in">
          <p className="text-md text-muted-foreground">{t("pagesRead")}</p>
          <p className="text-2xl font-bold">{stats.monthlyPages || 0}</p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md animate-fade-in">
          <p className="text-md text-muted-foreground">{t("totalTime")}</p>
          <p className="text-2xl font-bold">
            {Math.floor((stats.monthlyTime || 0) / 60)}h {((stats.monthlyTime || 0) % 60)}m
          </p>
        </div>
        <div className="p-6 bg-muted rounded-xl text-center shadow-sm transition-all duration-300 hover:bg-muted/80 hover:shadow-md animate-fade-in">
          <p className="text-md text-muted-foreground">{t("vsLastMonth")}</p>
          <p className="text-2xl font-bold">
            {(stats.monthlyGrowth || 0) >= 0 ? "+" : ""}
            {(stats.monthlyGrowth || 0).toFixed(1)}%
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

// مكون فرعي لعرض الإعدادات
const SettingsSection = ({
  language,
  theme,
  notificationsEnabled,
  handleLanguageChange,
  toggleTheme,
  handleToggleNotifications,
  t,
}: {
  language: string;
  theme: string;
  notificationsEnabled: boolean;
  handleLanguageChange: (value: string) => void;
  toggleTheme: () => void;
  handleToggleNotifications: (checked: boolean) => void;
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-accent overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-secondary/10 dark:from-accent/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <Globe className="w-7 h-7 mr-3 text-accent" />
        {t("settings")}
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Globe className="w-7 h-7 text-accent" />
          <div>
            <p className="text-lg font-medium">{t("language")}</p>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-56 mt-2 bg-card border-border p-2 rounded-lg text-foreground focus:ring-2 focus:ring-accent dark:focus:ring-accent-foreground transition-all duration-300">
                <SelectValue placeholder={t("selectLanguage")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="ar">العربية</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Palette className="w-7 h-7 text-accent" />
          <div>
            <p className="text-lg font-medium">{t("theme")}</p>
            <Button
              variant="outline"
              onClick={toggleTheme}
              className="mt-2 w-56 bg-card border-border p-2 rounded-lg text-foreground hover:bg-muted dark:hover:bg-muted/80 transition-all duration-300"
            >
              {t(theme === "light" ? "switchToDark" : "switchToLight")}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Bell className="w-7 h-7 text-accent" />
          <div>
            <p className="text-lg font-medium">{t("notifications")}</p>
            <div className="flex items-center space-x-4 mt-2">
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={handleToggleNotifications}
                className="data-[state=checked]:bg-accent dark:data-[state=checked]:bg-accent-foreground"
              />
              <Label className="text-md text-muted-foreground">
                {t(notificationsEnabled ? "enabled" : "disabled")}
              </Label>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// مكون فرعي لعرض الأمان والخصوصية
const SecurityPrivacySection = ({
  stats,
  t,
}: {
  stats: Stats;
  t: (key: string) => string;
}) => (
  <Card className="relative bg-card text-card-foreground rounded-2xl mb-10 border-t-4 border-destructive overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
    <div className="absolute inset-0 bg-gradient-to-r from-destructive/10 to-secondary/10 dark:from-destructive/20 dark:to-secondary/20 rounded-2xl -z-10 animate-gradient-shift" />
    <CardHeader>
      <CardTitle className="text-3xl font-semibold flex items-center">
        <Lock className="w-7 h-7 mr-3 text-destructive" />
        {t("securityPrivacy")}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-lg text-muted-foreground">{t("lastLogin")}: {stats.lastLogin || "N/A"}</p>
      <p className="text-lg text-muted-foreground mt-2">{t("activeSessions")}: {stats.activeSessions || 0}</p>
    </CardContent>
  </Card>
);

// المكون الرئيسي
const AccountPage = () => {
  const { user, logout, loading } = useAuth();
  const { language, theme, toggleTheme, changeLanguage } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({ displayName: "", email: "", photoURL: "" });
  const [purchasedBooks, setPurchasedBooks] = useState<Book[]>([]);
  const [readingProgress, setReadingProgress] = useState<ReadingProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalReadingTime: 0,
    booksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    monthlyBooks: 0,
    monthlyPages: 0,
    monthlyTime: 0,
    monthlyGrowth: 0,
    lastLogin: "",
    activeSessions: 0,
    dailyGoal: 30,
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [customGoal, setCustomGoal] = useState(30);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || loading) return;

      if (!isOnline) {
        toast({
          title: t("error"),
          description: t("noInternet"),
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
          const defaultProfile: Profile = {
            displayName: user.displayName || "User",
            email: user.email || "",
            photoURL: user.photoURL || "",
            createdAt: new Date().toISOString(),
          };
          await setDoc(userRef, defaultProfile);
          setProfile(defaultProfile);
        } else {
          setProfile(userDoc.data() as Profile);
        }

        const booksRef = collection(db, `users/${user.uid}/books`);
        const booksSnapshot = await getDocs(booksRef);
        const books = booksSnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Book))
          .filter((book) => !book.deleted);
        setPurchasedBooks(books);

        const progressRef = collection(db, `users/${user.uid}/readingProgress`);
        const progressSnapshot = await getDocs(progressRef);
        const progress = progressSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as ReadingProgress));
        setReadingProgress(progress);

        const achievementsRef = collection(db, `users/${user.uid}/achievements`);
        const achievementsSnapshot = await getDocs(achievementsRef);
        const achievementsData = achievementsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Achievement));
        setAchievements(achievementsData);

        const statsRef = doc(db, `users/${user.uid}/stats`, "default");
        const statsDoc = await getDoc(statsRef);
        if (!statsDoc.exists()) {
          const defaultStats: Stats = {
            totalReadingTime: 0,
            booksCompleted: 0,
            currentStreak: 0,
            longestStreak: 0,
            monthlyBooks: 0,
            monthlyPages: 0,
            monthlyTime: 0,
            monthlyGrowth: 0,
            lastLogin: new Date().toISOString(),
            activeSessions: 1,
            dailyGoal: 30,
          };
          await setDoc(statsRef, defaultStats);
          setStats(defaultStats);
        } else {
          const fetchedStats = statsDoc.data() as Stats;
          setStats(fetchedStats);
          setCustomGoal(fetchedStats.dailyGoal || 30);
        }
      } catch (error: unknown) {
        toast({
          title: t("error"),
          description: t("fetchDataError"),
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
      }
    };
    fetchData();
  }, [user, loading, language, isOnline, t]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      toast({
        title: t("loggedOut"),
        description: t("loggedOutSuccess"),
        className: "bg-accent text-accent-foreground border-none shadow-lg",
      });
      navigate("/");
    } catch (error: unknown) {
      toast({
        title: t("error"),
        description: (error as Error).message,
        variant: "destructive",
        className: "bg-destructive text-destructive-foreground border-none shadow-lg",
      });
    }
  }, [logout, navigate, t]);

  const handleUpdateProfile = useCallback(() => {
    navigate("/edit-profile");
    toast({
      title: t("redirecting"),
      description: t("updatingProfile"),
      className: "bg-primary text-primary-foreground border-none shadow-lg",
    });
  }, [navigate, t]);

  const handleChangePassword = useCallback(() => {
    navigate("/change-password");
    toast({
      title: t("redirecting"),
      description: t("changingPassword"),
      className: "bg-primary text-primary-foreground border-none shadow-lg",
    });
  }, [navigate, t]);

  const handleToggleNotifications = useCallback(
    (checked: boolean) => {
      setNotificationsEnabled(checked);
      toast({
        title: t("notificationsUpdated"),
        description: t("notificationsStatus").replace(
          "{status}",
          checked ? t("enabled") : t("disabled")
        ),
        className: `bg-${checked ? "accent" : "secondary"} text-${checked ? "accent-foreground" : "secondary-foreground"} border-none shadow-lg`,
      });
    },
    [t]
  );

  const handleLanguageChange = useCallback(
    (value: string) => {
      changeLanguage(value as "en" | "ar");
      toast({
        title: t("languageUpdated"),
        description: t("languageUpdatedSuccess"),
        className: "bg-accent text-accent-foreground border-none shadow-lg",
      });
    },
    [changeLanguage, t]
  );

  const handleOpenBook = useCallback(
    (url: string) => {
      if (url) {
        window.open(url, "_blank");
      } else {
        toast({
          title: t("error"),
          description: t("bookUrlNotFound"),
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
      }
    },
    [t]
  );

  const handleDownloadBook = useCallback(
    (url: string, title: string) => {
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = `${title}.pdf`;
        link.click();
        toast({
          title: t("downloading"),
          description: t("bookDownloading"),
          className: "bg-accent text-accent-foreground border-none shadow-lg",
        });
      } else {
        toast({
          title: t("error"),
          description: t("bookUrlNotFound"),
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
      }
    },
    [t]
  );

  const handleDeleteBook = useCallback(
    async (bookId: string) => {
      try {
        await updateDoc(doc(db, `users/${user.uid}/books`, bookId), { deleted: true });
        setPurchasedBooks(purchasedBooks.filter((book) => book.id !== bookId));
        toast({
          title: t("bookRemoved"),
          description: t("bookRemovedSuccess"),
          className: "bg-accent text-accent-foreground border-none shadow-lg",
        });
      } catch (error: unknown) {
        toast({
          title: t("error"),
          description: (error as Error).message,
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
      }
    },
    [user, purchasedBooks, t]
  );

  const handleSetCustomGoal = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      const newGoal = value > 0 ? value : 30;
      setCustomGoal(newGoal);
      try {
        await updateDoc(doc(db, `users/${user.uid}/stats`, "default"), { dailyGoal: newGoal });
        setStats((prev) => ({ ...prev, dailyGoal: newGoal }));
        toast({
          title: t("goalUpdated"),
          description: t("goalUpdatedSuccess"),
          className: "bg-accent text-accent-foreground border-none shadow-lg",
        });
      } catch (error: unknown) {
        toast({
          title: t("error"),
          description: (error as Error).message,
          variant: "destructive",
          className: "bg-destructive text-destructive-foreground border-none shadow-lg",
        });
      }
    },
    [user, t]
  );

  const handleBackToHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background text-foreground transition-colors duration-700">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary"></div>
          <p className="text-lg font-medium">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-700">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex justify-start mb-6">
          <Button
            onClick={handleBackToHome}
            variant="outline"
            className="bg-card text-foreground hover:bg-muted dark:hover:bg-muted/80 px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            {t("backToHome")}
          </Button>
        </div>

        <ProfileSection
          profile={profile}
          user={user}
          handleUpdateProfile={handleUpdateProfile}
          handleChangePassword={handleChangePassword}
          t={t}
          theme={theme}
        />

        <ReadingStatsSection
          stats={stats}
          customGoal={customGoal}
          handleSetCustomGoal={handleSetCustomGoal}
          t={t}
          theme={theme}
        />

        <ReadingProgressSection
          readingProgress={readingProgress}
          handleOpenBook={handleOpenBook}
          t={t}
        />

        <AchievementsSection achievements={achievements} t={t} />

        <PersonalLibrarySection
          purchasedBooks={purchasedBooks}
          handleDownloadBook={handleDownloadBook}
          handleDeleteBook={handleDeleteBook}
          t={t}
        />

        <MonthlyReportsSection stats={stats} t={t} />

        <SettingsSection
          language={language}
          theme={theme}
          notificationsEnabled={notificationsEnabled}
          handleLanguageChange={handleLanguageChange}
          toggleTheme={toggleTheme}
          handleToggleNotifications={handleToggleNotifications}
          t={t}
        />

        <SecurityPrivacySection stats={stats} t={t} />

        <CardFooter className="p-6">
          <Button
            onClick={handleLogout}
            className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all duration-500 transform hover:scale-105 rounded-lg shadow-lg"
          >
            <LogOut className="w-7 h-7 mr-3 animate-pulse" />
            {t("logout")}
          </Button>
        </CardFooter>
      </div>
    </div>
  );
};

export default AccountPage;