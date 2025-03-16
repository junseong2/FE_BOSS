import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 판매자 상품 조회*/
export const getAllSellerProducts = async (page, size) => {
  const url = apiRoutes.seller.products.getAll(page, size);
  const response = await instance.get(url);
  return response.data;
};

/** 판매자 상품 추가 */
export const createSellerProduct = async (requestData) => {
  const url = apiRoutes.seller.products.insert();

  const response = await instance.post(url, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status === 201) {
    alert('상품목록에 정상적으로 반영하였습니다.');
  }
  return response.data;
};

/** 판매자 상품 수정 */
export const updateSellerProduct = async (productId, product) => {
  const url = apiRoutes.seller.products.update(productId);
  const response = await instance.patch(url, product);
  if (response.status < 300) {
    alert('정상적으로 수정되었습니다.');
  }
  return response.data;
};

/** 판매자 상품 삭제 */
export const deleteSellerProduct = async (productIds) => {
  const url = apiRoutes.seller.products.delete();
  const response = await instance.delete(url, { data: productIds });
  if (response.status < 300) {
    alert('정상적으로 상품정보가 삭제되었습니다.');
  }
  return response.data;
};

/** 판매자 상품 검색 */
export const getSearchSellerProducts = async (page, size, search) => {
  const url = apiRoutes.seller.products.search(page, size, search);
  const response = await instance.get(url);
  return response.data;
};

//========구매자 =========\\
/** 구매자 상품 조회 */
export const getAllProducts = async (page, size) => {
  const url = apiRoutes.products(page, size);
  const response = await instance.get(url);
  return response.data;
};
