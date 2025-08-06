"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useAuth} from "../../../../contexts/AuthContext";
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  FileText,
  Tag,
  LogOut,
  User,
} from "lucide-react";

const articleSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  category: z.string().min(1, "Please select a category"),
  image: z.string().optional().or(z.literal("")),
  tags: z.string().optional(),
});

type ArticleSchema = z.infer<typeof articleSchema>;

// Mock categories
const mockCategories = [
  {id: "1", name: "Technology"},
  {id: "2", name: "Design"},
  {id: "3", name: "Business"},
  {id: "4", name: "Development"},
  {id: "5", name: "Marketing"},
];

export default function CreateArticlePage() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // States untuk upload gambar
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors},
  } = useForm<ArticleSchema>({
    resolver: zodResolver(articleSchema),
  });

  // Watch all form data for preview
  const formData = watch();

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // Function untuk handle upload gambar
  const handleImageUpload = async (file: File) => {
    setUploadLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "https://test-fe.mysellerpintar.com/api/upload",
        {
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type header, let the browser set it for FormData
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Assume the API returns { url: "uploaded-image-url" }
      const imageUrl = result.url || result.data?.url || result.file_url;

      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        setValue("image", imageUrl);
        setError("");
      } else {
        throw new Error("No image URL returned from server");
      }
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
      console.error("Upload error:", err);
    } finally {
      setUploadLoading(false);
    }
  };

  // Function untuk handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
        return;
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);
      handleImageUpload(file);
    }
  };

  const generatePreview = async () => {
    try {
      setLoading(true);

      // Simulate API call for preview generation
      await new Promise(resolve => setTimeout(resolve, 1000));

      const preview = {
        ...formData,
        id: "preview",
        createdAt: new Date().toISOString(),
        author: user?.username || "Admin",
        category:
          mockCategories.find(cat => cat.id === formData.category)?.name ||
          "Unknown",
        readTime:
          Math.max(1, Math.ceil(formData.content?.length / 1000)) + " min read",
      };

      setPreviewData(preview);
      setShowPreview(true);
    } catch (err) {
      setError("Failed to generate preview");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ArticleSchema) => {
    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/articles");
      }, 2000);
    } catch (err: any) {
      setError("Failed to create article. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (user && user.role !== "Admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">◉</span>
            </div>
            <span className="text-lg font-semibold">Logoipsum</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <div className="space-y-2">
            <button
              onClick={() => router.push("/admin/articles")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-blue-700 rounded-lg font-medium"
            >
              <FileText className="w-5 h-5" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => router.push("/admin/categories")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-700 rounded-lg transition-colors"
            >
              <Tag className="w-5 h-5" />
              <span>Category</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-700 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {!showPreview ? (
          // Form View
          <div className="flex-1 p-6">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 mb-6 rounded-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => router.push("/admin/articles")}
                    className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Articles</span>
                  </button>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Create Article
                  </h1>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-600">
                    {user?.username || "Admin"}
                  </span>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    {...register("title")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter article title"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register("category")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select a category</option>
                    {mockCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Excerpt *
                  </label>
                  <textarea
                    {...register("excerpt")}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the article"
                  />
                  {errors.excerpt && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.excerpt.message}
                    </p>
                  )}
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    {...register("content")}
                    rows={12}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Write your article content here..."
                  />
                  {errors.content && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.content.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image
                  </label>

                  {/* File Upload Input */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="block w-full text-sm text-gray-500
                                   file:mr-4 file:py-2 file:px-4
                                   file:rounded-lg file:border-0
                                   file:text-sm file:font-medium
                                   file:bg-blue-50 file:text-blue-700
                                   hover:file:bg-blue-100
                                   file:cursor-pointer cursor-pointer"
                        disabled={uploadLoading}
                      />
                      {uploadLoading && (
                        <div className="flex items-center space-x-2 text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Uploading...</span>
                        </div>
                      )}
                    </div>

                    {/* Preview uploaded image */}
                    {uploadedImageUrl && (
                      <div className="space-y-2">
                        <p className="text-sm text-green-600">
                          ✅ Image uploaded successfully!
                        </p>
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                          <img
                            src={uploadedImageUrl}
                            alt="Uploaded preview"
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                          <p className="text-xs text-gray-600 break-all">
                            {uploadedImageUrl}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Manual URL input as fallback */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-600 mb-1">
                        Or enter image URL manually
                      </label>
                      <input
                        type="text"
                        {...register("image")}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="https://example.com/image.jpg"
                        value={uploadedImageUrl}
                        onChange={e => {
                          setUploadedImageUrl(e.target.value);
                          setValue("image", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {errors.image && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.image.message}
                    </p>
                  )}

                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image file (max 5MB) or enter a URL manually.
                    Supported formats: JPEG, PNG, GIF, WebP.
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    {...register("tags")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter tags separated by commas"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                    Article created successfully! Redirecting...
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={generatePreview}
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={loading || !formData.title || !formData.content}
                  >
                    <Eye className="w-4 h-4" />
                    <span>{loading ? "Generating..." : "Preview"}</span>
                  </button>

                  <div className="flex items-center space-x-4">
                    <button
                      type="button"
                      onClick={() => router.push("/admin/articles")}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={loading || success}
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {loading ? "Publishing..." : "Publish Article"}
                      </span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          // Preview View
          <div className="flex-1">
            {/* Preview Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Article Preview
                </h1>
                <button
                  onClick={() => setShowPreview(false)}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <EyeOff className="w-4 h-4" />
                  <span>Back to Edit</span>
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div className="p-6">
              <article className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Featured Image */}
                {previewData?.image && (
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={previewData.image}
                      alt={previewData.title}
                      className="w-full h-full object-cover"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                )}

                <div className="p-8">
                  {/* Article Meta */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      {previewData?.category}
                    </span>
                    <span>{formatDate(previewData?.createdAt)}</span>
                    <span>By {previewData?.author}</span>
                    <span>{previewData?.readTime}</span>
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    {previewData?.title}
                  </h1>

                  {/* Excerpt */}
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {previewData?.excerpt}
                  </p>

                  {/* Content */}
                  <div className="prose prose-lg max-w-none">
                    {previewData?.content
                      ?.split("\n")
                      .map((paragraph: string, index: number) => (
                        <p
                          key={index}
                          className="mb-4 text-gray-800 leading-relaxed"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>

                  {/* Tags */}
                  {previewData?.tags && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <div className="flex flex-wrap gap-2">
                        {previewData.tags
                          .split(",")
                          .map((tag: string, index: number) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                            >
                              #{tag.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
