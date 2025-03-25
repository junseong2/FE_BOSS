export default function PasswordRecoveryForm({
  pwRecoveryData,
  handlePwRecoveryChange,
  handleResetPasswordSubmit,
}) {
  return (
    <form onSubmit={handleResetPasswordSubmit}>
      {/*사용자명 입력 */}
      <div className='mb-4'>
        <label htmlFor='username' className='block text-sm font-medium text-gray-700 mb-1'>
          이름
        </label>
        <input
          type='text'
          id='username'
          name='username'
          value={pwRecoveryData.username}
          onChange={handlePwRecoveryChange}
          className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
          required
        />
      </div>

      {/* 인증 방법 선택 */}
      <div className='mb-6'>
        {/* 이메일 입력 */}
        <div className='mb-4'>
          <label htmlFor='pw-email' className='block text-sm font-medium text-gray-700 mb-1'>
            이메일
          </label>
          <input
            type='email'
            id='pw-email'
            name='email'
            value={pwRecoveryData.email}
            onChange={handlePwRecoveryChange}
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
          />
        </div>
      </div>

      <button
        type='submit'
        className='w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md transition-colors'
      >
        비밀번호 재설정
      </button>
    </form>
  );
}
