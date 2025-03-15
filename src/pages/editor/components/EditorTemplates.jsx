import SortList from '../../../components/SortList';

/**
 * 커스텀 헤더
 * @returns
 */
export function TemplateHeader({ properties }) {
  return (
    <div className='relative w-full flex justify-between items-center gap-2 border-b border-[#E4E4E7]  p-2 cursor-move'>
      {/* 팔로우 버튼 */}
      <div className='bg-[#2477d5] flex items-center justify-center max-h-[35px] w-[100px] text-[0.9rem] text-white text-center rounded-sm p-2'>
        <button>팔로우</button>
      </div>

      {/* 로고 */}
      <div className='w-[200px] text-center'>
        <img src={properties.logoUrl} alt='로고 이미지' />
      </div>

      {/* 네비게이션 */}
      <div className='flex items-center max-w-[300px] w-full h-[50px]'>
        <ul className='flex gap-[15px] m-0'>
          {properties?.menuItems.map((menu) => (
            <li key={menu}>{menu}</li>
          ))}
        </ul>
      </div>
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
        <img
          className='w-full h-full'
          src={properties.imageUrl}
          alt='배너 이미지'
          width={1024}
          height={300}
        />
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
