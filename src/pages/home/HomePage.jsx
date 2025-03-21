import HomeBanner from './components/HomeBanner';
import HomeCategories from './components/HomeCategories';
import HomeProducts from './components/HomeProducts';

export default function HomePage() {
  return (
    <div className='w-full h-full'>
      <HomeBanner />
      <div className='max-w-[1200px] w-full mx-auto'>
        <HomeCategories />
        <HomeProducts />
      </div>
    </div>
  );
}
