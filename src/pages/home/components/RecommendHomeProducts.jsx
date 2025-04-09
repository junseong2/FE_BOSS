import { SwiperSlide } from "swiper/react"
import CenteredSlider from "../../../components/slide/CenteredSlider"
import { Link } from "react-router-dom"

export default function RecommendHomeProducts({ title, products, customClassName }) {
  return (
    <div
      className={`${customClassName} w-full mb-8 sm:mb-12 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm relative overflow-hidden`}
    >
      {/* Decorative elements - hidden on smallest screens */}
      <div className="hidden sm:block absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-pink-200 to-transparent rounded-full -mr-20 -mt-20 opacity-50"></div>
      <div className="hidden sm:block absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-200 to-transparent rounded-full -ml-20 -mb-20 opacity-50"></div>

      <div className="relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              {title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">회원님의 취향에 맞게 선별된 상품입니다</p>
          </div>
          <Link
            to="/recommendations"
            className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center mt-2 sm:mt-0"
          >
            더보기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 ml-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="mt-3 sm:mt-5">
          <CenteredSlider>
            {products?.map((product) => (
              <SwiperSlide key={product.productId}>
                <Link to={`/product/${product.productId}`} className="group block">
                  <div className="relative overflow-hidden rounded-lg sm:rounded-xl shadow-sm transition-all duration-300 group-hover:shadow-md">
                    <div className="w-full min-w-[140px] sm:min-w-[200px] h-[180px] sm:h-[250px] bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 sm:h-16 sm:w-16 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="absolute top-2 right-2 bg-pink-100 text-pink-600 text-xs font-medium px-2 py-0.5 rounded-full">
                      추천
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                  <div className="mt-2 sm:mt-3 text-center group-hover:text-gray-800 font-medium text-sm sm:text-base transition-colors line-clamp-1">
                    {product.name}
                  </div>
                  <div className="text-center text-xs sm:text-sm font-medium text-purple-600">
                    {product.price ? `${product.price.toLocaleString()}원` : ""}
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </CenteredSlider>
        </div>
      </div>
    </div>
  )
}

