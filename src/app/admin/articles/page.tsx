"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "../../../contexts/AuthContext";
import {getArticles} from "../../../../utils/articlesAPI";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  FileText,
  Tag,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category: string;
  date: string;
}

export default function AdminArticlesPage() {
  const {user, logout} = useAuth();
  const router = useRouter();

  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(10);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Load articles
  useEffect(() => {
    const loadArticles = async () => {
      try {
        setLoading(true);
        const articlesFromAPI = await getArticles();
        setArticles(articlesFromAPI);
        setError("");
      } catch (err: any) {
        setError("Failed to load articles. Please try again later.");
        console.error("Error loading articles:", err);
      } finally {
        setLoading(false);
      }
    };

    loadArticles();
  }, []);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter articles
  useEffect(() => {
    let filtered = articles;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        article =>
          article.title
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          article.content
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          article.author
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(
        article =>
          article.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    setFilteredArticles(filtered);
    setCurrentPage(1);
  }, [articles, debouncedSearchTerm, categoryFilter]);

  // Get unique categories
  const categories = Array.from(
    new Set(articles.map(article => article.category))
  );

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFallbackImage = (article: Article) => {
    return (
      article.imageUrl || `https://picsum.photos/60/60?random=${article.id}`
    );
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = (articleId: string) => {
    if (confirm("Are you sure you want to delete this article?")) {
      setArticles(prev => prev.filter(article => article.id !== articleId));
    }
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
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Articles</h1>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">
                {user?.username || "James Dean"}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Stats */}
          <div className="mb-6">
            <p className="text-gray-600">
              Total Articles: <strong>{filteredArticles.length}</strong>
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 text-gray-900 px-4 py-2.5 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]"
                >
                  <option value="all">Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by title"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Add Article Button */}
              <button
                onClick={() => router.push("/admin/articles/create")}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add Articles</span>
              </button>
            </div>
          </div>

          {/* Articles Table */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4, 5].map(n => (
                  <div key={n} className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : currentArticles.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No articles found
              </h3>
              <p className="text-gray-500 mb-6">
                {debouncedSearchTerm
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first article"}
              </p>
              {!debouncedSearchTerm && (
                <button
                  onClick={() => router.push("/admin/articles/create")}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Article</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Thumbnails
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Title
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Category
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Created at
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentArticles.map(article => (
                      <tr key={article.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <img
                            src={getFallbackImage(article)}
                            alt={article.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900 max-w-xs truncate">
                            {article.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            By {article.author}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {article.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600">
                            {formatDate(article.date)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                router.push(`/articles/${article.id}`)
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Preview
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/articles/${article.id}/edit`
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Edit
                            </button>
                            <span className="text-gray-300">|</span>
                            <button
                              onClick={() => handleDelete(article.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </button>

              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <span className="px-2 text-gray-500">...</span>

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="flex items-center px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
