import { useEffect, useState } from 'react';
import { useUserContext } from '../../context/UserContext';
import HomeBanner from './components/HomeBanner';
import HomeCategories from './components/HomeCategories';
import HomeProducts from './components/HomeProducts';
import RecommendHomeProducts from './components/RecommendHomeProducts';
import HomeStores from './components/HomeStores';
import { getPopularProducts, getRecommendProducts } from '../../services/product.service';


export default function HomePage() {
  const { recommendProductIds } = useUserContext();
  const [recommendedProductList, setRecommendedProductList] = useState([]);
  const [products, setProducts] = useState([]);



  // 인기 상품 조회
  async function popularProductsFetch() {
    const data = await getPopularProducts(0, 30, 'daily')
    setProducts(data)
  }

  // 추천 상품 정보 fetch
  async function recommendProductsFetch() {
    if (!recommendProductIds || recommendProductIds.length === 0) return;

    try {
      const results = getRecommendProducts({ recommendedProductIds: recommendProductIds })
      setRecommendedProductList(results);
    } catch (error) {
      console.error('추천 상품 불러오기 실패:', error);
    }
  }


  useEffect(() => {
    recommendProductsFetch()
  }, [recommendProductIds]);

  useEffect(() => {
    popularProductsFetch()
  }, []);


  return (
    <div className='w-full h-full'>
      {/* <HomeBanner /> */}
      <div className='max-w-[1200px] w-full mx-auto'>
        {/* 상품 카테고리 */}
        <HomeCategories />

        {/* 상품 리스트 */}
        <div>
          {/* <HomeStores /> */}
          <HomeProducts
            products={products?.map((product) => product).sort((a, b) => b.productId - a.productId)}
            title={'고객이 많이 찾는 상품'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />
          <HomeProducts products={products} title={'BOSS가 추천하는 TOP10'} />
          <HomeProducts
            products={products?.map((product) => product).slice(20, 30)}
            title={'인기 상품 TOP10'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />

          {recommendedProductList.length > 0 && (
            <RecommendHomeProducts
              products={recommendedProductList}
              title={'회원님을 위한 맞춤 추천'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
