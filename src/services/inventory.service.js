import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 판매자 재고 조회*/
export const getAllSellerInventories = async (page, size, search, state) => {
  const url = apiRoutes.seller.inventories.getAll(page, size, search, state);
  try {
    const response = await instance.get(url);
    if (response.status < 300) {
      return response.data
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};

/** 판매자 재고 업데이트 */
export const updateSellerInventories = async (inventories) => {
  if (!Array.isArray(inventories)) return;
  const url = apiRoutes.seller.inventories.update();
  const response = await instance.patch(
    url,
    inventories.map(({ updatedDate, ...rest }) => rest),
  );
  console.log('응답: ' + response);

  return response.data;
};
