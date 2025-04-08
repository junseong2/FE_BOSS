import { SwiperSlide } from 'swiper/react';
import CenteredSlider from '../../../components/slide/CenteredSlider';
import { Link } from 'react-router-dom';

export default function RecommendHomeProducts({ title, products, customClassName }) {
  return (
    <div className={`${customClassName} w-full h-96 mb-6 rounded-[10px] p-5`}>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <div className='mt-5 flex flex-wrap gap-5'>
        <CenteredSlider>
          {products?.map((product) => {
            return (
              <SwiperSlide key={product.productId}>
                <Link to={`/product/${product.productId}`}>
                  <div className='border-gray-100 border w-full min-w-[200px] h-[250px] bg-gray-100 rounded overflow-hidden'>
                    {/* 이미지 없음: 회색 박스만 유지 */}
                  </div>
                  <div className='mt-1.5 text-center font-medium'>{product.name}</div>
                  <div className='text-center text-sm text-gray-600'>{product.price.toLocaleString()}원</div>
                </Link>
              </SwiperSlide>
            );
          })}
        </CenteredSlider>
      </div>
    </div>
  );
}