'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FavoritesContextType {
  favorites: Set<number>;
  addFavorite: (postId: number) => void;
  removeFavorite: (postId: number) => void;
  isFavorite: (postId: number) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'favorites';

export function FavoritesProvider({ children }: { children: ReactNode }) {
  // 使用 lazy initializer 从 localStorage 中初始化，避免在 effect 中同步 setState
  const [favorites, setFavorites] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') {
      return new Set();
    }
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const favoriteIds = JSON.parse(stored) as number[];
        return new Set(favoriteIds);
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage:', error);
    }
    return new Set();
  });

  // 保存到 localStorage
  const saveToStorage = (newFavorites: Set<number>) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(newFavorites)));
    } catch (error) {
      console.error('Failed to save favorites to localStorage:', error);
    }
  };

  const addFavorite = (postId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.add(postId);
      saveToStorage(newFavorites);
      return newFavorites;
    });
  };

  const removeFavorite = (postId: number) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      newFavorites.delete(postId);
      saveToStorage(newFavorites);
      return newFavorites;
    });
  };

  const isFavorite = (postId: number) => {
    return favorites.has(postId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

