import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 정산 조회 */
export const getSettlements = async ({ page, size,condition }) => {
  const url = apiRoutes.seller.settlements.getAll(page, size,condition);

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

/** 정산 신청 */
export const settlementRequest = async (formData) => {
  const url = apiRoutes.seller.settlements.insert();

  try {
    const response = await instance.post(url, formData);

    if (response.status < 300) {
      return response.data;
    } else {
      return { settlement };
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};
