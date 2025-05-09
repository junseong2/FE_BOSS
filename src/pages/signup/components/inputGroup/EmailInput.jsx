export default function EmailInput({
    formData,
    onChange,
    onSendEmailAuthCode,
    onEmailVerify,
    isValidEmail,
    isSendCode,
    isAuthEmail,
    isLoading,
    error,
    success
}) {
    return (
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
                        onChange={onChange}
                        className='w-full p-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                    />

                    <button
                        onClick={() => {
                            if (!isValidEmail) return alert('이메일 형식을 확인 후 다시 시도하세요.');

                            if (isSendCode) {
                                onEmailVerify();
                            } else {
                                onSendEmailAuthCode();
                            }
                        }}
                        type='button'
                        className='disabled:opacity-70 disabled:cursor-not-allowed w-full py-1 max-w-[120px] text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
                        disabled={isAuthEmail || isLoading}
                    >
                        {isLoading ? '처리중' : isSendCode ? '인증하기' : '발송하기'}
                    </button>
                </div>
            </div>
            {error && <p className='text-sm text-red-500 pl-1 mt-1'>{error}</p>}
            {success && <p className='text-sm text-[#4294F2] pl-1 mt-1'>{success}</p>}
        </div>
    );
}
