const BASE_URL = 'http://localhost:5000';

export const apiRoutes = {
  products: {
    getAll: (page, size) => BASE_URL + `/products?page=${page}&size=${size}`,
    getById: (productId) => BASE_URL + `/products/${productId}`,
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
};
