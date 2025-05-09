export default function AddressSearch({post, onClick}) {
    return (
        <div className='mb-1'>
            <label htmlFor='post' className='block text-sm font-medium text-gray-700'>
                우편번호
            </label>
            <div className='flex gap-3 mt-1'>
                <input
                    type='text'
                    id='post'
                    name='post'
                    value={post}
                    readOnly
                    className='w-full p-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2] bg-gray-50'
                />
                <button
                    type='button'
                    onClick={onClick}
                    className='w-full py-1 max-w-[120px] text-white bg-[#4294F2] hover:bg-[#357BC2] rounded-md'
                >
                    주소 검색
                </button>
            </div>
        </div>
    )
}