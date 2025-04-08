import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductSkeleton() {
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#f8f8f8">
      <div className="max-w-6xl mx-auto p-4 pt-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Product Images */}
          <div className="md:w-1/2">
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-4">
              <Skeleton height="100%" className="h-full" />
            </div>
            
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden">
                  <Skeleton height="100%" className="h-full" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Product Details */}
          <div className="md:w-1/2">
            <div className="mb-2">
              <Skeleton width="80%" height={36} />
            </div>
            
            <div className="flex items-center mb-4">
              <Skeleton width={120} height={24} />
              <div className="ml-2">
                <Skeleton width={80} height={20} />
              </div>
            </div>
            
            <div className="mb-6">
              <Skeleton width={180} height={40} />
            </div>
            
            <div className="mb-6">
              <Skeleton width={100} height={24} className="mb-2" />
              <div className="flex items-center">
                <Skeleton width={120} height={40} />
              </div>
            </div>
            
            <div className="flex space-x-2 mb-8">
              <Skeleton width="70%" height={50} />
              <Skeleton width="25%" height={50} />
            </div>
            
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="flex border-b">
                {['상세설명', '배송정보', '리뷰'].map((_, index) => (
                  <div key={index} className="flex-1 py-3 px-4 text-center">
                    <Skeleton width="80%" height={24} />
                  </div>
                ))}
              </div>
              <div className="p-4">
                <Skeleton count={4} height={20} className="mb-2" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-4">
            <Skeleton width={150} height={32} />
            <Skeleton width={100} height={40} />
          </div>
          
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-start p-4 border-b border-gray-100">
                <div className="mr-3">
                  <Skeleton circle width={40} height={40} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <Skeleton width={120} height={20} />
                    <Skeleton width={100} height={20} />
                  </div>
                  <Skeleton count={2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
}
