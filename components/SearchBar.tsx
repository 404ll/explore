'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('search') || '');
  const debouncedSearch = useDebounce(searchValue, 300);

  // 当防抖后的搜索值变化时，更新 URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (debouncedSearch) {
      params.set('search', debouncedSearch);
    } else {
      params.delete('search');
    }
    const newUrl = `/?${params.toString()}`;
    router.push(newUrl);
    // 只在防抖后的搜索值变化时更新 URL，避免因为 searchParams 引用变化导致的无限循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, router]);

  const handleClear = () => {
    setSearchValue('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/?${params.toString()}`);
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
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="清除搜索"
        >
          ✕
        </button>
      )}
    </div>
  );
}

