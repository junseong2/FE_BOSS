import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 포트원 결제 */
export const portoneRequest = async (paymentData) => {
  const url = apiRoutes.payments.create();

  try {
    const response = await instance.post(url, paymentData);

    if (response.status > 399) {
      throw new Error('결제 정보 저장 실패');
    } else {
      return null;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error('결제 정보 저장 실패');
    }
  }
};

/** 결제 상태 업데이트*/
export const updatePaymentStatus = async (statusData) => {
  const url = apiRoutes.payments.updateStatus();

  try {
    const response = await instance.post(url, statusData);

    if (response.status > 399) {
      throw new Error('결제 상태 변경 실패');
    }
  } catch (error) {
    throw new Error('결제 상태 변경 실패');
  }
};


/** 판매자  */
/** 결제 내역 조회 */
export const getPayments = async ({ page, size, search, status, sort }) => {
  const url = apiRoutes.seller.payments.getAll(page, size, search, status, sort);

  try {
    const response = await instance.get(url);

    if (response.status < 300) {
      return response.data;
    } else {
      return { payments: [], totalCount: 1 };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};

/** 매출 요약  */
export const getPaymentSummary = async ({ startDate, endDate }) => {
  const url = apiRoutes.seller.payments.getSummary(startDate, endDate);

  try {
    const response = await instance.get(url);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};

/**매출 분석 통계(월단위) */
export const getSalesByMonth = async ({ startDate, endDate }) => {
  const url = apiRoutes.seller.payments.getAllByMonth(startDate, endDate);

  try {
    const response = await instance.get(url);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};

/**매출 분석 통계(카테고리별) */
export const getSalesByCategory = async ({ startDate, endDate }) => {
  const url = apiRoutes.seller.payments.getAllByCategory(startDate, endDate);

  try {
    const response = await instance.get(url);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};
