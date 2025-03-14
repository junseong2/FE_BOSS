import { apiRoutes } from '../../configs/api-urls';
import instance from '../../configs/axios.config';

/** 판매자 재고 조회*/
export const getAllSellerInventories = async (page, size) => {
  const url = apiRoutes.seller.inventories.getAll(page, size);
  const response = await instance.get(url);

  return response.data;
};

/** 판매자 재고 상품 검색 */
export const getSearchSellerInventories = async (page, size, search) => {
  const url = apiRoutes.seller.inventories.search(page, size, search);
  const response = await instance.get(url);

  return response.data;
};

/** 판매자 재고 간이 발주 */
export const updateSellerInventories = async (page, size, inventories) => {
  const url = apiRoutes.seller.inventories.update();
  const response = await instance.patch(url, inventories);
  return response.data;
};
