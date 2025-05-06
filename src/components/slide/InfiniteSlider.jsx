import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';

export default function InfiniteSlider() {
  const BASE_IMAGE_URL = "https://bossassets.s3.amazonaws.com";

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
        // navigation={true}
        modules={[Pagination, Navigation, Autoplay]}
        onAutoplayTimeLeft={onAutoplayTimeLeft}
        className='mySwiper h-[700px]'

      >
        {[1, 2, 3].map((num) => (
          <SwiperSlide key={num}>
            <img
              src={`${BASE_IMAGE_URL}/banner${num}.jpg` || 'https://via.assets.so/img.jpg?w=1600&h=600&tc=&bg=#cecece&t=plcaeimage'}
              alt={`배너 ${num}`}
              className="w-full h-full object-cover object-center"
              onError={(e) => {
                e.currentTarget.src = 'https://via.assets.so/img.jpg?w=1600&h=600&tc=&bg=#cecece&t=plcaeimage'
              }}
            />

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
