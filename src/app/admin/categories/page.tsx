"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import {useAuth} from "../../../contexts/AuthContext";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  LogOut,
  User,
  FileText,
  Tag,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

// Mock data untuk categories (karena API mungkin tidak ada endpoint untuk categories)
const mockCategories: Category[] = [
  {
    id: "1",
    name: "Technology",
    description: "Articles about technology and innovation",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    name: "Design",
    description: "UI/UX design and creative content",
    createdAt: "2024-01-14T09:15:00Z",
  },
  {
    id: "3",
    name: "Business",
    description: "Business insights and strategies",
    createdAt: "2024-01-13T14:20:00Z",
  },
  {
    id: "4",
    name: "Development",
    description: "Software development and programming",
    createdAt: "2024-01-12T11:45:00Z",
  },
  {
    id: "5",
    name: "Marketing",
    description: "Digital marketing and growth strategies",
    createdAt: "2024-01-11T16:30:00Z",
  },
];

export default function AdminCategoriesPage() {
  const {user, logout} = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [filteredCategories, setFilteredCategories] =
    useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [categoriesPerPage] = useState(10);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== "Admin") {
      router.push("/unauthorized");
    }
  }, [user, router]);

  // Debounce search term
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // Filter categories based on search
  useEffect(() => {
    let filtered = categories;

    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        category =>
          category.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (category.description &&
            category.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [categories, debouncedSearchTerm]);

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleDelete = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
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
              className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-blue-700 rounded-lg transition-colors"
            >
              <FileText className="w-5 h-5" />
              <span>Articles</span>
            </button>
            <button
              onClick={() => router.push("/admin/categories")}
              className="w-full flex items-center space-x-3 px-4 py-3 text-left bg-blue-700 rounded-lg font-medium"
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
            <h1 className="text-2xl font-semibold text-gray-900">Category</h1>
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
              Total Categories: <strong>{filteredCategories.length}</strong>
            </p>
          </div>{" "}
          {/* Search and Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          {/* Results Info */}
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Showing{" "}
              <strong>
                {Math.min(indexOfLastCategory, filteredCategories.length)}
              </strong>{" "}
              of <strong>{filteredCategories.length}</strong> categories
              {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
            </p>
          </div>
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          {/* Categories Table */}
          {currentCategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No categories found
              </h3>
              <p className="text-gray-500 mb-6">
                {debouncedSearchTerm
                  ? "Try adjusting your search criteria"
                  : "Start by creating your first category"}
              </p>
              {!debouncedSearchTerm && (
                <button
                  onClick={() => router.push("/admin/categories/create")}
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Name
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Description
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">
                        Created
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentCategories.map(category => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600 max-w-xs truncate">
                            {category.description || "No description"}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-gray-600">
                            {formatDate(category.createdAt)}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/categories/${category.id}/edit`
                                )
                              }
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
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
            <div className="flex justify-center items-center space-x-1 mt-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {Array.from({length: Math.min(5, totalPages)}, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() =>
                  setCurrentPage(prev => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
