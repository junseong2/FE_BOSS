import { useState } from 'react';
import SortList from '../../../components/SortList';

/**
 * 커스텀 헤더
 * @returns
 */


export function TemplateHeader({ properties }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const {
    backgroundColor = '#fff1ff',
    size = { web: { width: '100%', height: '80px' } },
    logoUrl,
    menuItems = [],
  } = properties || {};
  const { width = '100%', height = '80px' } = size.web || {};

  return (
    <div
      className='relative flex items-center justify-between border-b border-[#E4E4E7] p-2'
      style={{ backgroundColor, width, height }} // ✅ 사이즈 반영
    >
      {/* 왼쪽 영역 */}
      <div className="flex items-center gap-4 flex-1">
        <button
          className='z-20 p-2 bg-gray-100 rounded-md'
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
        >
          ☰
        </button>

        <ul className='flex gap-4'>
          {menuItems.map((menu, index) => {
            const label = typeof menu === "string" ? menu : menu.title;
            return (
              <li key={`${label}-${index}`} className="cursor-pointer hover:underline">
                {label}
              </li>
            );
          })}
        </ul>
      </div>

      {/* 로고 */}
      <div className='w-[60px] h-[55px] text-center relative'>
        <img
          className='w-full h-full object-contain'
          src={logoUrl ? `http://localhost:5000${logoUrl}` : "https://placehold.co/50x50"}
          alt='로고 이미지'
        />
      </div>

      <div className="flex-1" />

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
 */export function TemplateHeader2({ properties }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const {
    backgroundColor = '#fff1ff',
    size = { web: { width: '100%', height: '80px' } },
    logoUrl,
    menuItems = [],
    categories = [],
  } = properties || {};
  const { width = '100%', height = '80px' } = size.web || {};

  return (
    <div
      className='relative flex justify-between items-center gap-2 border-b border-[#E4E4E7] p-2'
      style={{ backgroundColor, width, height }} // ✅ 사이즈 반영
    >
      {/* 카테고리 버튼 */}
      <button
        className='z-20 p-2 bg-gray-100 rounded-md'
        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
      >
        ☰
      </button>

      {/* 카테고리 목록 */}
      {isCategoryOpen && (
        <ul className='p-4 absolute top-full left-0 bg-white z-40 shadow-lg'>
          {categories.map((category) => (
            <li key={category} className='p-2 border-b cursor-pointer hover:bg-gray-100'>
              {category}
            </li>
          ))}
        </ul>
      )}

      {/* 로고 */}
      <div className='w-[60px] h-[55px] text-center relative'>
        <img
          className='w-full h-full'
          src={logoUrl ? `http://localhost:5000${logoUrl}` : "https://placehold.co/50x50"}
          alt='로고 이미지'
        />
      </div>

      {/* 메뉴 */}
      <div className='flex items-center max-w-[300px] w-full h-[50px]'>
        <ul className='flex gap-[15px] m-0'>
          {menuItems.map((menu, index) => {
            const label = typeof menu === "string" ? menu : menu.title;
            return <li key={`${label}-${index}`}>{label}</li>;
          })}
        </ul>
      </div>

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
 */export function TemplateBanner({ properties }) {
  const { title, subtitle, backgroundColor, imageUrl } = properties || {};

  const fullImgUrl = imageUrl ? `http://localhost:5000${imageUrl}` : null;

  return (
    <div
      style={{
        backgroundColor,
        textAlign: "center",
        color: "white",
        padding: "20px",
        overflow: "hidden", // ✅ 이미지가 삐져나오지 않게
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "28px", color: "#4294F2", fontWeight: "bold" }}>
        {title}
      </h2>
      <p>{subtitle}</p>
      <div
        style={{
          width: "100%",
          maxWidth: "100%",
          overflow: "hidden", // ✅ 부모 박스 기준 넘치지 않게
        }}
      >
        <img
          src={fullImgUrl || "https://placehold.co/736x300"}
          alt="배너 이미지"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover", // ✅ 비율 유지 + 꽉 채우기
            display: "block",
            borderRadius: "8px", // ✅ 선택적으로 모서리도 둥글게
          }}
        />
      </div>
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
    borderRadius = '0px',
    size = { web: { width: '100%', height: '100vh' } }, // ✅ size.web에서 height 가져오기
  } = properties || {};

  const { width = '100%', height = '100vh' } = size.web || {};

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        backgroundColor,
        width,       // ✅ width 반영
        height,      // ✅ height도 여기서
        borderRadius,
        zIndex: 0,
      }}
    />
  );
}



