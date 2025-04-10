import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 판매자 상점 조회 */
export const getSellerStores = async ({ page, size }) => {
  const url = apiRoutes.seller.sellers.getAll(page, size);

  try {
    const response = await instance.get(url);
    console.log(response);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
