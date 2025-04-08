import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function ProductSkeleton(){
  return (
    <SkeletonTheme baseColor="#f0f0f0" highlightColor="#f8f8f8">
      <div className="max-w-6xl mx-auto p-4 flex flex-col md:flex-row gap-8">
        {/* Left Column - Product Images */}
        <div className="md:w-1/2">
          <div className="aspect-square w-full mb-4">
            <Skeleton height="100%" />
          </div>
          
          <div className="flex space-x-2 mt-2">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="w-16 h-16">
                <Skeleton height="100%" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Right Column - Product Details */}
        <div className="md:w-1/2">
          <div className="mb-2">
            <Skeleton width="60%" height={34} />
          </div>
          
          <div className="mb-4">
            <Skeleton width="40%" height={20} />
          </div>
          
          <div className="flex items-center mb-4">
            <Skeleton width={120} height={20} />
            <div className="ml-2">
              <Skeleton width={80} height={20} />
            </div>
          </div>
          
          <div className="mb-6">
            <Skeleton width={150} height={38} />
          </div>
          
          <div className="mb-6">
            <Skeleton width={60} height={20} className="mb-2" />
            <div className="flex space-x-2">
              {[...Array(3)].map((_, index) => (
                <Skeleton key={index} width={32} height={32} circle />
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <Skeleton width={80} height={20} className="mb-2" />
            <div className="flex">
              <Skeleton width={120} height={40} />
            </div>
          </div>
          
          <div className="flex space-x-2 mb-8">
            <Skeleton width="60%" height={48} />
            <Skeleton width="30%" height={48} />
            <Skeleton width="10%" height={48} />
          </div>
          
          <div className="border rounded overflow-hidden">
            <div className="flex border-b">
              {['Description', 'Specifications', 'Shipping'].map((_, index) => (
                <div key={index} className="flex-1 py-3 px-4 text-center">
                  <Skeleton width="80%" height={20} />
                </div>
              ))}
            </div>
            <div className="p-4">
              <Skeleton count={4} height={20} className="mb-2" />
            </div>
          </div>
        </div>
      </div>
    </SkeletonTheme>
  );
};
