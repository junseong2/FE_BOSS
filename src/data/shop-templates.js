// 📦 PC용 템플릿
export const elementTemplates = {
  header: {
    id: 'template-header',
    type: 'header',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      menuItems: ['홈', '상품', '카테고리', '소개', '연락처'],
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        web: { width: '100%', height: 'auto' },
      },
      items: [
        { title: '홈', url: '/' },
        { title: '상품', url: '/products' },
        { title: '카테고리', url: '/categories' },
        { title: '소개', url: '/about' },
        { title: '연락처', url: '/contact' },
      ],
    },
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
  },
  grid: {
    id: 'template-product-grid',
    type: 'grid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
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
      menuItems: ['홈', '상품', '카테고리', '소개', '연락처'],
      categories: [],
      backgroundColor: '#4294F2',
      fontFamily: 'Nanum Gothic',
      fontSize: '18px',
      fontWeight: 'bold',
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
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
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
  },
  {
    id: 'el-3',
    type: 'grid',
    name: '상품 그리드',
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
  },
  {
    id: 'el-5',
    type: 'blank',
    name: '여백',
    properties: {
      size: {
        web: { width: '100%', height: 'auto' },
      },
    },
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
  },
  grid: {
    id: 'template-product-grid',
    type: 'mobilegrid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 2,
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
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
  },
  {
    id: 'el-3',
    type: 'mobilegrid',
    name: '상품 그리드',
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 2,
      size: {
        mobile: { width: '100%', height: 'auto' },
      },
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
  },
];
