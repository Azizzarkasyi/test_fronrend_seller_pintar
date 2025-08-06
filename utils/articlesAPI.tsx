import axiosInstance from "./axiosInstance";

interface Article {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  author: string;
  date: string;
  category: string;
}

interface APIArticle {
  id: string;
  userId: string;
  categoryId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    userId: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  user: {
    id: string;
    username: string;
  };
}

interface APIResponse {
  data: APIArticle[];
  total: number;
  page: number;
  limit: number;
}

const transformArticleData = (apiData: APIArticle, index: number): Article => {
  return {
    id: apiData.id,
    title: apiData.title,
    content: apiData.content,
    imageUrl:
      apiData.imageUrl || `https://picsum.photos/400/240?random=${index + 1}`,
    author: apiData.user?.username || "Unknown Author",
    date: apiData.createdAt,
    category: apiData.category?.name || "Uncategorized",
  };
};

export const testArticlesAPI = async () => {
  try {
    const response = await axiosInstance.get("/articles");
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getArticles = async () => {
  try {
    const response = await axiosInstance.get<APIResponse>("/articles");

    if (
      response.data &&
      response.data.data &&
      Array.isArray(response.data.data)
    ) {
      return response.data.data.map((article, index) =>
        transformArticleData(article, index)
      );
    }

    throw new Error("Invalid API response structure");
  } catch (error) {
    throw error;
  }
};
