import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import PasswordRecoveryForm from './components/PasswordRecoveryForm';
import AccountRecoveryForm from './components/AccountRecoveryForm';

export default function AccountRecoveryPage() {
  // 탭 상태 관리 (아이디 찾기 또는 비밀번호 찾기)
  const [activeTab, setActiveTab] = useState('findId');

  const navigate = useNavigate();

  // 폼 데이터 상태 관리
  const [idRecoveryData, setIdRecoveryData] = useState({
    username: '',
    email: '',
  });

  const [pwRecoveryData, setPwRecoveryData] = useState({
    username: '',
    email: '',
  });

  // 결과 상태 관리
  const [idRecoveryResult, setIdRecoveryResult] = useState('');
  const [pwRecoveryResult, setPwRecoveryResult] = useState('');

  // 아이디 찾기 폼 처리
  const handleIdRecoveryChange = (e) => {
    const { name, value } = e.target;
    setIdRecoveryData({
      ...idRecoveryData,
      [name]: value,
    });
  };

  // 비밀번호 찾기 폼 처리
  const handlePwRecoveryChange = (e) => {
    const { name, value } = e.target;
    setPwRecoveryData({
      ...pwRecoveryData,
      [name]: value,
    });
  };

  // 아이디 찾기 제출
  const handleFindIdSubmit = (e) => {
    e.preventDefault();



    // TODO: 실제 서버 처리 후 응답 메시지를 설정해야 함.
    setIdRecoveryResult('회원님의 아이디는 user123@example.com 입니다.');
  };

  // 비밀번호 찾기 제출
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();

    // TODO: 실제 서버 처리 후 응답 메시지 설정 해야 함.
    setPwRecoveryResult('이메일로 비밀번호 재설정 링크를 발송했습니다. 이메일을 확인해주세요.');
  };

  // 결과 창 리셋
  const resetResult = (type) => {
    if (type === 'id') {
      setIdRecoveryResult('');
    } else {
      setPwRecoveryResult('');
    }
  };

  return (
    <div className='relative bg-gray-100 min-h-screen flex flex-col justify-center items-center py-12'>
      <div className='w-full max-w-md'>
        <div className='bg-white rounded-lg shadow-xl overflow-hidden'>
          {/* 탭 네비게이션 */}
          <div className='flex'>
            <button
              className={`w-1/2 py-4 text-center transition-colors ${
                activeTab === 'findId'
                  ? 'bg-[#4294F2] text-white font-medium'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('findId');
                resetResult('pw');
              }}
            >
              아이디 찾기
            </button>
            <button
              className={`w-1/2 py-4 text-center transition-colors ${
                activeTab === 'resetPassword'
                  ? 'bg-[#4294F2] text-white font-medium'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setActiveTab('resetPassword');
                resetResult('id');
              }}
            >
              비밀번호 찾기
            </button>
          </div>

          <div className='p-8'>
            {/* 안내 메시지 */}
            <p className='text-gray-600 mb-6 text-sm'>
              {activeTab === 'findId'
                ? '회원가입 시 등록한 이름과 이메일을 입력하면 아이디를 찾을 수 있습니다.'
                : '회원가입 시 등록한 아이디와 이메일을 입력하면 비밀번호를 재설정할 수 있습니다.'}
            </p>

            {/* 아이디 찾기 폼 */}
            {activeTab === 'findId' && (
              <>
                {idRecoveryResult ? (
                  <div className='text-center'>
                    <div className='bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6'>
                      <p className='text-[#4294F2] font-medium'>{idRecoveryResult}</p>
                    </div>
                    <button
                      className='w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md transition-colors'
                      onClick={() => setActiveTab('resetPassword')}
                    >
                      비밀번호 찾기로 이동
                    </button>
                    <button
                      className='w-full py-3 mt-2 text-[#4294F2] bg-white border border-[#4294F2] hover:bg-blue-50 rounded-md transition-colors'
                      onClick={() => (window.location.href = '/signin')}
                    >
                      로그인하기
                    </button>
                  </div>
                ) : (
                  <AccountRecoveryForm
                    handleFindIdSubmit={handleFindIdSubmit}
                    handleIdRecoveryChange={handleIdRecoveryChange}
                    idRecoveryData={idRecoveryData}
                  />
                )}
              </>
            )}

            {/* 비밀번호 찾기 폼 */}
            {activeTab === 'resetPassword' && (
              <>
                {pwRecoveryResult ? (
                  <div className='text-center'>
                    <div className='bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6'>
                      <p className='text-[#4294F2] font-medium'>{pwRecoveryResult}</p>
                    </div>
                    <button
                      className='w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md transition-colors'
                      onClick={() => navigate('/signin')}
                    >
                      로그인하기
                    </button>
                    <button
                      className='w-full py-3 mt-2 text-[#4294F2] bg-white border border-[#4294F2] hover:bg-blue-50 rounded-md transition-colors'
                      onClick={() => setPwRecoveryResult('')}
                    >
                      다시 시도하기
                    </button>
                  </div>
                ) : (
                  <PasswordRecoveryForm
                    pwRecoveryData={pwRecoveryData}
                    handlePwRecoveryChange={handlePwRecoveryChange}
                    handleResetPasswordSubmit={handleResetPasswordSubmit}
                  />
                )}
              </>
            )}

            {/* 푸터 */}
            <div className='mt-6 pt-4 border-t border-gray-200 text-center'>
              <p className='text-sm text-gray-600'>
                <Link to={'/signin'} className='text-[#4294F2] hover:underline'>
                  로그인
                </Link>
                <span className='mx-2'>|</span>
                <Link to={'/signup'} className='text-[#4294F2] hover:underline'>
                  회원가입
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
