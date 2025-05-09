export default function EmailCodeInput({ code, setCode }) {
    return (
      <div className='mb-1'>
        <input
          type='password'
          id='code'
          name='code'
          placeholder='인증번호를 입력하세요(5자리)'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
        />
      </div>
    );
  }