import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import noImage from '../../assets/noImage.jpg';


import 'swiper/css';
import 'swiper/css/pagination';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

const slides = [
  {
    id: 1,
    imageUrl: '/placeholder.svg?height=600&width=1800',
    title: '여름 신상품 컬렉션',
    description: '더운 여름을 시원하게 보낼 수 있는 최신 트렌드 아이템을 만나보세요.',
    ctaText: '지금 쇼핑하기',
    ctaLink: '/collections/summer',
  },
  {
    id: 2,
    imageUrl: '/placeholder.svg?height=600&width=1800',
    title: '특별 할인 이벤트',
    description: '인기 상품 최대 50% 할인! 한정된 시간 동안만 진행됩니다.',
    ctaText: '할인 상품 보기',
    ctaLink: '/sale',
  },
  {
    id: 3,
    imageUrl: '/placeholder.svg?height=600&width=1800',
    title: '신규 회원 혜택',
    description: '지금 가입하고 첫 구매 시 15% 할인 쿠폰을 받아가세요.',
    ctaText: '회원가입',
    ctaLink: '/signup',
  },
  {
    id: 4,
    imageUrl: '/placeholder.svg?height=600&width=1800',
    title: '베스트셀러 컬렉션',
    description: '고객들이 가장 사랑하는 인기 상품을 만나보세요.',
    ctaText: '베스트 상품',
    ctaLink: '/best-sellers',
  },
];

export default function InfiniteSlider() {
  const BASE_IMAGE_URL = "http://localhost:5000/uploads";

  const progressCircle = useRef(null);
  const progressContent = useRef(null);

  const onAutoplayTimeLeft = (s, time, progress) => {
    if (progressCircle.current && progressContent.current) {
      progressCircle.current.style.setProperty('--progress', 1 - progress);
      progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
    }
  };

  return (
    <div className='w-full bg-[#dadcdd]'>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className='mySwiper h-[700px]'
        
      >

        {/* 슬라이드 아이템 */}
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className='relative w-full flex-shrink-0 h-full'>
            <div className=' bottom-0 left-0 right-0 top-0 flex flex-col justify-center p-6 text-white sm:p-10 md:p-16'>
              <img
                src='https://picsum.photos/1400/600'
                alt='배너 이미지'
                className='absolute left-0 top-0 w-full h-full'
                onError={(e) => {
                  e.currentTarget.src = noImage;
                }}
              />
              <div className='max-w-md z-[10]'>
                <h2 className='mb-2 text-2xl font-bold sm:text-3xl md:text-4xl drop-shadow-md'>
                  {slide.title}
                </h2>
                <p className='mb-4 text-sm sm:text-base md:text-lg drop-shadow-sm'>
                  {slide.description}
                </p>
                <button className='rounded-[3px] hover:bg-[rgba(0,0,0,0.3)] border border-[rgba(255,255,255,0.3)] p-2 px-3.5 bg-[rgba(0,0,0,0.1)] backdrop-blur-md text-white'>
                  <a href={slide.ctaLink}>{slide.ctaText}</a>
                </button>
              </div>
              {/* 배너 밑바닥 그라디레이션 */}
              <div className='absolute w-full left-0 right-0 bottom-0 h-[300px] bg-gradient-to-b from-transparent to-white z-[100]'></div>
            </div>

          </SwiperSlide>
        ))}

        <div className='autoplay-progress z-10' slot='container-end'>
          <svg viewBox='0 0 48 48' ref={progressCircle} className='w-6 h-6 absolute right-4 top-4'>
            <circle
              cx='24'
              cy='24'
              r='20'
              stroke='black'
              strokeWidth='4'
              fill='none'
              strokeDasharray='125.6'
              strokeDashoffset='calc(125.6 * var(--progress))'
              style={{ transition: 'stroke-dashoffset 0.25s linear' }}
            ></circle>
          </svg>
          <span ref={progressContent} className="absolute right-4 top-12 text-sm text-black"></span>
        </div>
      </Swiper>
    </div>
  );
}
