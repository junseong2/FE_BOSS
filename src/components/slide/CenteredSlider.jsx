import { Swiper } from 'swiper/react';

import 'swiper/css';

const defaultBreakpoints = {
  0: {
    slidesPerView: 2,
    spaceBetween: 20,
  },
  640: {
    slidesPerView: 2,
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

export default function CenteredSlider({
  children,
  breakpoints = defaultBreakpoints,
}) {
  return (
    <>
      <Swiper
        slidesPerView={5}
        spaceBetween={30}
        centeredSlides={false}
        className='mySwiper'
        breakpoints={breakpoints}
      >
        {children}
      </Swiper>
    </>
  );
}
