import { SwiperSlide } from 'swiper/react';
import CenteredSlider from '../../../components/slide/CenteredSlider';
import { Link } from 'react-router';

export default function HomeProducts({ title, products, customClassName }) {
  return (
    <div className={`${customClassName} w-full h-96 mb-6 rounded-[10px] p-5`}>
      <h2 className='text-2xl font-bold'>{title}</h2>
      <div className='mt-5 flex flex-wrap gap-5'>
        <CenteredSlider>
          {products?.map((product) => {
            return (
              <SwiperSlide key={product.productId} >
                <Link to={`/product/${product.productId}`}>
                  <div className='border-gray-100 border w-full min-w-[200px] h-[250px] bg-gray-100'></div>
                  <div className='mt-1.5 text-center'>{product.name}</div>
                </Link>
              </SwiperSlide>
            );
          })}
        </CenteredSlider>
      </div>
    </div>
  );
}
