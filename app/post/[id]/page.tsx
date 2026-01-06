'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Post, Comment } from '@/types';
import { getPostById, getCommentsByPostId } from '@/lib/api';
import Navbar from '@/components/Navbar';

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(params.id);

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  // 加载帖子信息
  useEffect(() => {
    async function loadPost() {
      try {
        setLoadingPost(true);
        const data = await getPostById(postId);
        setPost(data);
      } catch (err) {
        console.error(err);
        setError('加载帖子信息失败');
      } finally {
        setLoadingPost(false);
      }
    }

    if (!Number.isNaN(postId)) {
      loadPost();
    } else {
      setError('无效的帖子 ID');
      setLoadingPost(false);
    }
  }, [postId]);

  // 加载评论数据
  useEffect(() => {
    if (Number.isNaN(postId)) {
      return;
    }

    async function loadComments() {
      try {
        setLoadingComments(true);
        setCommentsError(null);
        const data = await getCommentsByPostId(postId);
        setComments(data);
      } catch (err) {
        setCommentsError('加载评论失败');
        console.error(err);
      } finally {
        setLoadingComments(false);
      }
    }

    loadComments();
  }, [postId]);

  const handleBack = () => {
    router.push('/');
  };

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 bg-gray-50">
        正在加载帖子信息...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="mb-4 text-red-500">{error || '未找到该帖子'}</div>
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          返回主页
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto pt-16 pb-10 px-4">
        {/* 顶部返回按钮 */}
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded border border-gray-300 bg-white text-sm text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
        >
          ← 返回
        </button>

        {/* 帖子内容 */}
        <div className="mt-6 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">{post.title}</h1>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {post.body}
          </p>
        </div>

        {/* 评论列表 */}
        <div className="mt-8 rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
          {loadingComments ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              正在加载评论...
            </div>
          ) : commentsError ? (
            <div className="flex items-center justify-center h-32 text-red-500">
              {commentsError}
            </div>
          ) : comments.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              暂无评论
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="text-sm font-medium text-gray-800 mb-1">
                    {comment.name}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{comment.email}</div>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {comment.body}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
