export default function AccountRecoveryForm({
  handleFindIdSubmit,
  idRecoveryData,
  handleIdRecoveryChange,
}) {
  return (
    <form onSubmit={handleFindIdSubmit}>
      {/* 이름 입력 */}
      <div className='mb-4'>
        <label htmlFor='name' className='block text-sm font-medium text-gray-700 mb-1'>
          이름
        </label>
        <input
          type='text'
          id='name'
          name='name'
          value={idRecoveryData.name}
          onChange={handleIdRecoveryChange}
          className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
          required
        />
      </div>

      {/* 인증 방법 선택 */}
      <div className='mb-6'>
        {/* 이메일 입력 */}
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
            이메일
          </label>
          <input
            type='email'
            id='email'
            name='email'
            value={idRecoveryData.email}
            onChange={handleIdRecoveryChange}
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
          />
        </div>
      </div>

      <button
        type='submit'
        className='w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md transition-colors'
      >
        아이디 찾기
      </button>
    </form>
  );
}
