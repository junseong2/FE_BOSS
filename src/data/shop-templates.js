// 📦 PC용 템플릿
export const elementTemplates = {
  header: {
    id: 'template-header',
    type: 'header',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      menuItems: [
        { title: '홈', url: '/' },
        { title: '상품', url: '/products' },
        { title: '카테고리', url: '/categories' },
        { title: '소개', url: '/about' },
        { title: '연락처', url: '/contact' },
      ],
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 0, column: 1, columnSpan: 8 },
  },
  header2: {
    id: 'template-header2',
    type: 'header2',
    name: '헤더2',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/100x60',
      menuItems: [
        { title: '홈', url: '/' },
        { title: '가게', url: '/shop' },
        { title: '상품', url: '/products' },
        { title: '카테고리', url: '/categories' },
        { title: '소개', url: '/about' },
        { title: '연락처', url: '/contact' },
      ],
      categories: [],
      backgroundColor: '#FFAECF',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 80, column: 1, columnSpan: 8 },
  },
  
  banner: {
    id: 'template-banner',
    type: 'banner',
    name: '배너',
    properties: {
      title: '쇼핑몰에 오신 것을 환영합니다',
      subtitle: '합리적인 가격의 멋진 상품을 발견하세요',
      imageUrl: 'https://placehold.co/1024x300',
      backgroundColor: '#3331',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 100, column: 1, columnSpan: 8 },
  },
  grid: {
    id: 'template-product-grid',
    type: 'grid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 200, column: 1, columnSpan: 8 },
  },
  blank: {
    id: 'template-blank',
    type: 'blank',
    name: '여백',
    version: 1,
    properties: {
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 300, column: 1, columnSpan: 8 },
  },
  text: {
    id: 'template-text',
    type: 'text',
    name: '텍스트 박스',
    properties: {
      content: '여기에 텍스트를 입력하세요.',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 400, column: 1, columnSpan: 8 },
  },
  image: {
    id: 'template-image',
    type: 'image',
    name: '이미지 박스',
    properties: {
      imageUrl: 'https://placehold.co/400x200',
      alt: '샘플 이미지',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 500, column: 1, columnSpan: 8 },
  },

  colorbox: {
    id: 'template-colorbox',
    type: 'colorbox',
    name: '컬러 박스',
    properties: {
      backgroundColor: '#FACC15', // 노란색
      height: '150px',
      borderRadius: '12px',
      size: {
        web: { width: '100%', height: '150px' },
      },
    },
    layout: { top: 600, column: 1, columnSpan: 8 },
  },
  grid2: {
    id: 'template-product-grid2',
    type: 'grid2',
    name: '상품 그리드2',
    version: 1,
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '인기 상품',
      columns: 3,
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
    layout: { top: 250, column: 1, columnSpan: 8 },
  },
  
};


