"use client";

import {useState, useEffect} from "react";
import {useRouter, useParams} from "next/navigation";
import {getArticles} from "../../../../utils/articlesAPI";
import {useAuth} from "../../../contexts/AuthContext";
import {
  Calendar,
  User,
  Tag,
  ArrowLeft,
  ChevronRight,
  Clock,
  Share2,
  Eye,
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

export default function ArticleDetailPage() {
  const {user} = useAuth();
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;

  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadArticleAndRelated = async () => {
      try {
        setLoading(true);
        const allArticles = await getArticles();

        // Find current article
        const currentArticle = allArticles.find(a => a.id === articleId);
        if (!currentArticle) {
          setError("Article not found");
          return;
        }

        setArticle(currentArticle);

        // Find related articles (same category, excluding current)
        const related = allArticles
          .filter(
            a => a.category === currentArticle.category && a.id !== articleId
          )
          .slice(0, 3);

        setRelatedArticles(related);
        setError("");
      } catch (err: any) {
        setError("Failed to load article. Please try again later.");
        console.error("Error loading article:", err);
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      loadArticleAndRelated();
    }
  }, [articleId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return readingTime;
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article?.title,
          text: `Check out this article: ${article?.title}`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled the share
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy link");
      }
    }
  };

  const getFallbackImage = (article: Article) => {
    return (
      article.imageUrl || `https://picsum.photos/800/400?random=${article.id}`
    );
  };

  const getExcerpt = (htmlContent: string, maxLength: number = 100) => {
    const cleanText = htmlContent.replace(/<[^>]*>/g, "");
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-6 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error || "Article not found"}
          </h1>
          <button
            onClick={() => router.push("/articles")}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Articles</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/articles")}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </button>

        {/* Article Content */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Article Image */}
          <div className="h-64 md:h-96 overflow-hidden">
            <img
              src={getFallbackImage(article)}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-6 md:p-8">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(article.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>By {article.author}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{getReadingTime(article.content)} min read</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Tag className="w-4 h-4" />
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Share Button */}
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>

            {/* Article Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              <div
                className="text-gray-700 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Other Articles in {article.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <article
                  key={relatedArticle.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => router.push(`/articles/${relatedArticle.id}`)}
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={getFallbackImage(relatedArticle)}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-2">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(relatedArticle.date)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {getExcerpt(relatedArticle.content)}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1 text-xs text-gray-500">
                        <User className="w-3 h-3" />
                        <span>{relatedArticle.author}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400 hover:text-blue-600 transition-colors" />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
