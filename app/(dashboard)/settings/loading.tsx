import React from 'react';

export default function SettingsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-60 bg-stone-200 dark:bg-stone-800 rounded-xl" />
          <div className="h-4 w-80 bg-stone-200 dark:bg-stone-800 rounded-md" />
        </div>
        <div className="h-11 w-36 bg-stone-200 dark:bg-stone-800 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 space-y-4">
            <div className="h-6 w-48 bg-stone-200 dark:bg-stone-800 rounded-lg" />
            <div className="space-y-3">
              <div className="h-10 w-full bg-stone-100 dark:bg-stone-800 rounded-xl" />
              <div className="h-10 w-full bg-stone-100 dark:bg-stone-800 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
