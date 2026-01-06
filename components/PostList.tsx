'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Post } from '@/types';
import { getUserPosts, searchPosts } from '@/lib/api';
import PostCard from './PostCard';

// 简单的内存缓存
const postCache = new Map<string, Post[]>();

export default function PostList() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('user_id');
  const searchQuery = searchParams.get('search') || '';
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 生成缓存 key
  const cacheKey = useMemo(() => {
    return userId ? `${userId}-${searchQuery}` : '';
  }, [userId, searchQuery]);

  // 加载帖子数据
  useEffect(() => {
    if (!userId) {
      setPosts([]);
      return;
    }

    // 检查缓存
    const cached = postCache.get(cacheKey);
    if (cached) {
      setPosts(cached);
      return;
    }

    async function loadPosts() {
      try {
        setLoading(true);
        setError(null);
        
        let data: Post[];
        if (searchQuery) {
          data = await searchPosts(searchQuery, parseInt(userId!));
        } else {
          data = await getUserPosts(parseInt(userId!));
        }
        
        setPosts(data);
        // 更新缓存
        postCache.set(cacheKey, data);
      } catch (err) {
        setError('加载帖子失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [userId, searchQuery, cacheKey]);

  // 初始状态：未选择用户
  if (!userId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-lg">
        请选择左侧用户
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        加载中...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        {searchQuery ? '未找到匹配的帖子' : '该用户暂无帖子'}
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}

