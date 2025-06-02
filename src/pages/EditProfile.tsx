import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/translations";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { Camera, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

// Define validation schema using Zod
const formSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters" }).max(50),
  photo: z.instanceof(File).optional().refine((file) => !file || file.size <= 5 * 1024 * 1024, {
    message: "Photo must be less than 5MB",
  }),
});

type FormData = z.infer<typeof formSchema>;

const EditProfile = () => {
  const { user, loading } = useAuth();
  const { language } = useTheme();
  const { t } = useTranslation(language);
  const navigate = useNavigate();
  const [isUploading, setIsUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState<string | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { displayName: "", photo: undefined },
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    } else if (user) {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setValue("displayName", data.displayName || user.displayName || "");
            setPhotoURL(data.photoURL || user.photoURL || null);
            setPreviewURL(data.photoURL || user.photoURL || null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast({
            title: t("error") || "Error",
            description: t("fetchUserDataError") || "Failed to load profile data.",
            variant: "destructive",
          });
        }
      };
      fetchUserData();
    }
  }, [user, loading, navigate, setValue, t]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      if (!user) {
        throw new Error(t("userNotAuthenticated") || "User not authenticated");
      }

      let newPhotoURL = photoURL;

      // Handle photo upload if a new file is provided
      if (data.photo) {
        const file = data.photo;
        const storageRef = ref(storage, `profile-photos/${user.uid}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => {
              setUploadProgress(0);
              reject(error);
            },
            async () => {
              newPhotoURL = await getDownloadURL(uploadTask.snapshot.ref);
              setUploadProgress(100);
              resolve(null);
            }
          );
        });
      }

      // Update Firebase Auth profile
      await updateProfile(user, { displayName: data.displayName, photoURL: newPhotoURL || undefined });

      // Update Firestore document
      await updateDoc(doc(db, "users", user.uid), {
        displayName: data.displayName,
        photoURL: newPhotoURL || photoURL,
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: t("profileUpdated") || "Profile Updated",
        description: t("profileUpdatedSuccess") || "Your profile has been updated successfully.",
      });
      navigate("/account");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: t("error") || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue("photo", file);
      const url = URL.createObjectURL(file);
      setPreviewURL(url);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewURL(null);
    setPhotoURL(null);
    setValue("photo", undefined);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            {t("loading") || "Loading..."}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-700">
      <div className="max-w-md mx-auto">
        <Card className="relative bg-white dark:bg-gray-800 shadow-2xl rounded-3xl p-8 hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2 border-t-4 border-blue-500 dark:border-indigo-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-indigo-500/20 dark:to-blue-500/20 rounded-3xl -z-10 animate-pulse-slow" />
          <CardHeader className="text-center">
            <div className="relative">
              <Avatar className="w-32 h-32 mx-auto mb-6 border-4 border-white dark:border-gray-700 shadow-lg transition-transform duration-300 hover:scale-105">
                <AvatarImage src={previewURL || photoURL || undefined} alt={user.displayName || "User"} />
                <AvatarFallback className="bg-blue-500 text-white text-2xl font-bold">
                  {user.displayName?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="photo"
                className="absolute bottom-4 right-14 p-2 bg-blue-500 dark:bg-indigo-600 text-white rounded-full cursor-pointer hover:bg-blue-600 dark:hover:bg-indigo-700 transition-colors duration-300 shadow-md"
              >
                <Camera className="h-5 w-5" />
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {previewURL && (
                <button
                  onClick={handleRemovePhoto}
                  className="absolute bottom-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-300 shadow-md"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <CardTitle className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              {t("editProfile") || "Edit Profile"}
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t("updateYourInfo") || "Update your personal information"}
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="displayName" className="text-gray-900 dark:text-white font-medium">
                  {t("displayName") || "Display Name"}
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  {...register("displayName")}
                  className="mt-2 w-full bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-indigo-500 transition-all duration-300"
                  placeholder={t("enterYourName") || "Enter your name"}
                />
                {errors.displayName && (
                  <p className="text-red-500 text-sm mt-1 animate-fade-in">{errors.displayName.message}</p>
                )}
              </div>
              {isUploading && (
                <div className="mt-4">
                  <Label className="text-gray-900 dark:text-white font-medium">
                    {t("uploadProgress") || "Upload Progress"}
                  </Label>
                  <Progress 
                    value={uploadProgress}
                    className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full [&>div]:bg-blue-500 dark:[&>div]:bg-indigo-500 [&>div]:transition-all [&>div]:duration-300"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {uploadProgress.toFixed(0)}%
                  </p>
                </div>
              )}
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 transition-all duration-500 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg"
              >
                {isSubmitting || isUploading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                    <span>{t("saving") || "Saving..."}</span>
                  </div>
                ) : (
                  t("saveChanges") || "Save Changes"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/account")}
              className="w-full bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 border-gray-300 dark:border-gray-600 transition-all duration-300 rounded-lg"
            >
              {t("cancel") || "Cancel"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EditProfile;