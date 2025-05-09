// interface PropsType { }

export default function PasswordInput({ password, onChange, error, success }) {
    return (
        <div className='mb-1'>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                비밀번호
            </label>
            <input
                type='password'
                id='password'
                name='password'
                value={password}
                onChange={onChange}
                className='w-full p-2 py-1.5 mt-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#4294F2]'
            />
            {error && (
                <p className='text-sm text-red-500 pl-1 mt-1'>{error}</p>
            )}
            {success && (
                <p className='text-sm text-[#4294F2] pl-1 mt-1'>{success}</p>
            )}
        </div>
    )
}