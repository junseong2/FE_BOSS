import React, { useState } from 'react';
import { registerUser } from '../services/auth.service';

const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phonePattern = /^[0-9]{10,11}$/;

export default function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });

  // 사용자 입력값 처리
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    validate(e.target.name, e.target.value);
  };

  // 폼 전송(회원가입 요청)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Object.values(errors).some((error) => error !== '')) {
      alert('폼에 오류가 있습니다. 다시 확인해주세요.');
      return;
    }

    await registerUser(formData)

    try {
      const response = await fetch('http://localhost:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.text();
      alert(result);

      if (response.ok) {
        window.location.href = '/signin'; // 회원가입 성공 시 로그인 페이지로 이동
      }
    } catch (error) {
      console.error('회원가입 실패:', error);
      alert('회원가입 중 오류가 발생했습니다.');
    }
  };

  /** 유효성 검사 결과 상태 업데이트 */
  const updateValidateField = (name, errorMessage) => {
    // 유효성 에러 메시지 상태 설정
    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  // 폼 유효성 검사
  const validate = (name, value) => {
    let errorMessage = '';
  
    switch (name) {
      case 'username':
        if (!value) {
          errorMessage = '이름을 입력하세요.';
        } else if (value.length < 3) {
          errorMessage = '이름은 3자 이상이어야 합니다.';
        }
        break;
      case 'email':
        if (!value) {
          errorMessage = '이메일을 입력하세요.';
        } else if (!emailPattern.test(value)) {
          errorMessage = '유효한 이메일 주소를 입력하세요.';
        }
        break;
      case 'password':
        if (!value) {
          errorMessage = '비밀번호를 입력하세요.';
        } else if (value.length < 8) {
          errorMessage = '비밀번호는 8자 이상이어야 합니다.';
        }
        break;
      case 'confirmPassword':
        if (!value) {
          errorMessage = '비밀번호 확인을 입력하세요.';
        } else if (value !== formData.password) {
          errorMessage = '비밀번호가 일치하지 않습니다.';
        }
        break;
      case 'phone':
        if (!value) {
          errorMessage = '전화번호를 입력하세요.';
        } else if (!phonePattern.test(value)) {
          errorMessage = '유효한 전화번호를 입력하세요.';
        }
        break;
      case 'address':
        if (!value) {
          errorMessage = '주소를 입력하세요.';
        }
        break;
      default:
    }
  
    updateValidateField(name, errorMessage);
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
                  className='w-full p-2 py-1.5  mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.username && <p className='text-sm text-red-500  mt-1'>{errors.username}</p>}
              </div>

              {/* 이메일 */}
              <div className='mb-1'>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                  이메일
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.email && <p className='text-sm text-red-500  mt-1'>{errors.email}</p>}
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
                  className='w-full p-2 py-1.5  mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.password && <p className='text-sm text-red-500  mt-1'>{errors.password}</p>}
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
                  className='w-full p-2 py-1.5  mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.confirmPassword && (
                  <p className='text-sm text-red-500  mt-1'>{errors.confirmPassword}</p>
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
                  className='w-full p-2 py-1.5  mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.phone && <p className='text-sm text-red-500  mt-1'>{errors.phone}</p>}
              </div>

              {/* 주소 */}
              <div className='mb-1'>
                <label htmlFor='address' className='block text-sm font-medium text-gray-700'>
                  주소
                </label>
                <input
                  type='text'
                  id='address'
                  name='address'
                  value={formData.address}
                  onChange={handleChange}
                  className='w-full p-2 py-1.5  mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
                {errors.address && <p className='text-sm text-red-500  mt-1'>{errors.address}</p>}
              </div>
            </div>

            {/* 이용약관 */}
            <div className='flex items-center mb-6'>
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

