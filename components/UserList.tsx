'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@/types';
import { getAllUsers } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';

export default function UserList() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const selectedUserId = searchParams.get('user_id');
  const searchQuery = searchParams.get('search') || '';
  const debouncedSearch = useDebounce(searchQuery, 300);

  // 加载所有用户数据
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        const data = await getAllUsers();
        console.log(data);
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        setError('加载用户列表失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  // 根据搜索关键词过滤用户列表
  useEffect(() => {
    if (!debouncedSearch) {
      setFilteredUsers(users);
      return;
    }

    const lowerQuery = debouncedSearch.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.username.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, [debouncedSearch, users]);

  const handleUserClick = (userId: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('user_id', userId.toString());
    // 保留搜索参数
    if (searchQuery) {
      params.set('search', searchQuery);
    }
    router.push(`/?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">加载中...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">{error}</div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {filteredUsers.length === 0 ? (
        <div className="p-4 text-center text-gray-500">未找到用户</div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => handleUserClick(user.id)}
              className={`
                p-4 border-b border-gray-200 cursor-pointer transition-colors bg-white
                hover:bg-blue-50
                ${selectedUserId === user.id.toString() ? 'bg-blue-100 border-l-4 border-l-blue-500' : ''}
              `}
            >
              <div className="font-medium text-gray-900">{user.name}</div>
              <div className="text-sm text-gray-500">{user.email}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

