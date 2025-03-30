// src/services/seller/signup.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const registerBusiness = async (businessNumber) => {
  try {
    // 기존 경로: /seller/verify-business -> /business/check로 수정
    const response = await axios.post(`${API_BASE_URL}/business/check`, {
      businesses: [{ b_no: businessNumber }],
    });
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || '사업자 등록 인증 실패' };
  }
};

export const registerSeller = async (sellerData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/seller/register`, sellerData);
    return response.data;
  } catch (error) {
    return { success: false, message: error.response?.data?.message || '판매업 등록 실패' };
  }
};