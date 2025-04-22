import InfiniteSlider from '../../../components/slide/InfiniteSlider';

export default function HomeBanner() {
  return (
    <div className="relative w-full overflow-hidden rounded-b-xl  mb-4 sm:mb-8">
      <div className="absolute inset-0 bg-gradient-to-r  z-10 pointer-events-none"></div>

      <InfiniteSlider />
    </div>
  );
}
