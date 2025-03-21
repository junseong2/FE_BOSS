import React, { useState, useEffect } from 'react';
import { registerUser, sendEmailAuthCode, verifyEmailAuthCode } from '../services/auth.service';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^[0-9]{10,11}$/;

export default function SignUp() {
  // 폼 데이터 메시지
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    zipcode: '',
    address1: '',
    address2: '',
  });

  // 유효성 에러 메시지
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address1: '',
  });

  // 유효성 성공 메시지
  const [success, setSuccess] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address1: '',
  });

  const [code, setCode] = useState(''); // 이메일 인증 코드
  const [isSendCode, setIsSendCode] = useState(false);
  const [isAuthEmail, setIsAuthEmail] = useState(false);

  // 다음 우편번호 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 우편번호 검색 함수
  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setFormData((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address1: data.address,
        }));

        setSuccess((prev) => ({
          ...prev,
          address1: '주소가 확인되었습니다.',
        }));

        setErrors((prev) => ({
          ...prev,
          address1: '',
        }));
      },
    }).open();
  };

  // 이메일 유효성 -> 이게 통과되어야 발송 버튼 활성화
  const isValidEmail = emailPattern.test(formData.email);

  // 폼 유효성 검사 결과
  const isSuccessValidationForm = Object.values(errors).every((error) => error === '');

  // 사용자 입력값 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validate(name, value);
  };

  // 이메일 코드 인증
  const handleEmailVerify = async () => {
    if (formData.email === '') {
      alert('이메일을 입력하세요.');
    }

    const isAuth = await verifyEmailAuthCode(code, formData.email);

    // 인증 성공 시
    if (isAuth) {
      setIsAuthEmail(true); // 이메일 인증 완료 상태로 설정
      setSuccess((prev) => ({
        ...prev,
        email: '이메일이 인증되었습니다.',
      }));

      // 인증 실패시
    } else {
      alert('이메일 인증에 실패했습니다. 다시 시도해주세요.');
      setSuccess((prev) => ({
        ...prev,
        email: '',
      }));
      setErrors((prev) => ({
        ...prev,
        email: '인증에 실패했습니다. 다시 시도해주세요.',
      }));
    }
  };

  // 이메일 인증코드 전송
  const handleSendEmailAuthCode = async () => {
    if (formData.email === '') {
      alert('이메일을 입력하세요.');
      return;
    }
    try {
      const isSuccess = await sendEmailAuthCode(formData.email); // 비동기 처리
      setIsSendCode(isSuccess);
    } catch (error) {
      alert('이메일 인증 코드 전송 실패');
      console.error(error);
    }
  };

  // 폼 전송(회원가입 요청)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSuccessValidationForm) {
      return alert('폼에 오류가 있습니다. 다시 확인해주세요.');
    }

    try {
      await registerUser(formData);
      alert('회원가입이 완료되었습니다!');
      window.location.href = '/signin';
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  /** 유효성 검사 결과 상태 업데이트 */
  const updateValidateField = (name, errorMessage, successMessage = '') => {
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));

    setSuccess((prev) => ({
      ...prev,
      [name]: errorMessage === '' ? successMessage : '',
    }));
  };

  // 폼 유효성 검사
  const validate = (name, value) => {
    let errorMessage = '';
    let successMessage = '';

    switch (name) {
      case 'username':
        if (!value) {
          errorMessage = '이름을 입력하세요.';
        } else if (value.length < 3) {
          errorMessage = '이름은 3자 이상이어야 합니다.';
        } else {
          successMessage = '이름이 확인되었습니다.';
        }
        break;
      case 'email':
        if (!value) {
          errorMessage = '이메일을 입력하세요.';
        } else if (!emailPattern.test(value)) {
          errorMessage = '유효한 이메일 주소를 입력하세요.';
        } else if (!isAuthEmail) {
          successMessage = '이메일 형식이 올바릅니다.';
        }
        break;
      case 'password':
        if (!value) {
          errorMessage = '비밀번호를 입력하세요.';
        } else if (value.length < 8) {
          errorMessage = '비밀번호는 8자 이상이어야 합니다.';
        } else {
          successMessage = '비밀번호가 확인되었습니다.';
        }

        // 비밀번호가 변경되면 비밀번호 확인도 다시 검증
        if (formData.confirmPassword) {
          validate('confirmPassword', formData.confirmPassword);
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errorMessage = '비밀번호 확인을 입력하세요.';
        } else if (value !== formData.password) {
          errorMessage = '비밀번호가 일치하지 않습니다.';
        } else {
          successMessage = '비밀번호가 일치합니다.';
        }
        break;
      case 'phone':
        if (!value) {
          errorMessage = '전화번호를 입력하세요.';
        } else if (!phonePattern.test(value)) {
          errorMessage = '유효한 전화번호를 입력하세요.';
        } else {
          successMessage = '전화번호가 확인되었습니다.';
        }
        break;
      case 'address1':
        if (!value) {
          errorMessage = '주소를 입력하세요.';
        } else {
          successMessage = '주소가 확인되었습니다.';
        }
        break;
      default:
    }

    updateValidateField(name, errorMessage, successMessage);
  };

  return (
    <div className='relative bg-gray-100 min-h-screen flex flex-col justify-center items-center py-12'>
      <div className='max-w-7xl w-full px-6 lg:px-0 flex flex-col lg:flex-row items-center'>
        <div className='lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0'>
          <h1 className='text-3xl lg:text-4xl font-bold text-[#4294F2] mb-4'>BOSS</h1>
          <p className='lg:block hidden text-lg text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0'>
            간편하게 로그인하고 서비스를 이용해보세요. 아직 회원이 아니신가요? 지금 바로 가입하세요!
          </p>
        </div>

        <div className='w-full max-w-md bg-white p-8 rounded-lg shadow-xl'>
          <form onSubmit={handleSubmit}>
            <div className='grid grid-cols-1 gap-4 mb-6'>
              {/* 이름 */}
              <div className='mb-1'>
                <label htmlFor='username' className='block text-sm font-medium text-gray-700'>
                  이름
                </label>
                <input
                  type='text'
                  id='username'
                  name='username'
                  value={formData.username}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.username && <p className='text-sm text-red-500 mt-1'>{errors.username}</p>}
                {success.username && (
                  <p className='text-sm text-green-500 mt-1'>{success.username}</p>
                )}
              </div>

              {/* 비밀번호 */}
              <div className='mb-1'>
                <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                  비밀번호
                </label>
                <input
                  type='password'
                  id='password'
                  name='password'
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.password && <p className='text-sm text-red-500 mt-1'>{errors.password}</p>}
                {success.password && (
                  <p className='text-sm text-green-500 mt-1'>{success.password}</p>
                )}
              </div>

              {/* 비밀번호 재확인 */}
              <div className='mb-1'>
                <label
                  htmlFor='confirmPassword'
                  className='block text-sm font-medium text-gray-700'
                >
                  비밀번호 확인
                </label>
                <input
                  type='password'
                  id='confirmPassword'
                  name='confirmPassword'
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500 mt-1'>{errors.confirmPassword}</p>
                )}
                {success.confirmPassword && (
                  <p className='text-sm text-green-500 mt-1'>{success.confirmPassword}</p>
                )}
              </div>

              {/* 전화번호 */}
              <div className='mb-1'>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700'>
                  전화번호
                </label>
                <input
                  type='text'
                  id='phone'
                  name='phone'
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="'-' 없이 입력"
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.phone && <p className='text-sm text-red-500 mt-1'>{errors.phone}</p>}
                {success.phone && <p className='text-sm text-green-500 mt-1'>{success.phone}</p>}
              </div>

              {/* 주소 검색 */}
              <div className='mb-1'>
                <label htmlFor='zipcode' className='block text-sm font-medium text-gray-700'>
                  우편번호
                </label>
                <div className='flex gap-3 mt-1'>
                  <input
                    type='text'
                    id='zipcode'
                    name='zipcode'
                    value={formData.zipcode}
                    readOnly
                    className='w-full p-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2] bg-gray-50'
                  />
                  <button
                    type='button'
                    onClick={handlePostcodeSearch}
                    className='w-full py-1 max-w-[120px] text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
                  >
                    주소 검색
                  </button>
                </div>
              </div>

              {/* 기본 주소 */}
              <div className='mb-1'>
                <label htmlFor='address1' className='block text-sm font-medium text-gray-700'>
                  기본 주소
                </label>
                <input
                  type='text'
                  id='address1'
                  name='address1'
                  value={formData.address1}
                  readOnly
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2] bg-gray-50'
                />
                {errors.address1 && <p className='text-sm text-red-500 mt-1'>{errors.address1}</p>}
                {success.address1 && (
                  <p className='text-sm text-green-500 mt-1'>{success.address1}</p>
                )}
              </div>

              {/* 상세 주소 */}
              <div className='mb-1'>
                <label htmlFor='address2' className='block text-sm font-medium text-gray-700'>
                  상세 주소
                </label>
                <input
                  type='text'
                  id='address2'
                  name='address2'
                  value={formData.address2}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
              </div>
            </div>

            {/* 이메일 */}
            <div className='mb-2'>
              <div className='flex flex-col'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  이메일
                </label>
                <div className='flex gap-3 mt-1'>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full p-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                  />

                  {/* 인증 버튼 */}
                  <button
                    onClick={() => {
                      if (!isValidEmail) return alert('이메일 형식을 확인 후 다시 시도하세요.');
                      if (isSendCode) {
                        handleEmailVerify();
                      } else {
                        handleSendEmailAuthCode();
                      }
                    }}
                    type='button'
                    className='w-full py-1 max-w-[120px] text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
                    disabled={!isSendCode}
                  >
                    {isSendCode ? '인증하기' : '발송하기'}
                  </button>
                </div>
              </div>
              {errors.email && <p className='text-sm text-red-500 mt-1'>{errors.email}</p>}
              {success.email && <p className='text-sm text-green-500 mt-1'>{success.email}</p>}
            </div>

            {/* 이메일 인증번호 */}
            <div className='mb-1'>
              <input
                type='text'
                id='code'
                name='code'
                placeholder='인증번호를 입력하세요(5자리)'
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                }}
                className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
              />
            </div>

            {/* 이용약관 */}
            <div className='flex items-center mb-6 mt-5'>
              <input
                type='checkbox'
                id='terms'
                className='mr-2 w-4 h-4 accent-[#4294F2]'
                required
              />
              <label htmlFor='terms' className='text-sm text-gray-700'>
                <span className='text-[#4294F2]'>이용약관</span>과{' '}
                <span className='text-[#4294F2]'>개인정보처리방침</span>에 동의합니다
              </label>
            </div>

            <button
              type='submit'
              className='w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
            >
              가입하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
