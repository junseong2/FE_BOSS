import React, { useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';


const slides = [
  {
    id: 1,
    imageUrl: "/placeholder.svg?height=600&width=1400",
    title: "여름 신상품 컬렉션",
    description: "더운 여름을 시원하게 보낼 수 있는 최신 트렌드 아이템을 만나보세요.",
    ctaText: "지금 쇼핑하기",
    ctaLink: "/collections/summer",
  },
  {
    id: 2,
    imageUrl: "/placeholder.svg?height=600&width=1400",
    title: "특별 할인 이벤트",
    description: "인기 상품 최대 50% 할인! 한정된 시간 동안만 진행됩니다.",
    ctaText: "할인 상품 보기",
    ctaLink: "/sale",
  },
  {
    id: 3,
    imageUrl: "/placeholder.svg?height=600&width=1400",
    title: "신규 회원 혜택",
    description: "지금 가입하고 첫 구매 시 15% 할인 쿠폰을 받아가세요.",
    ctaText: "회원가입",
    ctaLink: "/signup",
  },
  {
    id: 4,
    imageUrl: "/placeholder.svg?height=600&width=1400",
    title: "베스트셀러 컬렉션",
    description: "고객들이 가장 사랑하는 인기 상품을 만나보세요.",
    ctaText: "베스트 상품",
    ctaLink: "/best-sellers",
  },
]


export default function InfiniteSlider() {
  const progressCircle = useRef(null);
  const progressContent = useRef(null);
  const onAutoplayTimeLeft = (s, time, progress) => {
    progressCircle.current.style.setProperty('--progress', 1 - progress);
    progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
  };
  return (
    <div className=' w-full h-1/3 bg-[#dadcdd]'>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Navigation, Autoplay]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className='mySwiper h-[580px]'
      >
        {/* 슬라이드 아이템 */}
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className='relative w-full flex-shrink-0 h-full'>
            <div className='relative aspect-[21/9] w-full sm:aspect-[21/7]'>
              {/* <img
                src={slide.imageUrl || '/placeholder.svg'}
                alt={slide.title}
                className='object-cover'
              /> */}
              <div className='absolute inset-0 bg-gradient-to-r from-black/50 to-transparent' />
            </div>
            <div className=' bottom-0 left-0 right-0 top-0 flex flex-col justify-center p-6 text-white sm:p-10 md:p-16'>
              <div className='max-w-md'>
                <h2 className='mb-2 text-2xl font-bold sm:text-3xl md:text-4xl'>{slide.title}</h2>
                <p className='mb-4 text-sm sm:text-base md:text-lg'>{slide.description}</p>
                <button className='bg-white text-black hover:bg-gray-200'>
                  <a href={slide.ctaLink}>{slide.ctaText}</a>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}

        <div className='autoplay-progress z-10' slot='container-end'>
          <svg viewBox='0 0 48 48' ref={progressCircle}>
            <circle cx='24' cy='24' r='20'></circle>
          </svg>
          <span ref={progressContent}></span>
        </div>
      </Swiper>
    </div>
  );
}
