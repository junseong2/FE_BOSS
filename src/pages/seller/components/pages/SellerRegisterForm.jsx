import { useState } from 'react';
import { IoCloseCircle, IoImageOutline } from 'react-icons/io5'; // 이미지 업로드 아이콘
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';

function SellerRegisterForm({ onSubmit, onToggle }) {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [images, setImages] = useState([]);

  const categories = [
    '식품',
    '음료',
    '생활용품',
    '미용/건강',
    '도시락/즉석식',
    '과자/스낵',
    '라면/면류',
    '탄산음료',
    '커피',
    '생수/이온음료',
    '우유/두유',
  ];

  // 프리뷰 이미지 설정
  const handleImageChange = (e) => {
    setImages(e.target.files); // 다중 이미지 상태 관리

    // 프리뷰 이미지 설정
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 상품 추가 정보 전송
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, images);
    onToggle();
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn'>
      <form
        onSubmit={handleSubmit}
        className='bg-white rounded-lg text-black w-full max-w-lg p-6 shadow-xl animate-slideUp relative'
      >
        <h2 className='text-xl font-semibold mb-6 text-center '>상품 추가</h2>
        <button onClick={onToggle} className='absolute top-3 right-3 text-2xl' title='닫기 버튼'>
          <IoCloseCircle />
        </button>

        {/* 상품명 */}
        <div className='mb-4'>
          <Label className='block mb-1 text-sm' label={'상품명'}></Label>
          <Input
            type='text'
            name='name'
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className='w-full px-2 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm'
            required
          />
        </div>

        {/* 가격 */}
        <div className='flex flex-col sm:flex-row sm:gap-4 sm:space-x-4 mb-4'>
          <div className='flex-1'>
            <Label className='block mb-1 text-sm' label={'가격'} />
            <Input
              type='number'
              value={price}
              name='price'
              onChange={(e) => setPrice(e.target.value)}
              className='w-full px-2 py-2 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm'
              required
            />
          </div>

          {/* 재고 */}
          <div className='flex-1'>
            <Label className='block mb-1 text-sm' label={'재고'} />
            <input
              type='number'
              value={stock}
              name='stock'
              onChange={(e) => setStock(e.target.value)}
              className='w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm'
              required
            />
          </div>
        </div>

        {/* 카테고리 */}
        <div className='mt-4 mb-4'>
          <Label className='block mb-1 text-sm' label={'카테고리'} />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            name='category'
            className='w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm'
            required
          >
            <option value=''>카테고리를 선택하세요</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* 상품설몀 */}
        <div className='mt-4 mb-4'>
          <Label className='block mb-1 text-sm' label={'상품 설명'} />
          <textarea
            value={description}
            name='description'
            onChange={(e) => setDescription(e.target.value)}
            className='w-full p-2 border border-gray-300 bg-white text-gray-800 rounded-lg text-sm h-24'
            required
          />
        </div>

        {/* 이미지 업로드 영역 */}
        <div className='mt-4 mb-4'>
          <Label className='block mb-1 text-sm' label={'상품 이미지'} />

          {/* 미리보기 이미지 */}

          <div className='relative w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer overflow-hidden'>
            <input
              type='file'
              accept='image/*'
              multiple
              name='upload'
              onChange={handleImageChange}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
            <div className='flex items-center justify-center w-full h-full'>
              {imagePreview ? (
                <div className='mt-4 max-w-24 mx-auto'>
                  <img
                    src={imagePreview}
                    alt='상품 미리보기'
                    className='w-full h-auto rounded-lg object-contain'
                  />
                </div>
              ) : (
                <IoImageOutline className='text-gray-400 text-4xl' />
              )}
            </div>
          </div>
        </div>

        <button
          type='submit'
          className='mt-6 w-full bg-[#4294F2] font-semibold py-3 text-white cursor-pointer rounded-lg hover:bg-blue-500 transition'
        >
          등록
        </button>
      </form>
    </div>
  );
}

export default SellerRegisterForm;
