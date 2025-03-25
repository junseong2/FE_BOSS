import { useEffect, useState } from 'react';
import { getMajorCategories } from '../../../services/category.service';
import CenteredSlider from '../../../components/slide/CenteredSlider';
import { SwiperSlide } from 'swiper/react';
import { Link } from 'react-router';

const breakpoints = {
  768: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
  1024: {
    slidesPerView: 5,
    spaceBetween: 50,
  },
};

export default function HomeCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 카테고리(대분류) 조회
  const fetchCategories = async () => {
    const response = await getMajorCategories();

    if (response.status === 200) {
      setCategories(response.data);
    } else {
      setError('카테고리 목록을 불러올 수 없습니다.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className='w-full h-96 pt-14  pl-5'>
      <h2 className='text-2xl font-bold'>전체 카테고리</h2>
      <div className='mt-5 flex flex-wrap gap-3'>
        <CenteredSlider breakpoints={breakpoints}>
          {categories.map((category) => {
            return (
              <SwiperSlide key={category.id}>
                <Link
                  to={`/category/${category.id}`}
                  className='w-[130px] h-[120px]  p-2 rounded-xl'
                >
                  <div className='border-gray-100 border w-9 h-9 mx-auto rounded-full bg-gray-100'></div>
                  <div className='mt-1.5 text-center'>{category.name}</div>
                </Link>
              </SwiperSlide>
            );
          })}
        </CenteredSlider>
      </div>
    </div>
  );
}
