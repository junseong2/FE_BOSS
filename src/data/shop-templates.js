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
  productGrid: {
    id: 'template-product-grid',
    type: 'productGrid',
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
    type: 'productGrid',
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
    type: 'header',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      categories: [],
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
  productGrid: {
    id: 'template-product-grid',
    type: 'productGrid',
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

  bottomNavigator: {
    id: 'template-bottom-navigation',
    type: 'bottomNavigationbar',
    name: '바텀네비게이션',
    version: 1,
    properties: {
      imageUrl: 'http://localhost:5000/uploads/bottomnavigationbar.png',
    
    },
  },
};




export const mobileinitialElements = [
  {
    id: 'el-1',
    type: 'header',
    name: '헤더',
    properties: {
      title: '내 쇼핑몰',
      logoUrl: 'https://placehold.co/50x50',
      categories: [],
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
    type: 'productGrid',
    name: '상품 그리드',
    properties: {
      sortList: ['실시간', '일간', '주간', '월간'],
      title: '추천 상품',
      columns: 3,
    },
  },
  {
    id: 'el-4',
    type: 'bottomNavigationbar',
    name: '바텀네비게이션바',
    properties: {
      imageUrl: 'http://localhost:5000/uploads/bottomnavigationbar.png',
      backgroundColor: '#3331',
    },
  },
];
