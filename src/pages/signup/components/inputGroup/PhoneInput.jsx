export default function PhoneInput({ formData, onChange, error, success }) {
    return (
        <div className='mb-1'>
            <div className='flex flex-col items-start'>
                <label htmlFor='phone1' className='block text-sm font-medium text-gray-700'>
                    전화번호
                </label>
                <div className='flex items-center gap-1'>
                    <input
                        type='text'
                        id='phone1'
                        name='phone1'
                        maxLength={3}
                        value={formData.phone1}
                        onChange={onChange}
                        placeholder='010'
                        className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                    />
                    -
                    <input
                        type='text'
                        id='phone2'
                        name='phone2'
                        maxLength={4}
                        value={formData.phone2}
                        onChange={onChange}
                        placeholder='0000'
                        className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                    />
                    -
                    <input
                        type='text'
                        id='phone3'
                        name='phone3'
                        maxLength={4}
                        value={formData.phone3}
                        onChange={onChange}
                        placeholder='0000'
                        className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
                    />
                </div>
                {error && <p className='text-sm text-red-500 pl-1 mt-1'>{error}</p>}
                {success && <p className='text-sm text-[#4294F2] pl-1 mt-1'>{success}</p>}
            </div>
        </div>
    )
}
