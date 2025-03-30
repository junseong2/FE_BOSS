import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function SellerCardSkeleton() {
  return (
    <SkeletonTheme baseColor='#E0E0E0' highlightColor='#F5F5F5'>
      <div className='bg-white p-4 rounded-lg shadow-md'>
        <Skeleton height={20} width={100} className='mb-2' /> {/* 제목 */}
        <Skeleton height={30} width={120} /> {/* 값 */}
      </div>
    </SkeletonTheme>
  );
}
