// https://jsonplaceholder.typicode.com/

import { User, Post, Comment } from '@/types';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * 获取所有用户列表
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

/**
 * 根据用户 ID 获取单个用户信息
 */
export async function getUserById(userId: number): Promise<User> {
  try {
    const response = await fetch(`${BASE_URL}/users/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

/**
 * 根据用户 ID 获取该用户的帖子列表
 */
export async function getUserPosts(userId: number): Promise<Post[]> {
  try {
    const response = await fetch(`${BASE_URL}/posts?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user posts');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user posts:', error);
    throw error;
  }
}

/**
 * 搜索帖子（根据关键词过滤标题和内容）
 */
export async function searchPosts(query: string, userId?: number): Promise<Post[]> {
  try {
    const url = userId 
      ? `${BASE_URL}/posts?userId=${userId}`
      : `${BASE_URL}/posts`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    
    const posts: Post[] = await response.json();
    
    // 客户端过滤
    if (!query) {
      return posts;
    }
    
    const lowerQuery = query.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerQuery) ||
        post.body.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching posts:', error);
    throw error;
  }
}

//根据帖子id获取帖子
export async function getPostById(postId: number): Promise<Post> {
  try {
    const response = await fetch(`${BASE_URL}/posts/${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch post');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error;
  }
}

/**
 * 根据帖子 ID 获取该帖子的评论列表
 */
export async function getCommentsByPostId(postId: number): Promise<Comment[]> {
  try {
    const response = await fetch(`${BASE_URL}/comments?postId=${postId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
}