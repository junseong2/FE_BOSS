import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 회원가입 요청 */
export const registerUser = async (formData) => {
  const url = apiRoutes.auth.singup();
  const response = await instance.post(url, {
    data: JSON.stringify(formData),
  });

  return response.data;
};

/** 로그인 요청 */
export const loginRequest = async (formData) => {
  const url = apiRoutes.auth.signin();
  const response = await instance.post(url, {
    data: JSON.stringify(formData),
  });

  return response.status;
};

/** 유저정보 조회 */
export const getUserInfo = async () => {
  const url = apiRoutes.auth.userInfo();
  const response = await instance.get(url);

  return response.data
};


/** 인증 리디렉트 */
export const getRedirectUrl = async ()=>{
  const url = apiRoutes.auth.redirect();
  const response = await instance.get(url)

  return response.data
}