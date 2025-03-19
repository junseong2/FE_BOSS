const BASE_URL = 'http://localhost:5000';

export const apiRoutes = {
  // 상품
  products: {
    getAll: (page, size) => BASE_URL + `/products?page=${page}&size=${size}`,
    getById: (productId) => BASE_URL + `/products/${productId}`,
  },

  // 카테고리
  categories: {
    getAll: () => BASE_URL + `/category/root`,
    getSubcategories: (categoryId) => BASE_URL + `/category/${categoryId}/subcategories`,
    /** 대/중분류 전체 조회 */
    getAllWithHierarchy: () => BASE_URL + `/category/hierarchy`,
  },

  // 판매자
  seller: {
    // 상품 관리
    products: {
      getAll: (page, size) => BASE_URL + `/seller/products?page=${page}&size=${size}`,
      search: (page, size, search) =>
        BASE_URL + `/seller/products/search?search=${search}&page=${page}&size=${size}`,
      insertMany: () => BASE_URL + `/seller/products/multiple`,
      insert: () => BASE_URL + `/seller/products`,
      delete: () => BASE_URL + `/seller/products`,
      update: (productId) => BASE_URL + `/seller/products/${productId}`,
    },
    // 재고 관리
    inventories: {
      getAll: (page, size) => BASE_URL + `/seller/inventories?page=${page}&size=${size}`,
      search: (page, size, search) =>
        BASE_URL + `/seller/inventories/search?search=${search}&page=${page}&size=${size}`,
      update: () => BASE_URL + `/seller/inventories`,
    },
  },
  // 인증
  auth: {
    singup:()=> BASE_URL + `/auth/signup`,
    signin:()=> BASE_URL +`/auth/locallogin`,
    userInfo:()=> BASE_URL + `/auth/user-info`,
    redirect:()=> BASE_URL +`/auth/get-redirect-url`
  },
};
