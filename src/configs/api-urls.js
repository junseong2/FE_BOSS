const BASE_URL = 'http://localhost:5000';

export const apiRoutes = {
  // 상품
  products: {
    getAll: (page, size) => BASE_URL + `/products?page=${page}&size=${size}`,
    getById: (productId) => BASE_URL + `/products/${productId}`,
  },

  // 카테고리
  categories: {
    getAllMajor: () => BASE_URL + `/category/root`,
    getSubcategories: (categoryId) => BASE_URL + `/category/${categoryId}/subcategories`,
    /** 대/중분류 전체 조회 */
    getAllWithHierarchy: () => BASE_URL + `/category/hierarchy`,
  },

  // 판매자
  seller: {
    // 상품 관리
    products: {
      getAll: (page, size, productName, state) =>
        BASE_URL +
        `/seller/products?page=${page}&size=${size}&search=${productName}&state=${state}`,
      insertMany: () => BASE_URL + `/seller/products/multiple`,
      insert: () => BASE_URL + `/seller/products`,
      delete: () => BASE_URL + `/seller/products`,
      update: (productId) => BASE_URL + `/seller/products/${productId}`,
    },
    // 재고 관리
    inventories: {
      getAll: (page, size, search, state) =>
        BASE_URL + `/seller/inventories?page=${page}&size=${size}&search=${search}&state=${state}`,
      update: () => BASE_URL + `/seller/inventories`,
    },
    // 주문 관리
    orders: {
      getAll: (page, size, search, { orderStatus, paymentStatus }, sort) =>
        BASE_URL +
        `/seller/orders?page=${page}&size=${size}&search=${search}&orderStatus=${orderStatus}&paymentStatus=${paymentStatus}&sort=${sort}`,
      getById: (orderId) => BASE_URL + `/seller/orders/${orderId}`,
    },

    // 결제 관리
    payments: {
      getAll: (page, size, search, status, sort) => {
        return (
          BASE_URL +
          `/seller/payments?page=${page}&size=${size}&search=${search}&status=${status}&sort=${sort}`
        );
      },
      // 일정별 통계
      getStatistics: (startDate, endDate) => {
        return (
          BASE_URL + `/seller/payments/statistics?startDate=${startDate}&endDate=${endDate}`
        )

      },
    },
    // 정산 관리
    settlements: {
      getAll: (page, size, search, status, sort) =>
        BASE_URL +
        `/seller/settlements?page=${page}&size=${size}&search=${search}&status=${status}&sort=${sort}`,
    },
  },

  // 인증
  auth: {
    signup: () => BASE_URL + `/auth/signup`,
    signin: () => BASE_URL + `/auth/locallogin`,
    userInfo: () => BASE_URL + `/auth/user-info`,
    redirect: () => BASE_URL + `/auth/get-redirect-url`,
    emailAuthCode: () => BASE_URL + `/auth/email/send-code`, //  인증 코드 발송
    emailCodeVerify: () => BASE_URL + `/auth/email/code-verify`, // 인증 코드 검증
    findUserEmail: () => BASE_URL + `/auth/find-email`, // 이메일 찾기
    resetPassword: () => BASE_URL + `/auth/reset-password`, // 비밀번호 재설정
  },

  // 주문
  orders: {
    create: () => BASE_URL + `/orders/create`,
  },

  // 결제
  payments: {
    create: () => BASE_URL + `/payment/portone`,
    updateStatus: () => BASE_URL + `/payment/update-status`,
  },
};
