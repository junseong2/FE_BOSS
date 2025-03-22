import { useState, useEffect } from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function CardSkeleton({ baseColor = '#E4E4E6', highlightColor = '#CACACD' }) {
  const [rowCount, setRowCount] = useState(5);

  // 브레이크 포인트에 맞춰 rowCount 조정
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 640) {
        setRowCount(2); // 작은 화면에서 1개
      } else if (window.innerWidth <= 1024) {
        setRowCount(3); // 중간 화면에서 3개
      } else {
        setRowCount(5); // 큰 화면에서 5개
      }
    };

    // 초기 로드 및 크기 변경 시 처리
    handleResize();
    window.addEventListener('resize', handleResize);

    // 클린업
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        <div className='w-full'>
          <Skeleton
            count={rowCount}
            className='max-w-[240px] inline-block h-[250px] w-full'
            containerClassName='flex gap-5'
          />
        </div>
      </SkeletonTheme>
      <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
        <div className='w-full mt-2'>
          <Skeleton
            count={rowCount}
            className='max-w-[240px] inline-block h-[30px] w-full'
            containerClassName='flex gap-5'
          />
        </div>
      </SkeletonTheme>
    </div>
  );
}
