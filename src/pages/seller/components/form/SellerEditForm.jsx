import { useEffect, useState } from 'react';
import { IoCloseCircle, IoImageOutline } from 'react-icons/io5';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import SellerCategorySelector from '../pages/SellerCategorySelector';
import { getCategories } from '../../../../services/category.service';
import useToggle from '../../../../hooks/useToggle';
import SellerProductPriceSelector from '../pages/SellerProductPriceSelector';
import { toastInfo } from '../../../../components/toast/CustomToast';

function SellerEditForm({ onUpdateSubmit, onToggle, oldProduct }) {
  const { onToggle: onToggleCategorySelector, isOpen: isOpenCategorySelector } = useToggle();
  const { onToggle: onToggledPriceSelector, isOpen: isOpenPriceSelector } = useToggle();

  const [category, setCategory] = useState({ id: 0, name: oldProduct.categoryName });
  const [categories, setCategories] = useState([]);
  const [price, setPrice] = useState(0);
  const [originPrice, setOriginPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);
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

  // 선택한 카테고리 선택
  const handleSaveCategory = (selectCategory) => {
    setCategory(selectCategory);
    onToggleCategorySelector();
  };

  // 이미지 업로드 처리
  const handleImageChange = (e) => {
    const files = e.target.files;
    setImages(files); // 이미지 상태 저장
  
    // 미리보기 배열 초기화
    setImagePreviews([]);
  
    if (files?.length > 0) {
      const fileArray = Array.from(files);


      if(fileArray.length>8){
        return toastInfo("이미지는 최대 8장 까지만 가능합니다.")
      }
  
      fileArray.forEach((file) => {
        const reader = new FileReader();
  
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
  
        reader.readAsDataURL(file);
      });
    }
  };
  
  // 폼 전송
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateSubmit(e, oldProduct.productId, images, category.name || oldProduct.categoryName);
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
        <h2 className='text-xl font-semibold mb-6 text-center'>상품 수정</h2>
        <button onClick={onToggle} className='absolute top-3 right-3 text-2xl' title='닫기 버튼'>
          <IoCloseCircle />
        </button>

        {/* 상품명 */}
        <div className='mb-5'>
          <Label label='상품명' className='mb-1 text-sm' />
          <Input
            type='text'
            name='name'
            value={oldProduct.name}
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
              <li>원본 가격: {originPrice || oldProduct.originPrice || '-'}</li>
              <li>할인 가격: {price || oldProduct.price || '-'}</li>
              <li>할인율: {discountRate || oldProduct.discountRate || '-'}%</li>
            </ul>

            <SellerProductPriceSelector
              oldPrice={oldProduct.price}
              oldOriginPrice={oldProduct.originPrice}
              oldDiscountRate={oldProduct.discountRate}
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
              defaultValue={oldProduct.stock}
              placeholder='재고'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm'
              required
            />
            <input
              type='number'
              name='minStock'
              placeholder='최소 재고'
              defaultValue={oldProduct.minStock}
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
            defaultValue={oldProduct.expiryDate?.split('T')[0]}
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
            <input
              className='hidden'
              name='category'
              value={category.name || oldProduct.categoryName}
            />
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
            defaultValue={oldProduct.description}
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
                      className='h-full max-h-20 w-20 object-contain rounded-lg border p-1 border-gray-200 bg-gray-100'
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

export default SellerEditForm;
