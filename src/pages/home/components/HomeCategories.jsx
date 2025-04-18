import { useEffect, useState } from 'react';
import { getMajorCategories } from '../../../services/category.service';
import CenteredSlider from '../../../components/slide/CenteredSlider';
import { SwiperSlide } from 'swiper/react';
import { Link } from 'react-router';

const breakpoints = {
  320: {
    slidesPerView: 2.5,
    spaceBetween: 10,
  },
  480: {
    slidesPerView: 3.5,
    spaceBetween: 15,
  },
  640: {
    slidesPerView: 4,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 4,
    spaceBetween: 40,
  },
  1024: {
    slidesPerView: 5,
    spaceBetween: 50,
  },
};

// Category icons - you can replace these with actual icons
const categoryIcons = [
  "M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z", // Shopping bag
  "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", // Laptop
  "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", // Mobile
  "M3 3h18v18H3zM12 8v8m-4-4h8", // Plus in box (Health)
  "M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z", // Cake (Food)
  "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z", // Moon (Fashion)
  "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", // Home
  "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", // Book
];

// Category colors - pastel colors for the backgrounds
const categoryColors = [
  "from-blue-100 to-blue-200", 
  "from-purple-100 to-purple-200",
  "from-green-100 to-green-200",
  "from-yellow-100 to-yellow-200",
  "from-red-100 to-red-200",
  "from-indigo-100 to-indigo-200",
  "from-pink-100 to-pink-200",
  "from-gray-100 to-gray-200",
  "from-teal-100 to-teal-200",
];

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
    <div className='w-full pt-4 sm:pt-6 pb-6 sm:pb-12 px-4 sm:px-6'>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className='text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent'>전체 카테고리</h2>
        <Link to="/categories" className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center">
          전체보기
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : (
        <div className='mt-3 sm:mt-5'>
          <CenteredSlider breakpoints={breakpoints}>
            {categories.map((category, index) => {
              const colorClass = categoryColors[index % categoryColors.length];
              const iconPath = categoryIcons[index % categoryIcons.length];
              
              return (
                <SwiperSlide key={category.id}>
                  <Link
                    to={`/category/${category.id}`}
                    className='block w-[110px] sm:w-[150px] h-[120px] sm:h-[150px] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-transform hover:scale-105 group'
                  >
                    <div className={`w-14 h-14 sm:w-20 sm:h-20 mx-auto rounded-full bg-gradient-to-br ${colorClass} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 sm:h-10 sm:w-10 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={iconPath} />
                      </svg>
                    </div>
                    <div className='mt-2 sm:mt-3 text-center font-medium text-sm sm:text-base text-gray-700 group-hover:text-gray-900 transition-colors line-clamp-1'>{category.name}</div>
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
