"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {getArticles} from "../../../utils/articlesAPI";
import {useAuth} from "../../contexts/AuthContext";
import {ChevronDown, AlertTriangle} from "lucide-react";
import Header from "@/components/Header";
import SearchFilters from "@/components/SearchFilters";
import ArticleCard from "@/components/ArticleCard";
import Pagination from "@/components/Pagination";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category: string;
  date: string;
}

interface Tag {
  id: number;
  name: string;
  count: number;
}

export default function ArticlesPage() {
  const {user, logout} = useAuth();
  const router = useRouter();

  // States untuk data dan filtering
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // States untuk filtering dan searching
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // States untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [articlesPerPage] = useState(9);

  // State untuk show/hide logout button
  const [showLogout, setShowLogout] = useState(false);

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

  // Close logout when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLogout) {
        const target = event.target as HTMLElement;
        if (!target.closest("[data-user-menu]")) {
          setShowLogout(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showLogout]);

  useEffect(() => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(
        article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.author.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [articles, searchTerm, categoryFilter]);

  // Prepare data for components
  const categories = Array.from(
    new Set(articles.map(article => article.category))
  );

  const tags: Tag[] = categories.map((category, index) => ({
    id: index + 1,
    name: category,
    count: articles.filter(article => article.category === category).length,
  }));

  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handleLogout = () => {
    setShowLogout(false);
    logout();
    router.push("/login");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleTagChange = (value: string) => {
    setCategoryFilter(value || "all");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 h-80"></div>
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({length: 9}, (_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-sm border overflow-hidden"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polygon
              points="0,0 100,0 80,100 0,100"
              fill="white"
              opacity="0.1"
            />
            <polygon
              points="20,0 100,0 100,80 40,100"
              fill="white"
              opacity="0.05"
            />
          </svg>
        </div>

        {/* Background Images */}
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://test-fe.mysellerpintar.com/api/articles/background"
            alt="Background"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>

        <div className="absolute inset-0 opacity-15">
          <img
            src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=1920&h=1080&auto=format&fit=crop"
            alt="Writing Background"
            className="w-full h-full object-cover mix-blend-soft-light"
          />
        </div>

        {/* Background Decorative Elements */}
        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-3xl"></div>
          <div className="absolute top-32 right-32 w-24 h-24 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-20 w-28 h-28 bg-white rounded-full blur-2xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="absolute inset-0 opacity-3">
          <div className="absolute top-16 left-1/3 w-4 h-4 bg-white rounded-full"></div>
          <div className="absolute top-48 right-1/4 w-2 h-2 bg-white rounded-full"></div>
          <div className="absolute bottom-24 left-1/5 w-3 h-3 bg-white rounded-full"></div>
          <div className="absolute bottom-40 right-1/3 w-5 h-5 bg-white rounded-full"></div>
          <div className="absolute top-24 right-1/5 w-6 h-6 border border-white rounded-full"></div>
          <div className="absolute bottom-16 left-2/3 w-4 h-4 border border-white rounded-full"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-24">
          <Header
            user={user}
            showLogout={showLogout}
            onToggleLogout={() => setShowLogout(!showLogout)}
            onLogout={handleLogout}
          />

          <div className="text-center max-w-4xl mx-auto mb-8 md:mb-12">
            <div className="text-xs md:text-sm opacity-80 mb-3 md:mb-4 tracking-wider uppercase">
              Blog portal
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-light mb-4 md:mb-6 leading-tight px-2">
              The Journal : Design Resources,
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>Interviews, and Industry News
            </h1>
            <p className="text-base md:text-lg lg:text-xl opacity-90 mb-8 md:mb-10 font-light px-4">
              Your daily dose of design insights!
            </p>

            <div className="flex justify-center px-4">
              <div className="bg-blue-400/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-blue-300/50 w-full max-w-2xl">
                <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                  <div className="relative w-full sm:w-auto">
                    <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="appearance-none bg-white border border-gray-200 text-gray-800 px-4 py-3 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:min-w-[160px] shadow-sm text-sm"
                    >
                      <option value="all">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </div>
                  </div>

                  <SearchFilters
                    searchTerm={searchTerm}
                    selectedTag={categoryFilter === "all" ? "" : categoryFilter}
                    tags={tags}
                    onSearchChange={handleSearchChange}
                    onTagChange={handleTagChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-8">
            {error}
          </div>
        )}

        <div className="mb-8">
          <p className="text-gray-600 text-sm">
            Showing{" "}
            <strong>
              {Math.min(indexOfLastArticle, filteredArticles.length)}
            </strong>{" "}
            of <strong>{filteredArticles.length}</strong> articles
            {searchTerm && ` for "${searchTerm}"`}
            {categoryFilter !== "all" && ` in ${categoryFilter}`}
          </p>
        </div>

        {currentArticles.length === 0 ? (
          <div className="text-center py-20">
            <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No articles found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {currentArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>

      <footer className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-xs font-bold">◉</span>
            </div>
            <span className="text-lg font-semibold">Logoipsum</span>
          </div>
          <p className="text-sm opacity-80">
            © 2025 Blog portal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
