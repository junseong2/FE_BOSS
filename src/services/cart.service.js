import { AxiosError } from 'axios';
import { toastError, toastInfo, toastSuccess } from '../components/toast/CustomToast';
import instance from '../configs/axios.config';

// { productId: product.productId, quantity }
export const addToCart = async (data) => {
  try {
    const response = await instance.post('http://localhost:5000/cart/add', data);
    if (response.status > 399) {
      throw new Error();
    } else {
      toastSuccess('장바구니에 추가하였습니다.');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 401) {
        toastInfo('로그인 후 이용 가능합니다.');
      }
      if(error.status>499) {
        toastError("네트워크 문제로 요청에 실패 하였습니다.")
      }
    }
   
  }

  // ✅ 사용자 벡터 업데이트 요청 추가

  const updateRes = await fetch(`http://localhost:5000/vector/update?productId=${data.productId}`, {
    method: 'POST',
    credentials: 'include',
  });
};
