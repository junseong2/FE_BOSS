import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { mockProductList } from '../../data/home-product';
import HomeBanner from './components/HomeBanner';
import HomeCategories from './components/HomeCategories';
import HomeProducts from './components/HomeProducts';
import RecommendHomeProducts from './components/RecommendHomeProducts'; // ✅ 추천 전용 컴포넌트
import HomeStores from './components/HomeStores';
import axios from 'axios';
export default function HomePage() {
  const { recommendedProducts } = useUser();
  const [recommendedProductList, setRecommendedProductList] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/products/popular', {
          params: { sortBy: 'daily' },
        });
        setProducts(response.data);
      } catch (error) {
        console.error('인기 상품 조회 실패:', error);
      }
    };

    fetchPopularProducts();
  }, []);
  // 추천 상품 정보 fetch
  useEffect(() => {
    const fetchRecommendedProductDetails = async () => {
      if (!recommendedProducts || recommendedProducts.length === 0) return;

      try {
        const productDetailPromises = recommendedProducts.map((id) =>
          fetch(`http://localhost:5000/products/${id}`).then((res) => res.json()),
        );

        const results = await Promise.all(productDetailPromises);
        setRecommendedProductList(results);
      } catch (error) {
        console.error('추천 상품 불러오기 실패:', error);
      }
    };

    fetchRecommendedProductDetails();
  }, [recommendedProducts]);

  return (
    <div className='w-full h-full'>
      <HomeBanner />
      <div className='max-w-[1200px] w-full mx-auto'>
        {/* 상품 카테고리 */}
        <HomeCategories />

        {/* 상품 리스트 */}
        <div>
          <HomeStores/>
          <HomeProducts
            products={mockProductList}
            title={'2030이 많이 찾는 상품'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />
          <HomeProducts 
          products={products} 
          title={'BOSS가 추천하는 TOP10'} />
          <HomeProducts
            products={mockProductList}
            title={'건강이 걱정인 당신을 위한 추천 상품'}
            customClassName={'bg-[rgba(0,0,0,0.025)]'}
          />

          {recommendedProductList.length > 0 && (
            <RecommendHomeProducts
              products={recommendedProductList}
              title={'회원님을 위한 맞춤 추천'}
              customClassName={'bg-[rgba(0,0,0,0.025)]'}
            />
          )}
        </div>
      </div>
    </div>
  );
}
