import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`bg-slate-200/70 animate-pulse rounded-xl ${className}`}
    />
  );
};

export const BikeCardSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={
        className ||
        'w-full bg-white rounded-[24px] border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between h-[380px]'
      }
    >
      {/* Image area */}
      <div className="relative h-44 sm:h-48 bg-slate-100 animate-pulse border-b border-slate-200 p-4 flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <Skeleton className="w-16 h-4 bg-slate-200/90" />
          <Skeleton className="w-16 h-5 rounded-full bg-slate-200/90" />
        </div>
      </div>

      {/* Details area */}
      <div className="p-4 sm:p-4.5 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-2">
          <Skeleton className="w-3/4 h-5 rounded-lg" />
          <Skeleton className="w-1/2 h-3.5 rounded-md" />
        </div>
        <div className="space-y-1.5 pt-2">
          <Skeleton className="w-2/5 h-7 rounded-lg" />
          <Skeleton className="w-3/5 h-3.5 rounded-md" />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="grid grid-cols-2 border-t border-slate-200 h-12">
        <div className="border-r border-slate-200 p-3 flex items-center justify-center">
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
        <div className="p-3 flex items-center justify-center">
          <Skeleton className="w-20 h-4 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export const BlogCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-xs flex flex-col h-[400px]">
      <div className="aspect-video w-full bg-slate-100 animate-pulse relative p-4 flex justify-between items-start">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
        <div className="space-y-3">
          <div className="flex gap-4">
            <Skeleton className="w-20 h-3" />
            <Skeleton className="w-16 h-3" />
          </div>
          <Skeleton className="w-full h-5" />
          <Skeleton className="w-4/5 h-5" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-2/3 h-3" />
        </div>
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="w-20 h-3" />
              <Skeleton className="w-12 h-2" />
            </div>
          </div>
          <Skeleton className="w-16 h-6 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const MotoDetailSkeleton: React.FC = () => {
  return (
    <div className="bg-[#fbfbfc] min-h-screen pb-16 font-sans">
      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 pt-6 pb-2">
        <Skeleton className="w-48 h-4 mb-4" />
      </div>

      <div className="max-w-7xl lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-0 mt-2 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-100 animate-pulse rounded-[28px] aspect-[16/10.5] w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-28 rounded-[20px]" />
            <Skeleton className="h-28 rounded-[20px]" />
          </div>
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 space-y-4">
            <Skeleton className="w-40 h-6" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 space-y-6">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-48 h-8" />
            <Skeleton className="w-full h-12 rounded-xl" />
            <div className="flex gap-3">
              <Skeleton className="flex-[2] h-12 rounded-xl" />
              <Skeleton className="flex-1 h-12 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FavoritesSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[#f8fafc] min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <Skeleton className="w-36 h-4" />
        <Skeleton className="w-48 h-9" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <BikeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

export const CatalogPageSkeleton: React.FC = () => {
  return (
    <div className="bg-[#fbfbfc] min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row font-sans">
      {/* Desktop Sidebar Skeleton */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-slate-200 bg-white p-6 space-y-6">
        <Skeleton className="w-32 h-6" />
        <div className="space-y-4 pt-4">
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
          <Skeleton className="w-full h-10 rounded-xl" />
        </div>
      </aside>

      {/* Main Catalog Grid Skeleton */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="w-64 h-7 rounded-lg" />
          <Skeleton className="w-32 h-9 rounded-xl" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 my-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BikeCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
};