// 📦 PC 초기 요소들
export const initialElements = [
  {
    id: 'el-1',
    type: 'header',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      menuItems: [
        { title: '홈', url: '/' },
        { title: '가게', url: '/shop' },
        { title: '상품', url: '/products' },
        { title: '카테고리', url: '/categories' },
        { title: '소개', url: '/about' },
        { title: '연락처', url: '/contact' },
      ],
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 0, column: 1, columnSpan: 8 },
  }, {
    id: 'el-1-2',
    type: 'header2',
    name: '헤더2',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      menuItems: [
        { title: '홈', url: '/' },
        { title: '가게', url: '/shop' },
        { title: '상품', url: '/products' },
        { title: '카테고리', url: '/categories' },
        { title: '소개', url: '/about' },
        { title: '연락처', url: '/contact' },
      ],
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 0, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-2',
    type: 'banner',
    name: '배너',
    properties: {
      title: '쇼핑몰에 오신 것을 환영합니다',
      subtitle: '합리적인 가격의 멋진 상품을 발견하세요',
      imageUrl: 'https://placehold.co/736x300',
      backgroundColor: '#3331',
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 100, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-3',
    type: 'grid',
    name: '상품 그리드',
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 200, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-5',
    type: 'blank',
    name: '여백',
    properties: {
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 300, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-6',
    type: 'text',
    name: '텍스트 박스',
    properties: {
      content: '여기에 텍스트를 입력하세요.',
      fontSize: '16px',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left',
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 400, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-7',
    type: 'image',
    name: '이미지 박스',
    properties: {
      imageUrl: 'https://placehold.co/400x200',
      alt: '샘플 이미지',
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 500, column: 1, columnSpan: 8 },
  },

  {
    id: 'el-8',
    type: 'colorbox',
    name: '컬러 박스',
    properties: {
      backgroundColor: '#FACC15',
      height: '150px',
      borderRadius: '12px',
      size: { web: { width: '100%', height: '150px' } },
    },
    layout: { top: 600, column: 1, columnSpan: 8 },
  },
  {
    id: 'el-9',
    type: 'grid2',
    name: '상품 그리드2',
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '인기 상품',
      columns: 3,
      size: { web: { width: '100%', height: 'auto' } },
    },
    layout: { top: 250, column: 1, columnSpan: 8 },
  },
  
];

// 📦 모바일용 템플릿
export const mobileelementTemplates = {
  header: {
    id: 'template-header',
    type: 'mobileheader',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 1,
      column: 1,
      rowSpan: 1,
      columnSpan: 4, // 모바일은 1열 그리드로 사용할 수 있음
    },
  },
  banner: {
    id: 'template-banner',
    type: 'mobilebanner',
    name: '배너',
    properties: {
      title: '쇼핑몰에 오신 것을 환영합니다',
      subtitle: '합리적인 가격의 멋진 상품을 발견하세요',
      imageUrl: 'https://placehold.co/1024x300',
      backgroundColor: '#3331',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 2,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  grid: {
    id: 'template-product-grid',
    type: 'mobilegrid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 2,
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 3,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  bottomNavigator: {
    id: 'el-4',
    type: 'mobileBottomNavigationBar',
    name: '바텀 네비게이션 바',
    properties: {
      backgroundColor: '#3331',
      items: [
        { id: 'nav-home', label: '홈', icon: 'home' },
        { id: 'nav-search', label: '검색', icon: 'search' },
        { id: 'nav-category', label: '카테고리', icon: 'category' },
        { id: 'nav-cart', label: '장바구니', icon: 'shopping_cart' },
        { id: 'nav-mypage', label: '마이페이지', icon: 'person' },
      ],
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 4,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  text: {
    id: 'template-text',
    type: 'mobiletext',
    name: '텍스트 박스',
    properties: {
      content: '여기에 텍스트를 입력하세요.',
      fontSize: '14px',
      fontWeight: 'normal',
      color: '#000000',
      textAlign: 'left',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 5,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  image: {
    id: 'template-image',
    type: 'mobileimage',
    name: '이미지 박스',
    properties: {
      imageUrl: 'https://placehold.co/400x200',
      alt: '샘플 이미지',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 6,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },

  colorbox: {
    id: 'template-mobile-colorbox',
    type: 'mobilecolorbox',
    name: '컬러 박스',
    properties: {
      backgroundColor: '#FACC15',
      height: '100px',
      borderRadius: '8px',
      size: {
        mobile: { width: '100%', height: '100px' },
      },
    },
    layout: {
      row: 5,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  
  
};

// 📦 모바일 초기 요소들
export const mobileinitialElements = [
  {
    id: 'el-1',
    type: 'mobileheader',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 1,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  {
    id: 'el-2',
    type: 'mobilebanner',
    name: '배너',
    properties: {
      title: '쇼핑몰에 오신 것을 환영합니다',
      subtitle: '합리적인 가격의 멋진 상품을 발견하세요',
      imageUrl: 'https://placehold.co/736x300',
      backgroundColor: '#3331',
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 2,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  {
    id: 'el-3',
    type: 'mobilegrid',
    name: '상품 그리드',
    properties: {
      sortList: ['전체', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 2,
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 3,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },
  {
    id: 'el-4',
    type: 'mobileBottomNavigationBar',
    name: '바텀 네비게이션 바',
    properties: {
      backgroundColor: '#3331',
      items: [
        { id: 'nav-home', label: '홈', icon: 'home' },
        { id: 'nav-search', label: '검색', icon: 'search' },
        { id: 'nav-category', label: '카테고리', icon: 'category' },
        { id: 'nav-cart', label: '장바구니', icon: 'shopping_cart' },
        { id: 'nav-mypage', label: '마이페이지', icon: 'person' },
      ],
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
    },
    layout: {
      row: 4,
      column: 1,
      rowSpan: 1,
      columnSpan: 4,
    },
  },

  
];
