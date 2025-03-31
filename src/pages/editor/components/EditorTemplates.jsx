import { useState } from 'react';
import SortList from '../../../components/SortList';

/**
 * 커스텀 헤더
 * @returns
 */
export function TemplateHeader({ properties }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  console.log("🚀렌더링파트 헤더 Logo URL: ", properties?.logoUrl);

  return (
    <div 
      className='relative w-full flex justify-between items-center gap-2 border-b border-[#E4E4E7] p-2'
      style={{ backgroundColor: properties?.backgroundColor || '#fff1ff' }} // ✅ 배경색 적용
    >
      {/* 카테고리 버튼 */}
      <button
        className='z-20 p-2 bg-gray-100 rounded-md'
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
      >
        ☰
      </button>

      {/* 카테고리 바 */}
     
  
        <ul className='p-4'>
          {properties?.categories?.map((category) => (
            <li key={category} className='p-2 border-b cursor-pointer hover:bg-gray-100'>
              {category}
            </li>
          ))}
        </ul>
    

      {/* 로고 */}
      <div className='w-[60px] h-[55px] text-center relative'>
        {properties.logoUrl ? (
          <img
            className='w-full h-full'
            src={`http://localhost:5000${properties.logoUrl}`}  // 절대 경로 사용
            width={50}
            height={50}
            alt='로고 이미지'
          />

        ) : (
          <img
            className="w-full h-full"
            src="https://placehold.co/50x50"  // 기본 이미지 사용
            alt="기본 로고 이미지"
            width={50}
            height={50}
          />
        )}
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

  console.log("🚀렌더링파트 베너 image URL: ", properties?.imageUrl);

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
    className="w-full h-full"
    src={`http://localhost:5000${properties.imageUrl}`}  // 절대 경로 사용
    alt="배너 이미지"
    width={1024}
    height={300}
  />
) : (
  <img
    className="w-full h-full"
    src="https://placehold.co/736x300"  // 기본 이미지 사용
    alt="기본 배너 이미지"
    width={1024}
    height={300}
  />
)}




      </figure>
    </div>
  );
}

export function Templategrid({ properties }) {
  const {
    columns = 3, 
    sortList = ["실시간", "일간", "주간", "월간"],  // 기본값 설정
    title = "추천 상품 제목", // title이 없으면 기본값 사용
    products = []  // 기본값 설정
  } = properties;

  // title이 문자열이 아닌 경우 기본값을 사용하도록 설정
  const renderTitle = typeof title === "string" ? title : "기본 상품 제목"; 

  // 그리드의 컬럼 수에 맞춰 스타일 적용
  const gridStyle = {
    gridTemplateColumns: `repeat(${columns}, 1fr)`,  // 컬럼 수에 맞는 grid template 스타일 적용
  };

  return (
    <div className="relative cursor-move py-[50px]">
      <h2 className="text-[1.8rem] text-center">{renderTitle}</h2> {/* title이 없으면 기본값 사용 */}

      {/* 정렬 리스트 */}
      <SortList sortList={sortList} />  {/* sortList가 없으면 기본값 사용 */}
      
      {/* 상품 그리드 */}
      <div className="grid gap-4 mt-4" style={gridStyle}>
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <p>{product.name}</p>  {/* 상품 이름 */}
              <p>{product.price}</p>  {/* 상품 가격 */}
            </div>
          ))
        ) : (
          <p>상품이 없습니다.</p> 
        )}
      </div>
    </div>
  );
}


export function TemplateBlank({ properties }) {
  const {
    height = 100, // 기본 높이값 설정 (px 단위)
    backgroundColor = '#ffffff' // 기본 배경색
  } = properties || {};

  return (
    <div
      className="w-full"
      style={{
        height: `${height}px`,
        backgroundColor,
      }}
    />
  );
}

// 예시 데이터
const products = [
  { name: '상품 1', price: '$10' },
  { name: '상품 2', price: '$20' },
  { name: '상품 3', price: '$30' },
];

const properties = {
  title: "추천 상품",
  columns: 3,
  sortList: ["실시간", "일간", "주간", "월간"],
  products: products,
};

<Templategrid properties={properties} />
