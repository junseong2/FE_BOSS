export default function SellerDateFilter({ onChange }) {
  return (
    <div className='mb-8'>
      <select onChange={onChange} className='p-2.5 px-4  bg-white max-w-[180px] w-full border border-gray-200 :outline-gray-400 '>
        <option value={'now'}>오늘</option>
        <option value={'thisWeek'}>이번주</option>
        <option value={'thisMonth'}>이번달</option>
      </select>
    </div>
  );
}
