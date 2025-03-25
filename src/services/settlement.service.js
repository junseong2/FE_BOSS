import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 정산 조회 */
export const getSettlements = async ({ page, size, search, status, sort }) => {
  const url = apiRoutes.seller.settlements.getAll(page, size, search, status, sort);

  try {
    const response = await instance.get(url);

    if (response.status < 300) {
      return response.data;
    } else {
      return { settlements: [], totalCount: 1 };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};
