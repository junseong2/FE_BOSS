import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function TableSkeleton({
  rowCount = 6,
  baseColor = '#E4E4E7',
  highlightColor = '#CACACD',
}) {
  return (
    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
      <div className='mt-5'>
        <Skeleton count={1} className='h-11 mb-5'  />
      </div>
      <div className='mt-3'>
        <Skeleton count={rowCount}  className='h-8 py-3 mb-4' />
      </div>
    </SkeletonTheme>
  );
}
