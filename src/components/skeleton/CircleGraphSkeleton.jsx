import 'react-loading-skeleton/dist/skeleton.css';

export default function CircleGraphSkeleton() {
  return (
    <div className='flex items-center justify-center w-full h-full rounded-full '>
      <div className=' max-h-[280px] max-w-[280px] w-full h-full bg-gray-200 animate-pulse'></div>
    </div>
  );
}
