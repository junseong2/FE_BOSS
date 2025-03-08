import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import fetchUserInfo from '../utils/api';

function SignIn() {
  const [userId, setUserId] = useState(null);

  console.log('SignIn 컴포넌트 렌더링됨'); // ✅ 확인용 로그 추가
  const location = useLocation();
  const navigate = useNavigate(); // ✅ useNavigate 선언 추가

  const [userName, setUserName] = useState(null);
  const [redirectUrl, setRedirectUrl] = useState('/');
  const [email, setEmail] = useState(''); // ✅ 이메일 상태 추가
  const [password, setPassword] = useState(''); // ✅ 비밀번호 상태 추가

  // 로그인 후 리디렉션될 URL을 서버에서 가져오기
  const getRedirectUrl = async () => {
    try {
      console.log('리디렉션 URL 가져오는 중...'); // ✅ 확인용 로그 추가
      const response = await fetch('http://localhost:5000/auth/get-redirect-url', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('서버에서 리디렉션 URL을 가져오지 못함');
      }

      const data = await response.json();
      console.log('가져온 리디렉션 URL:', data.redirectUrl); // ✅ 확인용 로그 추가
      setRedirectUrl(data.redirectUrl);
    } catch (error) {
      console.error('리디렉션 URL 가져오기 실패:', error);
    }
    await fetchUserInfo(setUserId, setUserName); // 사용자 정보 불러오기

    console.log('현재 사용자 ID:', userId); // 사용자 ID 출력
    console.log('현재 사용자 이름:', userName); // 사용자 이름 출력
  };

  const checkLoginStatus = async () => {
    try {
      console.log('로그인 상태 확인 중...');

      const token = localStorage.getItem('token'); // ✅ JWT 가져오기
      if (!token) {
        console.error('토큰이 없습니다. 로그인 필요');
        return;
      }

      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include', // ✅ 쿠키 포함 요청 (CORS 문제 방지)
        headers: {
          Authorization: `Bearer ${token}`, // ✅ JWT 토큰 추가
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('로그인된 사용자 정보:', data);
        setUserName(data.userName);
        navigate('/');
      } else {
        console.error('로그인 상태 확인 실패:', response.status);
      }
    } catch (error) {
      console.error('로그인 상태 확인 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨');
    checkLoginStatus(); // 로그인 확인 후 홈 리디렉션 처리

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]); // userName 제거

  // 로컬 로그인 요청
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/locallogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include', // ✅ 세션 쿠키 유지 (JWT 사용 시 필수)
      });

      const result = await response.json();

      if (response.ok) {
        alert('로그인 성공!');

        // 쿠키에 JWT가 저장되므로, 여기서는 추가적인 작업이 필요하지 않음
        setUserName(result.userName); // ✅ 로그인한 유저 이름 저장
        await fetchUserInfo(setUserId, setUserName); // 사용자 정보 가져오기

        navigate('/'); // ✅ 로그인 후 홈으로 이동
      } else {
        alert('로그인 실패: ' + result.error); // error 메시지 수정
      }
    } catch (error) {
      console.error('로그인 요청 중 오류 발생:', error);
      alert('로그인 중 오류가 발생했습니다.');
    }
    fetchUserInfo();
  };

  useEffect(() => {
    console.log('SignIn useEffect 실행됨'); // ✅ 확인용 로그 추가
    getRedirectUrl();

    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    const userName = params.get('userName');

    console.log('URL Params:', { userId, userName }); // ✅ 확인용 로그 추가

    if (userId && userName) {
      setUserName(userName);
    }
  }, [location.search]);

  const handleKakaoLogin = () => {
    window.location.href = `http://localhost:5000/auth/kakao`;
  };

  const handleNaverLogin = () => {
    window.location.href = 'http://localhost:5000/auth/naver';
  };

  const handleGoogleLogin = () => {
    window.location.href = `http://localhost:5000/auth/google`;
  };

  const handleSignUpRedirect = () => {
    navigate('/signup');
  };

  return (
    <div className='signin-container'>
      {/* ✅ 로컬 로그인 폼 추가 */}
      <h2>로컬 로그인</h2>
      <input
        type='email'
        placeholder='이메일 입력'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type='password'
        placeholder='비밀번호 입력'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className='login-btn'>
        로그인
      </button>
      <button onClick={handleSignUpRedirect} className='signup-redirect-btn'>
        회원가입
      </button>

      <h1>
        또는<br></br>소셜 로그인
      </h1>
      <img
        src='src/assets/kakao_login_logo.png'
        alt='Kakao 로그인'
        className='login-btn'
        onClick={handleKakaoLogin}
        style={{ cursor: 'pointer', width: '100px', height: 'auto' }} // 원하는 크기로 조정
      />
      <img
        src='src/assets/naver_login_logo.png'
        alt='Naver 로그인'
        className='login-btn'
        onClick={handleNaverLogin}
        style={{ cursor: 'pointer', width: '100px', height: 'auto', marginLeft: '50px' }} // 원하는 크기로 조정
      />
      {/* 
<button onClick={handleGoogleLogin} className="login-btn">
    구글 로그인
</button>
*/}

      {userName && <div className='topbar'>환영합니다, {userName}님!</div>}
    </div>
  );
}

export default SignIn;
