import { apiRoutes } from '../../configs/api-urls';
import instance from '../../configs/axios.config';

/** 판매자 상품 조회*/
export const getAllSellerProducts = async (page, size) => {
  const url = apiRoutes.seller.products.getAll(page, size);
  const response = await instance.get(url);
  return response.data;
};

/** 판매자 상품 추가 */
export const createSellerProduct = async (products) => {
  const url = apiRoutes.seller.products.insert();

  const response = await instance.post(url, products);
  return response.data;
};

/** 판매자 상품 수정 */
export const updateSellerProduct = async (productId, product) => {
  const url = apiRoutes.seller.products.update(productId);
  const response = await instance.patch(url, product);
  return response.data;
};

/** 판매자 상품 삭제 */
export const deleteSellerProduct = async (productIds) => {
  const url = apiRoutes.seller.products.delete();
  const response = await instance.delete(url, productIds);
  console.log('상품삭제:', response);
  return response.data;
};

/** 판매자 상품 검색 */
export const getSearchSellerProducts = async (page, size, search) => {
  const url = apiRoutes.seller.products.search(page, size, search);
};
