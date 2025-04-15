import { useState, useEffect } from 'react';
import { IoCalculator, IoCloseOutline } from 'react-icons/io5';

export default function SellerProductPriceSelector({
  isOpen,
  onToggle,
  onSave,
  oldPrice,
  oldDiscountRate,
  oldOriginPrice,
}) {
  const [originalPrice, setOriginalPrice] = useState(0);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [discountRate, setDiscountRate] = useState(0);

  // 고정 할인율 목록
  const discountOptions = [2, 3, 5, 10, 15, 20, 25, 30];


  //  새값 || 기존값 : 수정한 값이 없으면 기존 값을 사용하기 위함
  useEffect(() => {
    if (
      originalPrice ||
      (oldOriginPrice && discountedPrice) ||
      (oldPrice && Number(originalPrice || oldOriginPrice) > 0)
    ) {
      const original = Number(originalPrice || oldOriginPrice);
      const discounted = Number(discountedPrice || oldPrice);
      const rate = ((original - discounted) / original) * 100;
      setDiscountRate(Math.round(rate * 10) / 10);
    } else {
      setDiscountRate(0);
    }
  }, [originalPrice, discountedPrice]);

  // 할인률 적용
const applyDiscountRate = (rate) => {
  setDiscountRate(rate);
  const original = Number(originalPrice) || Number(oldOriginPrice);
  if (original > 0) {
    const discounted = original * (1 - rate / 100);
    setDiscountedPrice(Math.floor(discounted));
  }
};


  // 모달 닫기
  const handleClose = () => {
    onToggle();
  };

  // 최종 가격 저장
  const handleSave = () => {
    alert(
      `할인이 적용되었습니다: 원가 ${originalPrice || oldOriginPrice}원, 할인가 ${discountedPrice || oldPrice}원, 할인율 ${discountRate || oldDiscountRate}%`,
    );
    onToggle();
    onSave({
      originPrice: originalPrice || oldOriginPrice,
      discountedPrice: discountedPrice || oldPrice,
      discountRate: discountRate || oldDiscountRate,
    });
  };

  return (
    <div
      className={`${isOpen ? 'visible opacity-100' : 'invisible opacity-0'} z-[1000000] fixed inset-0 bg-gray-800 flex items-center justify-center transition-all`}
    >
      <div className='bg-white rounded-lg w-full max-w-md mx-4'>
        <div className='p-4 flex justify-between items-center border-b'>
          <h2 className='text-lg font-semibold'>할인가 설정</h2>
          <button onClick={handleClose} className='text-gray-500 hover:text-gray-700'>
            <IoCloseOutline size={20} />
          </button>
        </div>

        <div className='p-6'>
          <p className='text-sm text-gray-600 mb-6'>
            상품의 원가와 할인가를 입력하여 할인율을 계산하세요.
          </p>

          <div className='mb-4 flex items-center'>
            <label className='w-16 text-gray-700'>원가</label>
            <div className='relative flex-1'>
              <input
                type='number'
                value={originalPrice || oldOriginPrice}
                name='originPrice'
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className='w-full p-2 border rounded-md pr-10'
                placeholder='0'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                원
              </div>
            </div>
          </div>

          <div className='mb-4 flex items-center'>
            <label className='w-16 text-gray-700'>할인가</label>
            <div className='relative flex-1'>
              <input
                type='number'
                value={discountedPrice || oldPrice}
                name='price'
                onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                className='w-full p-2 border rounded-md pr-10'
                placeholder='0'
              />
              <div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none'>
                원
              </div>
            </div>
          </div>

          <div className='mb-4 flex items-center'>
            <label className='w-16 text-gray-700'>할인율</label>
            <div className='flex-1 flex items-center'>
              <IoCalculator size={19} className='text-gray-700' />
              <div className='text-lg font-medium'>{discountRate}%</div>
              <div className='ml-2 text-sm text-gray-500'>
                {discountRate > 0 && `(${originalPrice - discountedPrice}원 할인)`}
              </div>
            </div>
            <input className='hidden' name='discountRate' value={discountRate || oldDiscountRate} />
          </div>

          {/* 할인율 선택 리스트 */}
          <div className='mb-6'>
            <label className='block mb-2 text-gray-700'>할인율 선택</label>
            <div className='flex flex-wrap gap-2'>
              {discountOptions.map((rate) => (
                <button
                  type='button'
                  key={rate}
                  onClick={() => applyDiscountRate(rate)}
                  className={`px-4 py-2 rounded-md border ${
                    discountRate === rate
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
          </div>

          <div className='flex justify-end space-x-2'>
            <button
              type='button'
              onClick={handleClose}
              className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100'
            >
              취소
            </button>
            <button
              type='button'
              onClick={handleSave}
              className='cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600'
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
