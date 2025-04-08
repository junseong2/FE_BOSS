import InfiniteSlider from '../../../components/slide/InfiniteSlider';

export default function HomeBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-b-xl sm:rounded-b-3xl shadow-md mb-4 sm:mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 z-10 pointer-events-none"></div>
      <InfiniteSlider />
      <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-16 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none"></div>
    </div>
  );
}
