import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProductImageSlider from './components/ProductImageSlider';
import { IoCartOutline, IoHeartOutline } from 'react-icons/io5';
import { getProductDetail } from '../../services/product.service';
import { addToCart } from '../../services/cart.service';
import ProductReviewForm from './components/ProductReviewForm';
import { getReviews } from '../../services/review.service';
import ProductReviewList from './components/ProductReviewList';
import { Rating, ThinRoundedStar } from '@smastrom/react-rating';

const BASE_IMAGE_URL = 'http://localhost:5000/uploads'; // Spring Boot 서버 URL,차후 배포할때 수정
const DEFAULT_IMAGE_PATH = `${BASE_IMAGE_URL}/default-product.jpg`;
const PAGE_SIZE = 5;

const myStyles = {
  itemShapes: ThinRoundedStar,
  activeFillColor: '#fdc700',
  inactiveFillColor: '#fbf1a9',
  inactiveBoxBorderColor: '#F3F4F6',
};
export default function ProductDetailPage() {
  const { productId } = useParams();
  const [loadingState, setLoadingState] = useState({
    productDetail: false,
    review: false,
  });
  const [product, setProduct] = useState(null);
  const [reviewInfo, setReviewInfo] = useState({
    reviews: [],
    totalCount: 0,
    avgRating: 0,
  });
  const [quantity, setQuantity] = useState(1);

  const [activeTab, setActiveTab] = useState('상세설명');
  const [selectedColor, setSelectedColor] = useState('black');
  const [page, setPage] = useState(0);
  const [isAddReview, setIsAddReview] = useState(false);

  /** 상품 개수 증감 */
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  /** 장바구니 추가 */
  const handleAddToCart = async (event) => {
    event.stopPropagation();
    if (!product) return alert('상품을 추가해주세요.');
    await addToCart({ productId: product.productId, quantity });
  };

  /** 상품 이미지  */
  let imageList = [DEFAULT_IMAGE_PATH];

  if (product?.gimage) {
    if (typeof product.gimage === 'string') {
      imageList = product.gimage
        .split(',')
        .map((img) => img.trim())
        .filter((img) => img !== '')
        .map((img) => `${img}`); // 상대 경로 유지
    } else if (Array.isArray(product.gimage)) {
      imageList = product.gimage
        .map((img) => img.trim())
        .filter((img) => img !== '')
        .map((img) => `${img}`);
    }
  }

  if (imageList.length === 0) {
    imageList = [
      'https://picsum.photos/768/512',
      'https://picsum.photos/768/512',
      'https://picsum.photos/768/512',
      'https://picsum.photos/768/512',
      'https://picsum.photos/768/512',
      'https://picsum.photos/768/512',
    ]; // 이미지가 없을 경우 기본 이미지
  }

  // 상품 상세 조회
  const getProductDetailFetch = async (productId) => {
    setLoadingState((prev) => ({
      ...prev,
      productDetail: true,
    }));
    try {
      const data = await getProductDetail(productId);
      setProduct(data);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        productDetail: false,
      }));
    }
  };

  // 리뷰 조회
  const getReviewFetch = async (productId) => {
    setLoadingState((prev) => ({
      ...prev,
      review: true,
    }));

    try {
      const data = await getReviews({
        sortby: 'desc',
        page: page,
        size: PAGE_SIZE,
        productId,
      });

      setReviewInfo(data);
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        productDetail: false,
      }));
    }
  };

  useEffect(() => {
    getProductDetailFetch(productId);
  }, [productId]);

  useEffect(() => {
    getReviewFetch(productId);
  }, [productId, isAddReview]);

  // ✅ product가 없을 경우에는 `return` 실행
  if (!product) {
    return <p>상품 정보를 불러오는 중...</p>;
  }

  return (
    <div className='min-h-screen max-w-[1024px] w-full mx-auto  p-4 pt-20'>
      <div className=' flex flex-col md:flex-row gap-8  '>
        {/* 상품 이미지 */}
        <div className='md:w-1/2'>
          <ProductImageSlider imageList={imageList} />
        </div>

        {/* 상품 디테일 */}
        <div className='md:w-1/2 md:pt-0 pt-10'>
          <h1 className='text-3xl font-bold mb-1'>{product?.name}</h1>

          {/* 평점 */}
          <div className='flex items-center mb-4'>
            <div className='flex'>
              <Rating
                isDisabled
                
                style={{width:150, cursor:'default'}}
                halfFillMode='svg'
                itemStyles={myStyles}
                highlightOnlySelected={false}
                value={reviewInfo.avgRating || 0}
              />
            </div>
            <span className='text-gray-500 ml-2'>({reviewInfo.totalCount || 0}명이 리뷰함)</span>
          </div>

          <div className='mb-6'>
            <span className='text-3xl font-bold'>{product.price?.toLocaleString() || 0}원</span>
          </div>

          {/* 개수 */}
          <div className='mb-6'>
            <h3 className='font-semibold mb-2'>수량</h3>
            <div className='flex'>
              <button
                className='w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l'
                onClick={decreaseQuantity}
              >
                <span className='text-xl'>−</span>
              </button>
              <div className='w-10 h-10 border-t border-b border-gray-300 flex items-center justify-center'>
                {quantity}
              </div>
              <button
                className='w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r'
                onClick={increaseQuantity}
              >
                <span className='text-xl'>+</span>
              </button>
            </div>
          </div>

          {/* 사용자 액션 */}
          <div className='flex space-x-2 mb-8'>
            {/* 카트 추가 */}
            <button
              onClick={handleAddToCart}
              className='hover:bg-blue-400 cursor-pointer flex-1 bg-blue-500 text-white py-3 rounded flex items-center justify-center'
            >
              <IoCartOutline className='mr-1 w-5 h-5' />
              장바구니
            </button>
          </div>

          <div className='border border-gray-200 rounded overflow-hidden'>
            <div className='flex border-b border-gray-200'>
              {['상세설명', '배송정보'].map((tab) => (
                <button
                  key={tab}
                  className={`cursor-pointer flex-1 py-3 px-4 text-center ${activeTab === tab ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className='p-4'>
              {activeTab === '상세설명' && (
                <>
                  <p className='mb-4'>{product.description}</p>
                </>
              )}
              {activeTab === '배송정보' && (
                <ul>
                  <li className='text-gray-500'>
                    - 배송기간: {product.deliveryTime || '2~3일 소요'}
                  </li>
                  <li className='text-gray-500'>
                    - 배송비:{' '}
                    {product.deliveryFee
                      ? `${product.deliveryFee.toLocaleString()}원`
                      : '무료 배송'}
                  </li>
                  <li className='text-gray-500'>
                    - 반품 정책: {product.returnPolicy || '반품 불가'}
                  </li>
                  <li className='text-gray-500'>- 판매자: {product.seller || '알 수 없음'}</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 리뷰 작성 폼 */}
      <div>
        <ProductReviewForm productId={productId} renderTrigger={setIsAddReview} />
        <ProductReviewList reviews={reviewInfo?.reviews || []} />
      </div>
    </div>
  );
}
