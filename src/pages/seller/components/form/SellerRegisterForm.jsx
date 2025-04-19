import { useEffect, useState } from 'react';
import {
  X,
  ImageIcon,
  Calendar,
  Tag,
  Package2,
  DollarSign,
  FileText,
  AlertCircle,
  Plus,
} from 'lucide-react';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import SellerCategorySelector from '../pages/SellerCategorySelector';
import { getCategories } from '../../../../services/category.service';
import useToggle from '../../../../hooks/useToggle';
import SellerProductPriceSelector from '../pages/SellerProductPriceSelector';
import { toastError } from '../../../../components/toast/CustomToast';
import { getImagePreviewReaders } from '../../../../utils/imageUtil';

function SellerRegisterForm({ onSubmit, onToggle }) {
  const { onToggle: onToggleCategorySelector, isOpen: isOpenCategorySelector } = useToggle();
  const { onToggle: onToggledPriceSelector, isOpen: isOpenPriceSelector } = useToggle();

  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState({ id: 0, name: '' });
  const [categories, setCategories] = useState([]);

  const [price, setPrice] = useState('');
  const [originPrice, setOriginPrice] = useState('');
  const [discountRate, setDiscountRate] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);
  const [images, setImages] = useState([]);

  const getCategoriesFetch = async () => {
    try {
      const categories = await getCategories();
      setCategories(categories);
    } finally {
      console.log(1111);
    }
  };

  const onSavePrice = ({ discountedPrice, originPrice, discountRate }) => {
    setPrice(discountedPrice);
    setOriginPrice(originPrice);
    setDiscountRate(discountRate);
  };

  const handleSaveCategory = (selectCategory) => {
    setCategory(selectCategory);
    onToggleCategorySelector();
  };

  // 이미지 업로드 처리
  const handleImageChange = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    if (fileArray.length > 8) {
      toastError('이미지는 최대 8장 까지만 가능합니다.');
      return;
    }

    setImages(files); // 원본 파일 상태 저장

    // 미리보기 초기화
    setImagePreviews([]);

    const readers = getImagePreviewReaders(fileArray);

    // 모든 파일 읽은 후 한 번에 상태 업데이트
    Promise.all(readers)
      .then((results) => {
        setImagePreviews(results); // 한 번에 이미지 URL 리스트로 반영
      })
      .catch((err) => {
        console.error('이미지 파일 읽기 오류:', err);
      });
  };

  // 폼 전송
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, images, category.name);
    onToggle();
  };

  useEffect(() => {
    getCategoriesFetch();
  }, []);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn'>
      <form
        onSubmit={handleSubmit}
        className='overflow-y-auto overflow-x-hidden max-h-[80vh] bg-white rounded-2xl text-black w-full max-w-lg p-6 shadow-xl animate-slideUp relative'
      >
        {/* 헤더 */}
        <div className='flex items-center justify-between mb-6 pb-4 border-b border-gray-200'>
          <h2 className='text-xl font-bold text-gray-800 flex items-center'>
            <Plus className='w-5 h-5 mr-2 text-gray-600' />
            상품 추가
          </h2>
          <button
            onClick={onToggle}
            type='button'
            className='text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors'
            title='닫기'
          >
            <X className='w-5 h-5' />
          </button>
        </div>

        {/* 상품명 */}
        <div className='mb-5'>
          <Label
            label='상품명'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <Tag className='w-4 h-4 mr-1.5 text-gray-500' />
            상품명
          </Label>
          <Input
            type='text'
            name='name'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400'
            required
          />
        </div>

        {/* 가격 */}
        <div className='mb-5'>
          <div className='flex justify-between items-center mb-1.5'>
            <Label label='가격' className='text-sm font-medium flex items-center text-gray-700'>
              <DollarSign className='w-4 h-4 mr-1.5 text-gray-500' />
              가격 정보
            </Label>
            <button
              type='button'
              onClick={onToggledPriceSelector}
              className='text-xs text-white bg-gray-600 px-3 py-1 rounded-md hover:bg-gray-700 transition-colors'
            >
              할인설정
            </button>
          </div>
          <div className='bg-gray-50 p-3 rounded-lg border border-gray-200'>
            <ul className='text-sm text-gray-600 space-y-1.5'>
              <li className='flex justify-between'>
                <span>원본 가격:</span>
                <span className='font-medium'>{originPrice || '-'}원</span>
              </li>
              <li className='flex justify-between'>
                <span>할인 가격:</span>
                <span className='font-medium text-gray-800'>{price || '-'}원</span>
              </li>
              <li className='flex justify-between'>
                <span>할인율:</span>
                <span className={`font-medium ${discountRate > 0 ? 'text-red-500' : ''}`}>
                  {discountRate || '-'}%
                </span>
              </li>
            </ul>
          </div>

          {/* 상품 할인률 설정 모달 */}
          <SellerProductPriceSelector
            isOpen={isOpenPriceSelector}
            onToggle={onToggledPriceSelector}
            onSave={onSavePrice}
          />
        </div>

        {/* 재고 */}
        <div className='mb-5'>
          <Label
            label='재고'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <Package2 className='w-4 h-4 mr-1.5 text-gray-500' />
            재고 관리
          </Label>
          <div className='grid grid-cols-2 gap-3'>
            <div>
              <div className='text-xs text-gray-500 mb-1 ml-1'>현재 재고</div>
              <input
                type='number'
                name='stock'
                value={stock}
                placeholder='재고'
                onChange={(e) => setStock(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400'
                required
              />
            </div>
            <div>
              <div className='text-xs text-gray-500 mb-1 ml-1'>최소 재고</div>
              <input
                type='number'
                name='minStock'
                placeholder='최소 재고'
                value={minStock}
                onChange={(e) => setMinStock(e.target.value)}
                className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400'
                required
              />
            </div>
          </div>
          <div className='mt-1.5 flex items-start text-xs text-gray-500'>
            <AlertCircle className='w-3.5 h-3.5 mr-1 mt-0.5 flex-shrink-0' />
            <span>최소 재고 이하로 떨어지면 알림이 표시됩니다.</span>
          </div>
        </div>

        {/* 유통기한 */}
        <div className='mb-5'>
          <Label
            label='유통기한'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <Calendar className='w-4 h-4 mr-1.5 text-gray-500' />
            유통기한 (선택)
          </Label>
          <input
            type='date'
            name='expiryDate'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-gray-400'
          />
        </div>

        {/* 카테고리 */}
        <div className='mb-5'>
          <Label
            label='카테고리'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <Tag className='w-4 h-4 mr-1.5 text-gray-500' />
            카테고리
          </Label>
          <div
            onClick={onToggleCategorySelector}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors'
          >
            <span className='text-gray-700'>{category.name || '카테고리 선택'}</span>
            <span className='text-gray-400'>▼</span>
          </div>
          <SellerCategorySelector
            categories={categories}
            onCancel={onToggleCategorySelector}
            onSave={handleSaveCategory}
            isOpen={isOpenCategorySelector}
          />
        </div>

        {/* 설명 */}
        <div className='mb-5'>
          <Label
            label='상품 설명'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <FileText className='w-4 h-4 mr-1.5 text-gray-500' />
            상품 설명
          </Label>
          <textarea
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm h-24 resize-none focus:ring-2 focus:ring-gray-400 focus:border-gray-400'
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div className='mb-6'>
          <Label
            label='상품 이미지'
            className='mb-1.5 text-sm font-medium flex items-center text-gray-700'
          >
            <ImageIcon className='w-4 h-4 mr-1.5 text-gray-500' />
            상품 이미지
          </Label>
          <div className='relative w-full border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors'>
            <input
              type='file'
              accept='image/*'
              multiple
              name='upload'
              onChange={handleImageChange}
              className='absolute inset-0 opacity-0 cursor-pointer z-10'
            />

            {imagePreviews.length > 0 ? (
              <div className='p-4 grid grid-cols-4 gap-2'>
                {imagePreviews.map((img, index) => (
                  <div key={index} className='relative group'>
                    <img
                      src={img || '/placeholder.svg'}
                      alt='상품 미리보기'
                      className='h-16 w-full object-cover rounded-md border border-gray-200 bg-white'
                    />
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-md'></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='flex flex-col items-center justify-center h-32 gap-2'>
                <ImageIcon className='text-gray-400 w-8 h-8' />
                <p className='text-sm text-gray-500'>이미지를 업로드하려면 클릭하세요</p>
                <p className='text-xs text-gray-400'>최대 8장까지 가능</p>
              </div>
            )}
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-gray-600 text-white py-3 font-semibold rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2'
        >
          <Plus className='w-4 h-4' />
          상품 등록
        </button>
      </form>
    </div>
  );
}

export default SellerRegisterForm;
