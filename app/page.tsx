'use client';

import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import UserList from '@/components/UserList';
import PostList from '@/components/PostList';
import Navbar from '@/components/Navbar';

function HomeContent() {
  return (
    <div className="flex flex-row mt-10 bg-gray-50 p-8">
      <Navbar />
      {/* 左侧：用户列表（1/3） */}
      <div className="flex flex-col w-1/3 border-r border-gray-200 bg-white">
        <div className="p-4 border-b border-gray-200 bg-white">
          <SearchBar />
        </div>
        <div className="flex-1 overflow-hidden bg-white">
          <UserList />
        </div>
      </div>

      {/* 右侧：帖子列表（2/3） */}
      <div className="flex flex-col w-2/3 relative bg-gray-50">
        {/* 帖子列表区域 */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <PostList />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">加载中...</div>}>
      <HomeContent />
    </Suspense>
  );
}
