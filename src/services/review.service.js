import { AxiosError } from 'axios';
import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';
import { toastError } from '../components/toast/CustomToast';

// 판매자
/** 판매자 리뷰 조회 */
export const getSellerReviews = async ({ page, size, sortby, isAnswered, rating }) => {
  const url = apiRoutes.seller.reviews.getAll({ page, size, sortby, isAnswered, rating });

  try {
    const response = await instance.get(url);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};

/** 판매자 리뷰 답글 */
export const createSellerReviewAnswer = async (reviewId, formData) => {
  const url = apiRoutes.seller.reviews.insert(reviewId);
  try {
    const response = await instance.post(url, formData);

    if (response.status > 399) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

/** 판매자 답글 수정 */
export const updateSellerReviewAnswer = async (reviewId, answerId, formData) => {
  const url = apiRoutes.seller.reviews.update(reviewId, answerId);
  try {
    const response = await instance.patch(url, formData);

    if (response.status > 399) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

/** 판매자 답글 삭제 */
export const deleteSellerReviewAnswer = async (reviewId, answerId) => {
  const url = apiRoutes.seller.reviews.delete(reviewId, answerId);
  try {
    const response = await instance.delete(url);

    if (response.status > 399) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};

// 고객
/** 리뷰 조회 */
export const getReviews = async ({ sortby, page, size, productId }) => {
  const url = apiRoutes.reviews.getAll(sortby, page, size, productId);

  try {
    const response = await instance.get(url);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};

/** 리뷰 추가 */
export const insertReview = async (productId, formData) => {
  const url = apiRoutes.reviews.insert(productId);

  try {
    const response = await instance.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status > 399) {
      throw new AxiosError('리뷰 등록에 실패했습니다.');
    }
    return true;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.status === 401) {
        toastError('로그인 후 이용 가능합니다.');
        return;
      }
      if (error.status === 400) {
        toastError('리뷰 등록에 실패했습니다. 이미 작성한 리뷰가 있습니다.');
        return;
      }
      if (error.status === 500) {
        toastError('서버 오류로 리뷰 등록에 실패했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }
    }
  }
};

/** 리뷰 수정 */
export const updateReview = async (productId, reviewId, reviewData) => {
  const url = apiRoutes.reviews.update(productId, reviewId);

  try {
    const response = await instance.put(url, reviewData);

    if (response.status > 399) {
      return false;
    }
    return response.data;
  } catch (error) {
    return false;
  }
};

/** 리뷰 삭제 */
export const deleteReview = async (productId, reviewId) => {
  const url = apiRoutes.reviews.delete(productId, reviewId);

  try {
    const response = await instance.delete(url);

    if (response.status > 399) {
      return false;
    }
    return true;
  } catch (error) {
    return false;
  }
};
