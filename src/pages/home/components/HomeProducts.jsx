import { SwiperSlide } from "swiper/react";
import CenteredSlider from "../../../components/slide/CenteredSlider";
import { Link } from "react-router-dom"; // ✅ 수정: react-router-dom으로 변경
import React, { useState, useEffect } from 'react';

export default function HomeProducts({ title, products, customClassName }) {
  return (
    <div className={`${customClassName} w-full mb-8 sm:mb-12 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm`}>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {title}
        </h2>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center"
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
                  <div className="w-full min-w-[140px] sm:min-w-[200px] h-[180px] sm:h-[250px] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    {product.gimage ? (
                      <img
                        src={`http://localhost:5000/uploads/${product.gimage}`}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300"
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
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                </div>
                <div className="mt-2 sm:mt-3 text-center group-hover:text-gray-800 font-medium text-sm sm:text-base transition-colors line-clamp-1">
                  {product.name}
                </div>
                <div className="text-center text-xs sm:text-sm text-gray-500">
                  {product.price ? `${Number(product.price).toLocaleString()}원` : "가격 정보 없음"}
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </CenteredSlider>
      </div>
    </div>
  );
}
