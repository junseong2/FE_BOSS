import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/shoppage.css';
function ShopPage({ sellerId }) {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('asc');
  const [categoryName, setCategoryName] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const BASE_IMAGE_URL = 'http://localhost:5000/uploads';

  const getFirstImageUrl = (gimage) => {
    if (!gimage) return '/default-product.jpg'; // ✅ 기본 이미지 설정
    const imageList = gimage.split(',').map((img) => `${BASE_IMAGE_URL}/${img.trim()}`); // ✅ `/uploads/` 추가
    return imageList[0]; // ✅ 첫 번째 이미지 반환
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user-info', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('로그인 정보 조회 실패');
        }

        const data = await response.json();
        setUserId(data.userId);

        console.log('✅ userdata:', data);
      } catch (error) {
        console.error('사용자 정보 조회 오류:', error.message);
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    if (!categoryId) return;
    console.log(`🔍 Fetching category name for ID: ${categoryId}`);
    const fetchCategoryName = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/category/${categoryId}`);
        console.log('✅ Category Name Fetched:', response.data);
        setCategoryName(response.data.name);
      } catch (error) {
        console.error('❌ 카테고리 정보를 불러오는 중 오류 발생:', error);
      }
    };
    fetchCategoryName();
  }, [categoryId]);

  useEffect(() => {
    console.log(`🔍 Fetching products for category ID: ${categoryId} and seller ID: ${sellerId}`);
    const fetchProducts = async () => {
      try {
        let url = '';
        if (sellerId) {
          url = `http://localhost:5000/seller/product?sellerId=${sellerId}`;
        } else if (categoryId) {
          url = `http://localhost:5000/products/category/${categoryId}`;
        }

        if (!url) return;

        const response = await axios.get(url);
        console.log('✅ Products Fetched:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('❌ 상품 목록을 불러오는 중 오류 발생:', error);
      }
    };
    fetchProducts();
  }, [categoryId, sellerId]);

  const sortProducts = (order) => {
    const sorted = [...products].sort((a, b) => {
      return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    setProducts(sorted);
    setSortOrder(order);
  };

  const addToCart = async (event, productId) => {
    event.stopPropagation();
    try {
      console.log(`🛒 장바구니 추가 요청: productId=${productId}`);
      const response = await fetch('http://localhost:5000/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`장바구니 추가 실패: ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ 장바구니 추가 성공:', data);
      alert('✅ 장바구니에 상품이 추가되었습니다!');
    } catch (error) {
      console.error('❌ 장바구니 추가 오류:', error);
    }
  };

  return (
    <div>
      <h1>상품 목록</h1>
      {categoryName && <h2>카테고리: {categoryName}</h2>}

      <div className='sort-buttons'>
        <button onClick={() => sortProducts('asc')} disabled={sortOrder === 'asc'}>
          가격 낮은순
        </button>
        <button onClick={() => sortProducts('desc')} disabled={sortOrder === 'desc'}>
          가격 높은순
        </button>
      </div>
      <br></br>

      <ul className='product-grid'>
        {products.length > 0 ? (
          products.map((product) => (
            <li
              key={product.productId}
              onClick={() => navigate(`/product/${product.productId}`)}
              className='product-item'
            >
              <img
                src={getFirstImageUrl(product.gimage)}
                alt={product.name}
                className='product-image'
                onError={(e) =>
                  (e.target.src = 'http://localhost:5173/src/assets/default-product.jpg')
                }
              />
              <p>{product.name}</p>
              <p>{product.description}</p>
              <p>가격: {product.price.toLocaleString()}원</p>
              {product.expiry_date && <p>유통기한: {product.expiry_date}</p>}

              <button onClick={(event) => addToCart(event, product.product_id)}>
                장바구니 추가
              </button>
            </li>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </ul>
    </div>
  );
}

export default ShopPage;
