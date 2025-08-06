import {Calendar, Tag} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState} from "react";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  category: string;
  date: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({article}: ArticleCardProps) {
  const router = useRouter();
  const [imageLoading, setImageLoading] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getExcerpt = (htmlContent: string, maxLength: number = 120) => {
    const cleanText = htmlContent.replace(/<[^>]*>/g, "");
    return cleanText.length > maxLength
      ? cleanText.substring(0, maxLength) + "..."
      : cleanText;
  };

  const getFallbackImage = (article: Article) => {
    return (
      article.imageUrl || `https://picsum.photos/400/240?random=${article.id}`
    );
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    const target = e.target as HTMLImageElement;
    target.src = `https://picsum.photos/400/240?random=${article.id}`;
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
  };

  const handleClick = () => {
    router.push(`/articles/${article.id}`);
  };

  return (
    <article
      className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-48 overflow-hidden">
        {imageLoading && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        <img
          src={getFallbackImage(article)}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          onLoad={handleImageLoad}
          onLoadStart={handleImageLoadStart}
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span className="font-medium">{formatDate(article.date)}</span>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-tight">
          {article.title}
        </h2>

        <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
          {getExcerpt(article.content)}
        </p>

        <div className="pt-3 border-t border-gray-50">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              <Tag className="w-3 h-3 mr-1" />
              {article.category}
            </span>
            <span className="tag-secondary">Design</span>
          </div>
        </div>
      </div>
    </article>
  );
}
