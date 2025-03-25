import { mockProductList } from '../../data/home-product';
import HomeBanner from './components/HomeBanner';
import HomeCategories from './components/HomeCategories';
import HomeProducts from './components/HomeProducts';


export default function HomePage() {
  return (
    <div className='w-full h-full'>
      <HomeBanner />
      <div className='max-w-[1200px] w-full mx-auto'>
        {/* 상품 카테고리 */}
        <HomeCategories />

        {/* 상품 리스트 */}
        <div>
          <HomeProducts
            products={mockProductList}
            title={'2030이 많이 찾는 상품'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />
          <HomeProducts products={mockProductList} title={'준성이사가 추천하는 TOP10'} />
          <HomeProducts
            products={mockProductList}
            title={'건강이 걱정인 당신을 위한 추천 상품'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />
        </div>
      </div>
    </div>
  );
}
