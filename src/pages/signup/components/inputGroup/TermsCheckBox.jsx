export default function TermsCheckbox({ isChecked, onChange }) {
    return (
      <div className='flex items-center mb-6 mt-5'>
        <input
          type='checkbox'
          id='terms'
          className='mr-2 w-4 h-4 accent-[#4294F2]'
          checked={isChecked}
          onChange={onChange}
          required
        />
        <label htmlFor='terms' className='text-sm text-gray-700'>
          <span className='text-[#4294F2] pl-1'>이용약관</span>과
          <span className='text-[#4294F2] pl-1'>개인정보처리방침</span>에 동의합니다
        </label>
      </div>
    );
  }