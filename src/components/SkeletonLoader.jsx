import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 6 }) {
  if (type === 'banner') {
    return (
      <div className="w-full h-[56.25vw] max-h-[800px] min-h-[400px] bg-netflix-dark-gray animate-pulse flex flex-col justify-end p-8 md:p-16">
        <div className="h-10 w-2/3 md:w-1/3 bg-netflix-light-gray rounded mb-4"></div>
        <div className="h-6 w-full md:w-1/2 bg-netflix-light-gray rounded mb-2"></div>
        <div className="h-6 w-5/6 md:w-2/5 bg-netflix-light-gray rounded mb-6"></div>
        <div className="flex gap-4">
          <div className="h-12 w-28 bg-netflix-light-gray rounded"></div>
          <div className="h-12 w-32 bg-netflix-light-gray rounded"></div>
        </div>
      </div>
    );
  }

  // Row card skeletons
  return (
    <div className="flex gap-4 overflow-hidden py-4 px-2">
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className="min-w-[160px] md:min-w-[240px] h-[90px] md:h-[135px] bg-netflix-dark-gray rounded-md animate-pulse relative overflow-hidden flex-shrink-0"
        >
          {/* Shimmer overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-netflix-light-gray/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
        </div>
      ))}
    </div>
  );
}
