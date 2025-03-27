import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 회원가입 요청 */
export const registerUser = async (formData) => {
  const url = apiRoutes.auth.signup(); // ✅ 오타 수정

  try {
    const response = await instance.post(url, formData);

    return response.status < 400;
  } catch (error) {
    return false;
  }
};

/** 로그인 요청 */
export const loginRequest = async (formData) => {
  const url = apiRoutes.auth.signin();
  try {
    const response = await instance.post(url, formData);
    return response.status;
  } catch (error) {
    return null;
  }
};

/** 유저 정보 조회 */
export const getUserInfo = async () => {
  const url = apiRoutes.auth.userInfo();
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    return null;
  }
};

/** 인증 리디렉트 */
export const getRedirectUrl = async () => {
  const url = apiRoutes.auth.redirect();
  try {
    const response = await instance.get(url);
    return response.data;
  } catch (error) {
    return null;
  }
};

/** 이메일 인증 코드 발송 */
export const sendEmailAuthCode = async (email) => {
  const url = apiRoutes.auth.emailAuthCode();
  try {
    await instance.post(url, { email });
    alert('인증코드가 발송되었습니다. 이메일을 확인해주세요.');
    return true;
  } catch (error) {
    return null;
  }
};

/** 이메일 인증 코드 검증 */
export const verifyEmailAuthCode = async (code, email) => {
  const url = apiRoutes.auth.emailCodeVerify();
  try {
    const response = await instance.post(url, { code, email });
    return response.status < 400;
  } catch (error) {
    return false;
  }
};

/** 아이디 찾기 */
export const findUserEmail = async ({ email }) => {
  const url = apiRoutes.auth.findUserEmail();
  try {
    const response = await instance.post(url, { email });
    return response.data?.email || null;
  } catch (error) {
    return null;
  }
};

/** 비밀번호 찾기 */
export const resetPassword = async ({ email }) => {
  const url = apiRoutes.auth.resetPassword(); // ✅ 잘못된 엔드포인트 수정
  try {
    const response = await instance.post(url, { email });
    return response.data;
  } catch (error) {
    return null;
  }
};

/** 판매자 정보 조회 */
export const getSellerInfo = async () => {
  const url = `${import.meta.env.VITE_BACKEND_URL}/seller/seller-info`;
  try {
    const response = await instance.get(url, { withCredentials: true });
    return response.data;
  } catch (error) {
    console.error('❌ 판매자 정보 가져오기 실패:', error);
    return null;
  }
};
