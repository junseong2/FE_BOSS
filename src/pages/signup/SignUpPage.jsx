import React, { useState, useEffect } from 'react';
import useMessage from './hooks/useMessage';

import NameInput from './components/inputGroup/NameInput';
import PasswordInput from './components/inputGroup/PasswordInput';
import ConfirmPasswordInput from './components/inputGroup/ConfirmPasswordInput';
import AddressSearch from './components/inputGroup/AddressSearch';
import AddressInput from './components/inputGroup/AddressInput';
import EmailInput from './components/inputGroup/EmailInput';
import EmailCodeInput from './components/inputGroup/EmailCodeInput';
import SignUpForm from './components/SignUpForm';

import { emailCheck, formErrorsValidation, phoneNumberCheck } from '../../utils/validation';
import { registerUser, sendEmailAuthCode, verifyEmailAuthCode } from '../../services/auth.service';
import { validateField } from './utils/signup.utils';

import { IoBagHandle } from "react-icons/io5";
import PhoneInput from './components/inputGroup/PhoneInput';
import TermsCheckbox from './components/inputGroup/TermsCheckBox';
import SubmitButton from './components/inputGroup/SubmitButton';



export default function SignUpPage() {
  const [code, setCode] = useState(''); // 이메일 인증 코드
  const [isSendCode, setIsSendCode] = useState(false);
  const [isAuthEmail, setIsAuthEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 전송 로딩 상태
  const [isAgreeTerms, setIsAgreeTerms] = useState(false);

  const { errors, success, updateValidateField } = useMessage(); // 예외처리 메시지 핸들링


  // 폼 데이터 메시지
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone1: '',
    phone2: '',
    phone3: '',
    post: '',
    address1: '',
    address2: '',
  });



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
        console.log(data)
        setFormData((prev) => ({
          ...prev,
          post: data.zonecode,
          address1: data.address,
        }));

        // 유효성 검사 결과 메시지 업데이트
        updateValidateField({ name: 'address1', successMessage: '주소가 확인되었습니다.', errorMessage: '' })
      },
    }).open();
  };

  const isValidEmail = emailCheck(formData.email); // 이메일 유효성 -> 이게 통과되어야 발송 버튼 활성화
  const isSuccessValidationForm = formErrorsValidation(errors); // 폼 유효성 검사 결과

  //사용자 입력값 처리
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    validate(name, value);
  };

  //이메일 코드 인증
  const handleEmailVerify = async () => {
    setIsLoading(true);
    if (formData.email === '') {
      alert('이메일을 입력하세요.');
    }

    const isAuth = await verifyEmailAuthCode(code, formData.email);

    //인증 성공 시
    if (isAuth) {
      setIsAuthEmail(true); // 이메일 인증 완료 상태로 설정
      updateValidateField({ name: 'email', successMessage: '이메일이 인증되었습니다.', errorMessage: '' })

      // 인증 실패시
    } else {
      alert('이메일 인증에 실패했습니다. 다시 시도해주세요.');
      updateValidateField({ name: 'email', successMessage: '', errorMessage: '인증에 실패하였습니다. 확인 후 재시도해주세요.' })
    }

    setIsLoading(false);
  };

  // 이메일 인증코드 전송
  const handleSendEmailAuthCode = async () => {
    setIsLoading(true);
    if (formData.email === '') {
      alert('이메일을 입력하세요.');
      return;
    }
    try {
      const isSuccess = await sendEmailAuthCode(formData.email); // 비동기 처리
      setIsSendCode(isSuccess);
    } catch (error) {
      alert('이메일 인증 코드 전송 실패');
    } finally {
      setIsLoading(false);
    }
  };

  // 폼 전송(회원가입 요청)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isSuccessValidationForm) {
      return alert('폼에 오류가 있습니다. 다시 확인해주세요.');
    }

    // 주소를 리스트 구조로 묶어서 전송
    const userPayload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phones: `${formData.phone1},${formData.phone2},${formData.phone3}`,
      addresses: [
        {
          address1: formData.address1,
          address2: formData.address2,
          post: formData.post,
          isDefault: true
        }
      ]
    };


    const isLogin = await registerUser(userPayload);
    if (isLogin) {
      alert('회원가입이 완료되었습니다!');
      window.location.href = '/';
    } else {
      alert('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };


  // 휴대폰 유효성
  const isValidPhone = phoneNumberCheck(formData.phone1 + formData.phone2 + formData.phone3);

  // 유효성 검사
  function validate(name, value) {
    const result = validateField({name, value, isValidPhone, isAuthEmail, formData})
    updateValidateField(result)
  }


  return (
    <div className='relative bg-gray-50 min-h-screen flex flex-col justify-center items-center py-12'>
      <div className='max-w-7xl w-full px-6 lg:px-0 flex flex-col lg:flex-row items-center'>
        <div className='lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0'>
          <h1 className='text-3xl lg:text-4xl font-bold text-[#4294F2] pl-1 mb-4'>BOSS</h1>
          <p className='lg:block hidden text-lg text-gray-600 mb-6 max-w-lg mx-auto lg:mx-0'>
            간편하게 로그인하고 서비스를 이용해보세요. 아직 회원이 아니신가요? 지금 바로 가입하세요!
            <IoBagHandle className='text-9xl mx-auto mt-3 rotate-5 animate-pulse' color='#4294F2' />

          </p>
        </div>

        <SignUpForm onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 gap-4 mb-6'>
            <NameInput username={formData.username} error={errors.username} success={success.username} onChange={handleChange} />
            <PasswordInput password={formData.password} error={errors.password} success={success.password} onChange={handleChange} />
            <ConfirmPasswordInput confirmPassword={formData.confirmPassword} error={errors.confirmPassword} success={success.confirmPassword} onChange={handleChange} />
            <PhoneInput formData={{ phone1: formData.phone1, phone2: formData.phone2, phone3: formData.phone3 }} error={errors.phone} success={success.phone} onChange={handleChange} />
            <AddressSearch post={formData.post} onClick={handlePostcodeSearch} />
            <AddressInput defaultAddress={formData.address1} detailAddress={formData.address2} error={errors.address1} success={success.address1} onChange={handleChange} />
          </div>

          <EmailInput
            formData={formData}
            isValidEmail={isValidEmail}
            isSendCode={isSendCode}
            isAuthEmail={isAuthEmail}
            isLoading={isLoading}
            error={errors.email}
            success={success.email}
            onChange={handleChange}
            onSendEmailAuthCode={handleSendEmailAuthCode}
            onEmailVerify={handleEmailVerify}
          />

          <EmailCodeInput code={code} setCode={setCode} />
          <TermsCheckbox
            isChecked={isAgreeTerms}
            onChange={(e) => setIsAgreeTerms(e.target.checked)}
          />
          <SubmitButton
            isLoading={isLoading}
            isDisabled={!isSuccessValidationForm || !isAuthEmail}
          />
        </SignUpForm>
      </div>
    </div>
  );
}
