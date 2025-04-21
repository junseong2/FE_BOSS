import { BASE_URL } from "../lib/api";

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

  // 리뷰
  reviews: {
    /**
     * @param {*} sortby 정렬 기준으로 desc, asc 중 하나 선택(평점을 기준으로 한다.)
     */
    getAll: (sortby, page, size, productId) =>
      BASE_URL + `/products/${productId}/reviews?page=${page}&size=${size}&sortby=${sortby}`,
    insert: (productId) => BASE_URL + `/products/${productId}/reviews`,
    update: (productId, reviewId) => BASE_URL + `/products/${productId}/reviews/${reviewId}`,
    delete: (productId, reviewId) => BASE_URL + `/products/${productId}/reviews/${reviewId}`,
  },

  // 판매자
  seller: {
    // 상품 관리
    sellers: {
      getAll: (page, size) => BASE_URL + `/seller/stores?page=${page}&size=${size}`,
    },
    products: {
      getAllWithDashboard: (page, size, productName, state) =>
        BASE_URL +
        `/seller/dashboard/products?page=${page}&size=${size}&search=${productName}&state=${state}`,
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
        `/orders/seller/orders?page=${page}&size=${size}&search=${search}&orderStatus=${orderStatus}&paymentStatus=${paymentStatus}&sort=${sort}`,
      getById: (orderId) => BASE_URL + `/orderdetail/seller/orders/${orderId}`,
    },

    // 결제 관리
    payments: {
      getSummary: (startDate, endDate) =>
        BASE_URL + `/seller/payments/summary-statistics?startDate=${startDate}&endDate=${endDate}`,
      getAllByCategory: (startDate, endDate) =>
        BASE_URL + `/seller/payments/category-statistics?startDate=${startDate}&endDate=${endDate}`,
      getAllByMonth: (startDate, endDate) =>
        BASE_URL + `/seller/payments/monthly-statistics?startDate=${startDate}&endDate=${endDate}`,
    },
    // 정산 관리
    settlements: {
      getAll: (page, size, condition) =>
        BASE_URL +
        `/settlements/seller/check?page=${page}&size=${size}&startDate=${condition.startDate}&endDate=${condition.endDate}&username=${condition.username}&settlementId=${condition.settlementId}`,
      insert: () => `/settlements/seller/request`,
    },
    // 리뷰 관리
    reviews: {
      getAll: ({ page, size, sortby, isAnswered, rating }) => {
        let url = `${BASE_URL}/seller/reviews?page=${page}&size=${size}&sortby=${sortby}`;

        if (isAnswered !== undefined && isAnswered !== null) {
          url += `&isAnswered=${isAnswered}`;
        }

        if (rating !== undefined && rating !== null) {
          url += `&rating=${rating}`;
        }

        return url;
      },
      insert: (reviewId) => BASE_URL + `/seller/reviews/${reviewId}/answer`,
      delete: (reviewId, answerId) => BASE_URL + `/seller/reviews/${reviewId}/answer/${answerId}`,
      update: (reviewId, answerId) => BASE_URL + `/seller/reviews/${reviewId}/answer/${answerId}`,
    },
  },


  // 인증
  auth: {
    signup: () => BASE_URL + `/auth/signup`,
    signin: () => BASE_URL + `/auth/locallogin`,
    userInfo: () => BASE_URL + `/auth/user-info`,
    redirect: () => BASE_URL + `/auth/get-redirect-url`,
    emailAuthCode: () => BASE_URL + `/auth/email/send-code`, //  인증 코드 발송
    emailAuthCode2: () => BASE_URL + `/auth/email/password/send-code`, //  비밀번호 인증 코드 발송
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

  // 장바구니
  carts:{
    count: ()=> BASE_URL + `/cart/count`
  }
};