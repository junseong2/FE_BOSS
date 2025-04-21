import axios from 'axios';
import { getToken, setToken } from '../utils/storage';
import { BASE_URL } from '../lib/api';
const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 보안 토큰을 주고 받으려면 필요함
});

// 요청 인터셉터
instance.interceptors.request.use(function(request){
    request.headers['Authorization'] = getToken();

    return request;
  })

  // 응답 인터셉터
  instance.interceptors.response.use(function (response) {

    const rawToken = response.headers['authorization']

    if(!rawToken) return response;

    setToken(rawToken.split(" ")[1])

    return response;

  }, function (error) {
    // 2xx 외의 범위에 있는 상태 코드는 이 함수를 트리거 함.
    // 응답 오류가 있는 작업 수행


    if(error.status === 400){
      alert(error.response.data.message)
    }


    if(error.status === 403){
      alert("로그인 후 이용 가능한 서비스 입니다.")
    }

    if(error.status === 409){
      alert("이미 처리된 요청입니다.")
    }

    return Promise.reject(error);
  });

export default instance;
