import React from 'react';

export default function OrdersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          <div className="h-4 w-72 bg-stone-200 dark:bg-stone-800 rounded-md" />
        </div>
        <div className="h-9 w-32 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
      </div>

      {/* Filter Bar Skeleton */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
        <div className="h-10 w-full bg-stone-100 dark:bg-stone-800 rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-20 bg-stone-100 dark:bg-stone-800 rounded-xl shrink-0" />
          ))}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-14 w-full bg-stone-50 dark:bg-stone-800/60 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
