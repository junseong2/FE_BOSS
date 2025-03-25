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
      imageUrl: 'https://placehold.co/1024x300',
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
    }
  },
];
