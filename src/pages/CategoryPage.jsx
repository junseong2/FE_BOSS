import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { Filter } from "lucide-react";

// 기본 버튼
const Button = ({ children, variant, className = "", ...props }) => {
  const baseStyle = "px-4 py-2 border rounded text-sm";
  return (
    <button
      className={`${baseStyle} ${variant === "outline" ? "border-gray-300" : "bg-black text-white"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// 체크박스 컴포넌트
const Checkbox = ({ id, checked, onChange }) => (
  <input id={id} type="checkbox" checked={checked} onChange={onChange} className="w-4 h-4" />
);

const BASE_IMAGE_URL = 'http://localhost:5000/uploads';
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;

const getFirstImageUrl = (product) => {
  const gimage = product.gImage || product.gimage || product.g_image;
  if (!gimage) return DEFAULT_IMAGE_PATH;
  const list = Array.isArray(gimage) ? gimage : gimage.split(',').map((img) => img.trim());
  return `${BASE_IMAGE_URL}/${list[0]}`;
};

export default function CategoryPage() {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [sortOrder, setSortOrder] = useState('recommend');
  const [showFilter, setShowFilter] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/products/category/${categoryId}?sort=${sortOrder}`);
      setProducts(response.data);
    } catch (error) {
      console.error('❌ 상품 불러오기 실패:', error);
    }
  }, [categoryId, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error('❌ 카테고리 이름 불러오기 실패:', error);
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  const handleSortChange = (order) => {
    setSortOrder(order);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-center">카테고리: {categoryName || '로딩 중...'}</h1>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className="flex items-center gap-2 border-gray-300"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Filter className="h-4 w-4" />
            {showFilter ? '필터 닫기' : '필터 열기'}
          </Button>
          <div className="text-sm text-gray-500">
            {products.length}개 제품
          </div>
        </div>
      </div>

      <div className="w-full px-0 py-6">
        <div className="flex flex-col md:flex-row">

          {/* 필터 영역 */}
          {showFilter && (
            <div className="md:w-64 w-full px-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <Checkbox id="recommend" checked={sortOrder === 'recommend'} onChange={() => handleSortChange('recommend')} />
                  <span>추천순</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox id="popular" checked={sortOrder === 'popular'} onChange={() => handleSortChange('popular')} />
                  <span>판매순</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox id="low" checked={sortOrder === 'low'} onChange={() => handleSortChange('low')} />
                  <span>가격 낮은 순</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox id="high" checked={sortOrder === 'high'} onChange={() => handleSortChange('high')} />
                  <span>가격 높은 순</span>
                </label>
                <label className="flex items-center space-x-2">
                  <Checkbox id="latest" checked={sortOrder === 'latest'} onChange={() => handleSortChange('latest')} />
                  <span>최신 등록 순</span>
                </label>
              </div>
            </div>
          )}

          {/* 상품 목록 */}
          <div className="flex-1 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.productId}
                    onClick={() => navigate(`/product/${product.productId}`)}
                    className="group cursor-pointer p-4 border border-gray-200 rounded-xl bg-white text-center shadow-sm transition hover:shadow-lg hover:-translate-y-1 hover:scale-105"
                  >
                    <img
                      src={getFirstImageUrl(product)}
                      alt={product.name}
                      onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_PATH)}
                      className="w-full h-60 object-cover rounded-lg"
                    />
                    <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                    <p className="text-gray-800 mt-1 font-medium">{product.price.toLocaleString()}원</p>
                  </div>
                ))
              ) : (
                <p className="col-span-full text-center text-gray-500">상품이 없습니다.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
