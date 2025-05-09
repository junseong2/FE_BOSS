import InfiniteSlider from '../../../components/slide/InfiniteSlider';

export default function HomeBanner() {
  return (
    <div className="relative w-full overflow-hidden  shadow-md mb-4 sm:mb-8">
      <div className="absolute inset-0  z-10 pointer-events-none"></div>
      <InfiniteSlider />
    </div>
  );
}
