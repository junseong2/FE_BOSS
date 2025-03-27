import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 판매자| 주문 내역 조회 */
export const getOrders = async ({ page, size, search, status, sort }) => {
  const url = apiRoutes.seller.orders.getAll(page, size, search, status, sort);

  try {
    const response = await instance.get(url);
    if (response.status < 300) {
      return response.data;
    } else {
      return { orders: [], totalCount: 1 };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};

/**판매자 | 주문 내역 상세 조회 */
export const getOrderDetail = async (orderId) => {
  const url = apiRoutes.seller.orders.getById(orderId);
  console.log("주문 내역 상세 조회 URL: ", url)

  try {
    const response = await instance.get(url);
    if (response.status < 300) {
      return response.data;
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.instance.data;
    }
  }
};

/** 구매자 | 주문생성 */
export const createOrders = async (order) => {
  const url = apiRoutes.orders.create();

  try {
    const response = await instance.post(url, order);
    const { orderId } = response.data;

    if (response > 399) {
      throw new Error('주문 생성 실패');
    } else {
      return orderId; // 주문 번호 반환
    }
  } catch (error) {
    if (error instanceof AxiosError) throw new Error('주문 생성 실패');
  }
};
