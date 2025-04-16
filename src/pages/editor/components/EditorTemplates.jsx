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
      className='relative w-full flex items-center justify-between border-b border-[#E4E4E7] p-2'
      style={{ backgroundColor: properties?.backgroundColor || '#fff1ff' }}
    >
      {/* 왼쪽 영역: 카테고리 + 네비게이션 */}
      <div className="flex items-center gap-4 flex-1">
        {/* 카테고리 버튼 */}
        <button
          className='z-20 p-2 bg-gray-100 rounded-md'
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          ☰
        </button>

        {/* 네비게이션 */}
        <ul className='flex gap-4'>
          {properties?.menuItems?.map((menu, index) => {
            const label = typeof menu === "string" ? menu : menu.title;
            return (
              <li key={`${label}-${index}`} className="cursor-pointer hover:underline">
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 가운데 영역: 로고 */}
      <div className='w-[60px] h-[55px] text-center relative'>
        {properties.logoUrl ? (
          <img
            className='w-full h-full object-contain'
            src={`http://localhost:5000${properties.logoUrl}`}
            alt='로고 이미지'
          />
        ) : (
          <img
            className="w-full h-full object-contain"
            src="https://placehold.co/50x50"
            alt="기본 로고 이미지"
          />
        )}
      </div>

      {/* 오른쪽 여유 영역 (비워둬도 됨) */}
      <div className="flex-1"></div>

      {/* 오버레이 */}
      {isCategoryOpen && (
        <div
          className='fixed inset-0 bg-black opacity-30 z-30'
          onClick={() => setIsCategoryOpen(false)}
        />
      )}
    </div>
  );
}
/**
 * 커스텀 헤더2
 * @returns
 */
export function TemplateHeader2({ properties }) {
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
  {properties?.menuItems.map((menu, index) => {
    const label = typeof menu === "string" ? menu : menu.title;
    return <li key={`${label}-${index}`}>{label}</li>;
  })}
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
  const { title, subtitle, backgroundColor, imageUrl } = properties || {};

  const fullImgUrl = imageUrl ? `http://localhost:5000${imageUrl}` : null;

  return (
    <div
      style={{
        backgroundColor,
        textAlign: "center",
        color: "white",
        padding: "20px",
      }}
    >
      <h2 style={{ fontSize: "28px", color: "#4294F2", fontWeight: "bold" }}>
        {title}
      </h2>
      <p>{subtitle}</p>
      <img
        src={fullImgUrl || "https://placehold.co/736x300"}
        alt="배너 이미지"
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          marginTop: "10px",
        }}
      />
    </div>
  );
}





export function Templategrid({ properties }) {
  const {
    columns = 3, 
    sortList = ["전체", "일간", "주간", "월간"],  // 기본값 설정
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
      <div key={`${product.title}-${index}`} className="p-4 border rounded-lg bg-gray-50">
        <p>{product.title}</p>
        <p>{product.price}</p>
      </div>
    ))
  ) : (
    <p>상품이 없습니다.</p>
  )}
</div>
    </div>
  );
}
// ✅ 새로운 TemplateGrid2 컴포넌트 (페이지네이션 기반)
export function TemplateGrid2({ properties }) {
  const {
    columns = 3,
    sortList = ['전체', '일간', '주간', '월간'],
    title = '인기 상품',
    products = [],
    pageSize = 9,
  } = properties;

  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(products.length / pageSize);
  const startIdx = currentPage * pageSize;
  const paginated = products.slice(startIdx, startIdx + pageSize);

  return (
    <div className="relative cursor-move py-[50px]">
      <h2 className="text-[1.8rem] text-center">{title}</h2>

      {/* 정렬 리스트 */}
      <SortList sortList={sortList} />

      {/* 상품 그리드 */}
      <div
        className="grid gap-4 mt-4"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {paginated.length > 0 ? (
          paginated.map((product, index) => (
            <div
              key={`${product.title}-${index}`}
              className="p-4 border rounded-lg bg-gray-50"
            >
              <p>{product.title}</p>
              <p>{product.price}</p>
            </div>
          ))
        ) : (
          <p>상품이 없습니다.</p>
        )}
      </div>

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-center gap-4 mt-6">
        {currentPage > 0 && (
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            이전
          </button>
        )}
        {currentPage < totalPages - 1 && (
          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            다음
          </button>
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



// 텍스트 박스 요소
export function TemplateText({ properties }) {
  const {
    content = '기본 텍스트입니다.',
    fontSize = '16px',
    fontWeight = 'normal',
    color = '#000000',
    textAlign = 'left',
  } = properties;

  return (
    <div
      className="w-full p-4"
      style={{
        fontSize,
        fontWeight,
        color,
        textAlign,
      }}
    >
      {content}
    </div>
  );
}

// 이미지 박스 요소
export function TemplateImage({ properties }) {
  const {
    imageUrl = 'https://placehold.co/400x200',
    alt = '이미지',
    borderRadius = '0px', // ✅ 둥근 정도 props로 받을 수 있도록 추가
  } = properties;

  const fullImgUrl = imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;

  return (
    <div className="w-full h-full overflow-hidden">
      <img
        src={fullImgUrl}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'fill', // ✅ 이미지 비율 유지하지 않고 꽉 채우기
          display: 'block',
          borderRadius: borderRadius, // ✅ 둥근 정도 반영
        }}
      />
    </div>
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
  sortList: ["전체", "일간", "주간", "월간"],
  products: products,
};

<Templategrid properties={properties} />

// ColorBox 요소

export function TemplateColorBox({ properties }) {
  const {
    backgroundColor = '#eeeeee',
    height = '100vh', // 전체 배경처럼 사용 시
    borderRadius = '0px',
  } = properties || {};

  return (
    <div
      className="absolute left-0 top-0 w-full"
      style={{
        backgroundColor,
        height,
        borderRadius,
        zIndex: 0,
      }}
    />
  );
}