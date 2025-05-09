import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import {
  IoHomeOutline,
  IoInformationOutline,
  IoHelpCircleOutline,
  IoGiftOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from 'react-icons/io5';
import { useMenuToggleStore } from './store/toggleStore';
import { getCategories } from './services/category.service';

function MenuBar() {
  const [categories, setCategories] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  const { open, setOpen } = useMenuToggleStore();


  /** 카테고리(대/중분류) 목록 조회 */
  async function getCategoriesFetch() {
    const categories = await getCategories()
    setCategories(categories);
  }


  /** 서브 카테고리  */
  const handleCategoryClick = async (categoryId, subCategories) => {
    console.log(categoryId, subCategories)
    if (openSubMenu?.parentCategoryId === categoryId) {
      setOpenSubMenu(null);
    } else {
      setOpenSubMenu({ parentCategoryId: categoryId, subCategories });
    }
  }

  useEffect(() => {
    getCategoriesFetch();
  }, []);

  return (
    <>
      <div className={`${open ? 'visible opacity-100' : 'invisible opacity-0'} fixed leading-0 bg-[rgba(0,0,0,0.3)] w-full h-full z-[100] transition`}></div>
      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[280px] bg-white shadow-xl z-[101] transition-transform duration-300 ease-in-out transform ${open ? 'translate-x-0' : '-translate-x-full'
          } overflow-y-auto`}
      >

        <div className='flex items-center justify-between px-4 py-3 bg-blue-600 text-white'>
          <h2 className='text-lg font-bold'>메뉴</h2>
          <button
            onClick={setOpen}
            className='text-white hover:text-gray-200 transition-colors p-2'
            aria-label='메뉴 닫기'
          >
            <FaTimes className='text-lg' />
          </button>
        </div>

        <div className='py-1'>
          <Link
            to='/'
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === '/' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3' : ''}`}
          >
            <IoHomeOutline className='text-lg mr-3' />
            <span className='font-medium text-sm'>홈</span>
          </Link>

          <Link
            to='/about'
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === '/about' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3' : ''}`}
          >
            <IoInformationOutline className='text-lg mr-3' />
            <span className='font-medium text-sm'>소개</span>
          </Link>

          <Link
            to='/contact'
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === '/contact' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3' : ''}`}
          >
            <IoHelpCircleOutline className='text-lg mr-3' />
            <span className='font-medium text-sm'>FAQ</span>
          </Link>

          <Link
            to='/event'
            className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === '/event' ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3' : ''}`}
          >
            <IoGiftOutline className='text-lg mr-3' />
            <span className='font-medium text-sm'>이벤트상품</span>
          </Link>

          <div className='my-1 border-t border-gray-200'></div>

          <div className='px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider'>
            카테고리
          </div>

          {categories.map((category) => (
            <div key={category.id} className='relative'>
              <div
                className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${location.pathname === `/category/${category.id}` ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3' : ''}`}
                onClick={() => handleCategoryClick(category.id, category.subCategories)}
              >
                <span className='font-medium text-sm'>{category.name}</span>
                {openSubMenu?.parentCategoryId === category.id && openSubMenu.subCategories?.length > 0 ? (
                  <IoChevronDownOutline className='text-gray-400' />
                ) : (
                  <IoChevronForwardOutline className='text-gray-400' />
                )}
              </div>

              {openSubMenu?.parentCategoryId === category.id && openSubMenu.subCategories?.length > 0 && (
                <div className='bg-gray-50 py-1'>
                  {openSubMenu.subCategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/category/${sub.id}`}
                      className={`flex items-center pl-10 pr-4 py-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === `/category/${sub.id}` ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-9' : ''}`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className='my-1 border-t border-gray-200'></div>
        </div>
      </div>
    </>
  );
}

export default MenuBar;
