import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, Zoom } from 'swiper/modules';
import { useState } from 'react';
import { IoExpand, IoClose } from 'react-icons/io5';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import { DOM_URL } from '../../../lib/api';

export default function ProductImageSlider({ imageList }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // 전체화면 모드일 때 스크롤 방지
    document.body.style.overflow = !isFullscreen ? 'hidden' : 'auto';
  };

  return (
    <>
      {/* 메인 이미지 슬라이더 */}
      <div className="relative group">
        <Swiper
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          }}
          spaceBetween={10}
          navigation={true}
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          zoom={true}
          thumbs={{ swiper: thumbsSwiper }}
          modules={[FreeMode, Navigation, Thumbs, Pagination, Zoom]}
          className="rounded-lg overflow-hidden shadow-md mb-4 aspect-square"
        >
          {imageList.map((imageUrl, index) => (
            <SwiperSlide key={`main-${imageUrl}-${index}`} className="bg-gray-50">
              <div className="swiper-zoom-container">
                <img 
                  src={imageUrl || "/placeholder.svg"} 
                  className="w-full h-full object-contain" 
                  alt={`Product image ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DOM_URL+'/src/assets/noimage.jpg';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
          
          {/* 확대 버튼 */}
          <button 
            onClick={toggleFullscreen}
            className="absolute bottom-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            aria-label="전체화면으로 보기"
          >
            <IoExpand className="w-5 h-5 text-gray-700" />
          </button>
        </Swiper>
      </div>

      {/* 썸네일 슬라이더 */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbs-swiper"
      >
        {imageList.map((imageUrl, index) => (
          <SwiperSlide 
            key={`thumb-${imageUrl}-${index}`} 
            className="cursor-pointer rounded-md overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all duration-200"
          >
            <div className="aspect-square bg-gray-50">
              <img 
                src={imageUrl || "/placeholder.svg"} 
                className="w-full h-full object-cover" 
                alt={`Thumbnail ${index + 1}`}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DOM_URL+'/src/assets/noimage.jpg';
                }}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 전체화면 모드 */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 bg-white/20 backdrop-blur-sm p-2 rounded-full"
            aria-label="전체화면 닫기"
          >
            <IoClose className="w-6 h-6 text-white" />
          </button>
          
          <Swiper
            spaceBetween={0}
            navigation={true}
            pagination={{
              type: 'fraction',
            }}
            zoom={{
              maxRatio: 3,
            }}
            modules={[Navigation, Pagination, Zoom]}
            className="w-full max-w-4xl"
          >
            {imageList.map((imageUrl, index) => (
              <SwiperSlide key={`fullscreen-${imageUrl}-${index}`}>
                <div className="swiper-zoom-container">
                  <img 
                    src={imageUrl || "/placeholder.svg"} 
                    className="w-full h-full object-contain" 
                    alt={`Product image ${index + 1}`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DOM_URL+'/src/assets/default-product.jpg';
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* <style jsx>{`
        .thumbs-swiper .swiper-slide-thumb-active {
          border-color: #4a90e2;
          opacity: 1;
        }
        
        .swiper-slide {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .swiper-button-next, .swiper-button-prev {
          background-color: rgba(255, 255, 255, 0.7);
          width: 35px;
          height: 35px;
          border-radius: 50%;
          backdrop-filter: blur(2px);
        }
        
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 16px;
          font-weight: bold;
          color: #333;
        }
      `}</style> */}
    </>
  );
}
