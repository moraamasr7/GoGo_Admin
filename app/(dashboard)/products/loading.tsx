import React from 'react';

export default function ProductsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-60 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          <div className="h-4 w-80 bg-stone-200 dark:bg-stone-800 rounded-md" />
        </div>
        <div className="h-11 w-40 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="h-10 w-full bg-stone-100 dark:bg-stone-800 rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-24 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="h-44 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-4" />
        ))}
      </div>
    </div>
  );
}
