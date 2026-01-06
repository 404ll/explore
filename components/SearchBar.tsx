 'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 初始化：只在组件挂载时读取一次 URL
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  
  // 防抖
  const debouncedSearch = useDebounce(searchValue, 600);

  // 监听防抖值的变化，同步到 URL
  useEffect(() => {
    // 1. 创建一个新的 Params 对象（基于当前的 URL 参数，防止丢失 page, sort 等其他参数）
    const params = new URLSearchParams(searchParams.toString());

    // 2. 设置或删除 search 参数
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }

    // 3. 执行导航
    // 使用 replace 而不是 push，避免污染浏览器历史记录
    // scroll: false 防止搜索时页面自动滚动到顶部
    router.replace(`/?${params.toString()}`, { scroll: false });

  }, [debouncedSearch, router]); 

  const handleClear = () => {
    setSearchValue('');
  };

  return (
    <div className="relative w-full mb-4">
      <input
        type="text"
        placeholder="search users..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      {searchValue && (
        <button
          onClick={handleClear}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 px-2"
          aria-label="清除搜索"
        >
          ✕
        </button>
      )}
    </div>
  );
}