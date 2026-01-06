'use client';

import { useRouter } from 'next/navigation';
import { Post } from '@/types';
import { useFavorites } from '@/contexts/FavoritesContext';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favorite = isFavorite(post.id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorite) {
      removeFavorite(post.id);
    } else {
      addFavorite(post.id);
    }
  };

  const handleDetailsClick = () => {
    console.log("正在跳转到详情页");
    console.log(post);
    router.push(`/post/${post.id}`);
  };

  // 生成摘要（取 body 的前 100 个字符）
  const excerpt = post.body.length > 100 
    ? post.body.substring(0, 100) + '...'
    : post.body;

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-4 bg-white hover:shadow-lg transition-shadow">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
      <p className="text-gray-600 text-sm mb-4">{excerpt}</p>
      <div className="flex gap-2">
        <button
          onClick={handleFavoriteClick}
          className={`
            px-4 py-2 rounded text-sm font-medium transition-colors shadow-sm
            ${favorite 
              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {favorite ? '★ 已收藏' : '☆ 收藏'}
        </button>
        <button
          onClick={handleDetailsClick}
          className="px-4 py-2 rounded text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors shadow-sm"
        >
          详情
        </button>
      </div>
    </div>
  );
}

