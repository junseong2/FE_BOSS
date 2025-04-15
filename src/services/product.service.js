import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';
import { toastSuccess } from '../components/toast/CustomToast';

/** 판매자 상품 조회*/
export const getAllSellerProducts = async (page, size, productName = '') => {
  const url = apiRoutes.seller.products.getAllWithDashboard(page, size, productName);
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      return error.response.data;
    }
  }
};

/** 판매자 상품 추가 */
export const registerSellerProduct = async (requestData) => {
  const url = apiRoutes.seller.products.insert();

  const response = await instance.post(url, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status === 201) {
    toastSuccess('상품목록에 정상적으로 반영하였습니다.');
  }
  return response.data;
};

/** 판매자 상품 수정 */
export const updateSellerProduct = async (productId, requestData) => {
  const url = apiRoutes.seller.products.update(productId);
  const response = await instance.patch(url, requestData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (response.status < 300) {
    toastSuccess('정상적으로 반영하였습니다.');
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

/** 상품 상세 페이지 조회 */
export const getProductDetail = async (id) => {
  const url = apiRoutes.products.getById(id);
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
/** 상품 상세 페이지 seller storename 조회 */
export const getProductDetail2 = async (productId) => {
  const res = await instance.get(`/products/detail/${productId}`);
  return res.data;
};
