import { useState } from 'react';
import SortList from '../../../components/SortList';
import { Link } from 'react-router-dom';
import { Home, ShoppingCart, User, MapPin } from 'lucide-react';

/**
 * 커스텀 헤더
 * @returns
 */
export function MobileTemplateHeader({ properties }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  return (
    <div className='relative w-full flex justify-between items-center gap-2 border-b border-[#E4E4E7] p-2'>
      {/* 카테고리 버튼 */}
      <button
        className='z-20 p-2 bg-gray-100 rounded-md'
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
      >
        ☰
      </button>
      {/* 카테고리 바 */}
      <div
        className={`fixed z-50 top-0 left-0 h-full w-[250px] bg-white shadow-lg transition-transform duration-300 ${
          isCategoryOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button className='p-2 text-right w-full' onClick={() => setIsCategoryOpen(false)}>
          ✕
        </button>
        <ul className='p-4'>
          {properties?.categories?.map((category) => (
            <li key={category} className='p-2 border-b cursor-pointer hover:bg-gray-100'>
              {category}
            </li>
          ))}
        </ul>
      </div>

      <div className='w-[60px] h-[55px] text-center relative flex justify-center items-center'>
  {properties.logoUrl ? (
    <img
      className='w-[50px] h-[50px]' // 고정된 크기 지정
      src={properties.logoUrl}
      alt='로고 이미지'
    />
  ) : null}
</div>
<div></div>

      {/* 오버레이 (카테고리 열렸을 때 클릭 시 닫힘) */}
      {isCategoryOpen && (
        <div
          className='fixed inset-0 bg-black opacity-30 z-30'
          onClick={() => setIsCategoryOpen(false)}
        ></div>
      )}
    </div>
  );
}

/**
 * 커스텀 배너
 * @returns
 */
export function MobileTemplateBanner({ properties }) {
  return (





    <div
      className='relative max-h-[450px] h-full w-full p-4 flex items-center justify-center cursor-move'
      style={{ backgroundColor: properties.backgroundColor }}
    >
      <figure>
        <div className='absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]  w-full flex items-center flex-col'>
          <h2 className='text-3xl'>{properties.title}</h2>
          <h3 className='text-xl mt-3'>{properties.subtitle}</h3>
        </div>
        {properties.imageUrl ? (
          <img
            className='w-full h-full'
            src={properties.imageUrl}
            alt='배너 이미지'
            width={1024}
            height={300}
          />
        ) : null}
      </figure>
    </div>




  );
}

/**
 * 커스텀 상품 섹션(상품 그리드)
 * @returns
 */
export function MobileTemplateProductGrid({ properties }) {
  return (
    <div className='relative cursor-move py-[50px]'>
      <h2 className='text-[1.8rem] text-center'>{properties.title}</h2>

      {/* 정렬 리스트 */}
      <SortList sortList={properties.sortList} />
      <ul className='list-none'></ul>
    </div>
  );
}



/**
 * 커스텀 바텀네비게이션
 * @returns
 */
export function MobileTemplateBottomNavigationBar({ properties }) {
  // 기본 네비게이션 아이템
 






  return (


<div
  className="relative max-h-[450px] h-full w-full p-4 flex justify-around items-center cursor-move"
  style={{ backgroundColor: properties.backgroundColor }}
>
  <Link to="/" className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 transition-all">
    <Home size={24} />
    <span className="text-xs md:text-sm text-gray-600">홈</span>
  </Link>
  <Link to="/category" className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 transition-all">
    <MapPin size={24} />
    <span className="text-xs md:text-sm text-gray-600">카테고리</span>
  </Link>
  <Link to="/cart" className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 transition-all">
    <ShoppingCart size={24} />
    <span className="text-xs md:text-sm text-gray-600">장바구니</span>
  </Link>
  <Link to="/mypage" className="flex flex-col items-center justify-center text-gray-700 hover:text-blue-500 transition-all">
    <User size={24} />
    <span className="text-xs md:text-sm text-gray-600">마이페이지</span>
  </Link>
</div>


  )}


