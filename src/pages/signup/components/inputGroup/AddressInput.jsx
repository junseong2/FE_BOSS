export default function AddressInput({defaultAddress, detailAddress, error, success, onChange}) {
    return (
        <>
            {/* 기본 주소 */}
            <div className='mb-1'>
                <label htmlFor='address1' className='block text-sm font-medium text-gray-700'>
                    기본 주소
                </label>
                <input
                    type='text'
                    id='address1'
                    name='address1'
                    value={defaultAddress}
                    readOnly
                    className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2] bg-gray-50'
                />
                {error && (
                    <p className='text-sm text-red-500 pl-1 mt-1'>{error}</p>
                )}
                {success && (
                    <p className='text-sm text-[#4294F2] pl-1 mt-1'>{success}</p>
                )}
            </div>

            {/* 상세 주소 */}
            <div className='mb-1'>
                <label htmlFor='address2' className='block text-sm font-medium text-gray-700'>
                    상세 주소
                </label>
                <input
                    type='text'
                    id='address2'
                    name='address2'
                    value={detailAddress}
                    onChange={onChange}
                    className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                />
            </div>
        </>
    )
}