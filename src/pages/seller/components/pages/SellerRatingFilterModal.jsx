import { useState, useRef, useEffect } from 'react';
import { Filter } from 'lucide-react';

export default function SellerRatingFilterModal({ onFilter }) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef(null);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const ratings = [null, '1점', '2점', '3점', '4점', '5점'];

  return (
    <div className='relative font-sans' ref={modalRef}>
      {/* 필터 버튼 */}
      <button
        className='flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer'
        onClick={toggleModal}
      >
        <Filter className='w-4 h-4 mr-2' />
        <span>필터</span>
      </button>

      {/* 모달 */}
      {isOpen && (
        <div className='absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded shadow-lg z-10'>
          <div className='px-3 py-2 text-sm font-medium text-gray-700'>평점 필터</div>
          <div className='border-t border-gray-100'>
            {ratings.map((rating, index) => (
              <button
                onClick={() => onFilter(index ? index : null)}
                key={`rating-${index}`}
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
              >
                {rating ? rating : '전체 평점'}
              </button>
            ))}
          </div>
          {/* <div className='border-t border-gray-100 mt-2'>
            <div className='px-3 py-2 text-sm font-medium text-gray-700'>기간 필터</div>
            {periods.map((period, index) => (
              <button
                key={`period-${index}`}
                className='block w-full text-left px-4 py-2 text-sm hover:bg-gray-100'
              >
                {period}
              </button>
            ))}
          </div> */}
        </div>
      )}
    </div>
  );
}
