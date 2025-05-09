export default function SubmitButton({ isLoading, isDisabled }) {
    return (
        <button
            type='submit'
            disabled={isLoading || isDisabled}
            className='disabled:opacity-70 disabled:cursor-not-allowed w-full py-3 text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
        >
            {isLoading ? '처리중..' : '가입하기'}
        </button>
    );
}