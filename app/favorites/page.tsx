'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import PostCard from '@/components/PostCard';
import { useFavorites } from '@/contexts/FavoritesContext';
import { getPostById } from '@/lib/api';
import type { Post } from '@/types';

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFavorites = async () => {
      if (favorites.size === 0) {
        setPosts([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const ids = Array.from(favorites);
        const result = await Promise.all(ids.map((id) => getPostById(id)));
        setPosts(result);
      } catch (err) {
        console.error(err);
        setError('加载收藏的帖子失败');
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [favorites]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto pt-16 pb-10 px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">starred posts</h1>

        {loading ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            正在加载收藏的帖子...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-48 text-red-500">
            {error}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-500">
            <p>你还没有收藏任何帖子。</p>
            <p className="text-sm mt-1">在首页点击帖子卡片上的「收藏」按钮试试吧。</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}