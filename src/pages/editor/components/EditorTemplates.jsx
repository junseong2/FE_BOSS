import { useState } from 'react';
import SortList from '../../../components/SortList';

/**
 * 커스텀 헤더
 * @returns
 */
export function TemplateHeader({ properties }) {
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

      {/* 로고 */}
      <div className='w-[60px] h-[55px] text-center relative '>
        {properties.logoUrl ? (
          <img
            className='w-full h-full'
            src={properties.logoUrl}
            width={50}
            height={50}
            alt='로고 이미지'
          />
        ) : null}
      </div>

      {/* 네비게이션 */}
      <div className='flex items-center max-w-[300px] w-full h-[50px]'>
        <ul className='flex gap-[15px] m-0'>
          {properties?.menuItems.map((menu) => (
            <li key={menu}>{menu}</li>
          ))}
        </ul>
      </div>

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
export function TemplateBanner({ properties }) {
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
export function TemplateProductGrid({ properties }) {
  return (
    <div className='relative cursor-move py-[50px]'>
      <h2 className='text-[1.8rem] text-center'>{properties.title}</h2>

      {/* 정렬 리스트 */}
      <SortList sortList={properties.sortList} />
      <ul className='list-none'></ul>
    </div>
  );
}
