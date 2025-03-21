import { apiRoutes } from '../configs/api-urls';
import instance from '../configs/axios.config';

/** 회원가입 요청 */
export const registerUser = async (formData) => {
  console.log(formData);
  // const url = apiRoutes.auth.singup();
  // const response = await instance.post(url, {
  //   data: JSON.stringify(formData),
  // });

  // return response.data;
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

  return response.data;
};

/** 인증 리디렉트 */
export const getRedirectUrl = async () => {
  const url = apiRoutes.auth.redirect();
  const response = await instance.get(url);

  return response.data;
};

/** 이메일 인증 번호 발송 */
export const sendEmailAuthCode = async (email) => {
  const data = { email: email };
  const url = apiRoutes.auth.emailAuthCode();

  try {
    const response = await instance.post(url, data);

    if (response.status < 400) {
      console.log(response)
      alert('인증코드가 발송되었습니다. 이메일을 확인해주세요.');
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

/** 이메일 인증 번호 검증 */
export const verifyEmailAuthCode = async (code, email) => {
  const url = apiRoutes.auth.emailCodeVerify();
  const response = await instance.post(url, {
    data: JSON.stringify({ code, email }),
  });

  console.log('이메일 인증 번호 검증:', response);

  return response.data;
};
