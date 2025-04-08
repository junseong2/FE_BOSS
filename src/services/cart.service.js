import { toastError, toastSuccess } from '../components/toast/CustomToast';
import instance from '../configs/axios.config';

// { productId: product.productId, quantity }
export const addToCart = async (data) => {
  try {
    const response = await instance.post('http://localhost:5000/cart/add', data);
    if(response.status>399){
      throw new Error()
    } else {
      toastSuccess("장바구니에 추가하였습니다.")
    }
  
  } catch (error) {
    toastError("장바구니 추가에 실패하였습니다.")
    console.error('❌ 장바구니 추가 오류:', error);
  }

  // ✅ 사용자 벡터 업데이트 요청 추가
   
    const updateRes = await fetch(
      `http://localhost:5000/vector/update?productId=${data.productId}`,
      {
        method: 'POST',
        credentials: 'include',
      }
    );
}

