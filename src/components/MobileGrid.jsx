import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../lib/api';

const BASE_IMAGE_URL = BASE_URL+'/uploads';
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;

function MobileGrid({
  title,
  columns = 2,
  sortList = ['daily', 'weekly', 'monthly', 'all'],
  sellerId = null,
  onItemClick,
  onAddToCart = () => {},
}) {
  const [sortType, setSortType] = useState('daily');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const fetchedMapRef = useRef({});

  const getFirstImageUrl = (gimage) => {
    if (!gimage) return DEFAULT_IMAGE_PATH;
    const imageName = gimage.includes(',') ? gimage.split(',')[0] : gimage;
    return `${BASE_IMAGE_URL}/${imageName}`;
  };

  const fetchPopularProducts = async (type) => {
    try {
      let url;
      if (sellerId) {
        url = `${import.meta.env.VITE_BACKEND_URL}/seller/products/popular?sellerId=${sellerId}&sortBy=${type}`;
      } else {
        url = `${import.meta.env.VITE_BACKEND_URL}/products/popular?sortBy=${type}`;
      }
      const res = await axios.get(url);
      setProducts(res.data);
    } catch (err) {
      console.error('🔥 인기 상품 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    if (!fetchedMapRef.current[sortType]) {
      fetchPopularProducts(sortType);
      fetchedMapRef.current[sortType] = true;
    }
  }, [sortType, sellerId]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      {/* 정렬 버튼 */}
      <div className="flex flex-wrap gap-2 mb-4">
        {sortList.map((sort) => (
          <button
            key={sort}
            onClick={() => setSortType(sort)}
            className={`px-3 py-1 rounded ${
              sortType === sort ? 'bg-black text-white' : 'bg-gray-200 text-black'
            }`}
          >
            {sort === 'daily'
              ? 'daily'
              : sort === 'weekly'
              ? 'weekly'
              : sort === 'monthly'
              ? 'monthly'
              : '전체'}
          </button>
        ))}
      </div>

      {/* 상품 목록 */}
      <div className={`grid grid-cols-${columns} gap-4`}>
        {products.map((product) => (
          <div
            key={product.productId}
            className="border rounded p-2 text-center"
            onClick={() => {
              if (onItemClick) {
                onItemClick(product);
              } else {
                navigate(`/product/${product.productId}`);
                window.scrollTo({ top: 0 });
              }
            }}
          >
            <img
              src={getFirstImageUrl(
                product.gImage || product.gimage || product.g_image || product.g_Image
              )}
              alt={product.name}
              className="w-full h-32 object-cover rounded mb-2"
              onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
            />
            <p className="text-sm font-semibold mb-2">{product.name}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(e, product.productId);
              }}
              className="bg-black text-white px-3 py-1 text-sm rounded"
            >
              장바구니
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MobileGrid;
