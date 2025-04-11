import { useEffect, useState } from 'react';
import { IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import SellerCategorySelector from '../pages/SellerCategorySelector';
import { getCategories } from '../../../../services/category.service';
import useToggle from '../../../../hooks/useToggle';
import SellerProductPriceSelector from '../pages/SellerProductPriceSelector';

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
  const [minStock, setMinStock] = useState(0)
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
    toastInfo("이미지는 최대 8장 까지만 가능합니다.");
    return;
  }

  setImages(files); // 원본 파일 상태 저장

  // 미리보기 초기화
  setImagePreviews([]);

  const readers = fileArray.map((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(`Failed to read file: ${file.name}`);
        }
      };
      reader.onerror = () => reject(`Error reading file: ${file.name}`);
      reader.readAsDataURL(file);
    });
  });

  // 모든 파일 읽은 후 한 번에 상태 업데이트
  Promise.all(readers)
    .then((results) => {
      setImagePreviews(results); // 한 번에 이미지 URL 리스트로 반영
    })
    .catch((err) => {
      console.error("이미지 파일 읽기 오류:", err);
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
        className='overflow-y-auto overflow-x-hidden max-h-[600px] bg-white rounded-2xl text-black w-full max-w-lg p-6 shadow-xl animate-slideUp relative'
      >
        <h2 className='text-xl font-semibold mb-6 text-center'>상품 추가</h2>
        <button onClick={onToggle} className='absolute top-3 right-3 text-2xl' title='닫기 버튼'>
          <IoCloseCircle />
        </button>

        {/* 상품명 */}
        <div className='mb-5'>
          <Label label='상품명' className='mb-1 text-sm' />
          <Input
            type='text'
            name='name'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
            required
          />
        </div>

        {/* 가격 */}
        <div className='sm:space-x-4 mb-5'>
          <div className='flex-1'>
            <div className='flex justify-between items-center mb-1'>
              <Label label='가격' className='text-sm' />
              <button
                type='button'
                onClick={onToggledPriceSelector}
                className='text-xs text-white bg-black px-2 py-0.5 rounded hover:opacity-80'
              >
                할인설정
              </button>
            </div>
            <ul className='text-xs text-gray-500 space-y-0.5 pl-2'>
              <li>원본 가격: {originPrice || '-'}</li>
              <li>할인 가격: {price || '-'}</li>
              <li>할인율: {discountRate || '-'}%</li>
            </ul>

            <SellerProductPriceSelector
              isOpen={isOpenPriceSelector}
              onToggle={onToggledPriceSelector}
              onSave={onSavePrice}
            />
          </div>
        </div>

        {/* 재고 */}
        <div className='mb-5'>
          <Label label='재고(현재 재고, 최소 재고)' className='mb-1 text-sm' />
          <div className='flex gap-3'>
            <input
              type='number'
              name='stock'
              value={stock}
              placeholder='재고'
              onChange={(e) => setStock(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
              required
            />
            <input
              type='number'
              name='minStock'
              placeholder='최소 재고'
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
              required
            />
          </div>
        </div>

        {/* 유통기한 */}
        <div className='mb-5'>
          <Label label='유통기한 (선택)' className='mb-1 text-sm' />
          <input
            type='date'
            name='expiryDate'
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
          />
        </div>

        {/* 카테고리 */}
        <div className='mb-5'>
          <Label label='카테고리' className='mb-1 text-sm' />
          <p
            onClick={onToggleCategorySelector}
            className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer pl-1'
          >
            선택된 카테고리: <span className='font-medium'>{category.name || '없음'}</span>
          </p>
          <SellerCategorySelector
            categories={categories}
            onCancel={onToggleCategorySelector}
            onSave={handleSaveCategory}
            isOpen={isOpenCategorySelector}
          />
        </div>

        {/* 설명 */}
        <div className='mb-5'>
          <Label label='상품 설명' className='mb-1 text-sm' />
          <textarea
            name='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none'
            required
          />
        </div>

        {/* 이미지 업로드 */}
        <div className='mb-6'>
          <Label label='상품 이미지' className='mb-1 text-sm' />
          <div className='relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden'>
            <input
              type='file'
              accept='image/*'
              multiple
              name='upload'
              onChange={handleImageChange}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
            <div className='flex items-center justify-center w-full h-full gap-3'>
            {imagePreviews.length > 0 ? (
                imagePreviews.map((img) => {
                  return (
                    <img
                      key={img}
                      src={img}
                      alt='상품 미리보기'
                      className='h-full max-h-20 w-20 object-contain rounded-lg border p-1 border-gray-200 bg-gray-50'
                    />
                  );
                })
              ) : (
                <IoImageOutline className='text-gray-400 text-4xl' />
              )}
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='w-full bg-[#4294F2] text-white py-3 font-semibold rounded-lg hover:bg-blue-500 transition'
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default SellerRegisterForm;
