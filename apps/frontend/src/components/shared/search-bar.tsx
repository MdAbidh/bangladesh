'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  category: string;
  href: string;
  icon?: ReactNode;
}

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onResultClick?: (result: SearchResult) => void;
  results?: SearchResult[];
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
  recentSearches?: string[];
  onClearRecent?: () => void;
}

export function SearchBar({
  onSearch,
  onResultClick,
  results = [],
  isLoading = false,
  placeholder = 'Search courses, lessons, instructors...',
  className,
  recentSearches = [],
  onClearRecent,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) {
      onSearch?.(debouncedQuery);
      setIsOpen(true);
    }
  }, [debouncedQuery, onSearch]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = query ? results : recentSearches;
    if (!items) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const item = items[selectedIndex];
          if (typeof item === 'object' && 'href' in item) {
            onResultClick?.(item as SearchResult);
          } else {
            setQuery(item as string);
            onSearch?.(item as string);
          }
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const groupedResults = results.reduce<Record<string, SearchResult[]>>((acc, result) => {
    if (!acc[result.category]) acc[result.category] = [];
    acc[result.category]!.push(result);
    return acc;
  }, {});

  const showDropdown = isOpen && (query ? results.length > 0 || isLoading : recentSearches.length > 0);

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
            if (e.target.value) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="h-10 w-full rounded-xl border border-gray-200 bg-white/80 pl-9 pr-8 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-gray-700 dark:bg-gray-950/80 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-primary-400"
          aria-label="Search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls="search-results"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            id="search-results"
            initial={{ opacity: 0, y: -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
          >
            {query ? (
              <div className="max-h-80 overflow-y-auto p-2">
                {isLoading ? (
                  <div className="space-y-2 p-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-100 dark:bg-gray-800" />
                    ))}
                  </div>
                ) : results.length > 0 ? (
                  Object.entries(groupedResults).map(([category, items]) => (
                    <div key={category}>
                      <div className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-gray-400 dark:text-gray-500">
                        <TrendingUp className="h-3 w-3" />
                        {category}
                      </div>
                      {items.map((item, idx) => {
                        const globalIdx = Object.entries(groupedResults)
                          .slice(0, Object.keys(groupedResults).indexOf(category))
                          .reduce((acc, [, v]) => acc + v.length, 0) + idx;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              onResultClick?.(item);
                              setIsOpen(false);
                              setQuery('');
                            }}
                            className={cn(
                              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors',
                              selectedIndex === globalIdx
                                ? 'bg-primary-50 dark:bg-primary-950/50'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                            )}
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                              {item.icon || <Search className="h-4 w-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {item.title}
                              </p>
                              {item.description && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-gray-400">
                    No results found for "{query}"
                  </div>
                )}
              </div>
            ) : (
              <div className="p-2">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Recent Searches
                  </span>
                  {onClearRecent && (
                    <button
                      onClick={onClearRecent}
                      className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Clear
                    </button>
                  )}
                </div>
                {recentSearches.map((search, idx) => (
                  <button
                    key={search}
                    onClick={() => {
                      setQuery(search);
                      onSearch?.(search);
                    }}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors',
                      selectedIndex === idx
                        ? 'bg-primary-50 dark:bg-primary-950/50'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800',
                    )}
                  >
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{search}</span>
                    <ArrowRight className="ml-auto h-3.5 w-3.5 text-gray-400" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
