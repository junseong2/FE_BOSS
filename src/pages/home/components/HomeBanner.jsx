import InfiniteSlider from '../../../components/slide/InfiniteSlider';

export default function HomeBanner() {
  return (
    <div className="relative w-full overflow-hidden  mb-4 sm:mb-8">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-gray-50 z-10 pointer-events-none"></div>
      <InfiniteSlider />
      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
