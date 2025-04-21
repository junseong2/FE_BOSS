import { useEffect, useState } from 'react';
import { getMajorCategories } from '../../../services/category.service';
import CenteredSlider from '../../../components/slide/CenteredSlider';
import { SwiperSlide } from 'swiper/react';
import { Link } from 'react-router-dom';
import {
  IoFastFoodOutline,
  IoWineOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoShirtOutline,
} from 'react-icons/io5';

const breakpoints = {
  320: { slidesPerView: 2.5, spaceBetween: 10 },
  480: { slidesPerView: 3.5, spaceBetween: 15 },
  640: { slidesPerView: 4, spaceBetween: 20 },
  768: { slidesPerView: 4, spaceBetween: 40 },
  1024: { slidesPerView: 5, spaceBetween: 50 },
};

const categoryIcons = [
  IoFastFoodOutline,
  IoWineOutline,
  IoHomeOutline,
  IoHeartOutline,
  IoShirtOutline,
];

const categoryColors = [
  'from-blue-100 to-blue-200',
  'from-purple-100 to-purple-200',
  'from-green-100 to-green-200',
  'from-yellow-100 to-yellow-200',
  'from-red-100 to-red-200',
];

export default function HomeCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getMajorCategories();
      if (response.status === 200) {
        setCategories(response.data);
      } else {
        setError('카테고리 목록을 불러올 수 없습니다.');
      }
      setIsLoading(false);
    };
    fetchCategories();
  }, []);

  return (
    <div className='w-full pt-4 sm:pt-6 pb-6 sm:pb-12 px-4 sm:px-6'>
      <div className='flex items-center justify-between mb-4 sm:mb-6'>
        <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>
          전체 카테고리
        </h2>
        <Link
          to='/categories'
          className='text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center'
        >
          전체보기
          <svg xmlns='http://www.w3.org/2000/svg' className='h-3 w-3 sm:h-4 sm:w-4 ml-1' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </Link>
      </div>

      {isLoading ? (
        <div className='flex justify-center items-center h-32'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      ) : error ? (
        <div className='text-center text-red-500'>{error}</div>
      ) : (
        <div className='mt-3 sm:mt-5'>
          <CenteredSlider breakpoints={breakpoints}>
            {categories.map((category, index) => {
              const Icon = categoryIcons[index % categoryIcons.length];
              const colorClass = categoryColors[index % categoryColors.length];
              return (
                <SwiperSlide key={category.id}>
                  <Link
                    to={`/category/${category.id}`}
                    className='block w-[110px] sm:w-[150px] h-[120px] sm:h-[150px] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-transform hover:scale-105 group'
                  >
                    <div
                      className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}
                    >
                      <Icon className='h-6 w-6 sm:h-8 sm:w-8 text-gray-700' />
                    </div>
                    <div className='mt-2 sm:mt-3 text-center font-medium text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1'>
                      {category.name}
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </CenteredSlider>
        </div>
      )}
    </div>
  );
}