import { FaBars, FaTimes } from 'react-icons/fa';
import { useMenuToggleStore } from '../store/toggleStore';

/**  헤더의 메뉴 아이콘*/
export default function MenuButton() {
  const { setOpen, open } = useMenuToggleStore();

  return (
    <div
      className='flex items-center justify-center w-10 h-10 bg-white rounded-full cursor-pointer transition-all duration-300 hover:bg-gray-100'
      onClick={setOpen}
      title='카테고리 열기/닫기 아이콘'
      aria-label='메뉴 열기/닫기'
    >
      {open ? (
        <FaTimes className='text-xl transition-transform duration-300 transform rotate-90' />
      ) : (
        <FaBars className='text-xl transition-transform duration-300' />
      )}
    </div>
  );
}
