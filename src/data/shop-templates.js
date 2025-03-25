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
    },
  },
  grid: {
    id: 'template-product-grid',
    type: 'grid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'], // 배열로 설정
      title: '추천 상품',
      columns: 3,
    },
  },
};
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
    },
  },
];









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
    },
  },
  grid: {
    id: 'template-product-grid',
    type: 'mobilegrid',
    name: '상품 그리드',
    version: 1,
    properties: {
      sortList: {
        new: [],
        best: [],
        recommend: [],
      }[('실시간', '일간', '주간', '월간')],
      title: {},
    },
  },

  bottomNavigator: 
  
  
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
    },
  },
  
};




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
    },
  },
  {
    id: 'el-3',
    type: 'mobilegrid',
    name: '상품 그리드',
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
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
    },
  }
  


];
