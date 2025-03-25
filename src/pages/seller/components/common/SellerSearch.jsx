function SellerSearch({ onSearch, placeholder }) {
  return (
    <form onSubmit={onSearch} className='flex w-full items-center gap-2 '>
      <input
        type='search'
        name='search'
        placeholder={placeholder}
        className='w-full max-w-[300px] rounded-sm border border-gray-200 p-1 focus:outline-gray-700'
      />
      <button
        type='submit'
        className='rounded-md border border-gray-200 px-2 py-1 font-normal active:bg-gray-400/30'
      >
        검색
      </button>
    </form>
  );
}

export default SellerSearch;
