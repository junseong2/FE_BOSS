export default function InputField({ label, id, type = 'text', value, error, success, onChange }) {
  return (
    <div className='mb-1'>
      <label htmlFor={id} className='block text-sm font-medium text-gray-700'>
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className={`w-full p-2 py-1.5 mt-1 border rounded-md focus:outline-none focus:ring-2 
            ${error ? 'border-red-500 focus:ring-red-500' : success ? 'border-green-500 focus:ring-green-500' : 'border-gray-300 focus:ring-blue-500'}`}
      />
      {error && <p className='text-red-500 text-xs mt-1'>{error}</p>}
      {success && <p className='text-green-500 text-xs mt-1'>{success}</p>}
    </div>
  );
}
