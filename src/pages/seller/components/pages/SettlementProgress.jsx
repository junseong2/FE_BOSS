export default function SettlementProgress() {
  const progressData = [
    { label: '3월 하반기 정산', percentage: 75 },
    { label: '3월 상반기 정산', percentage: 100 },
    { label: '2월 하반기 정산', percentage: 100 },
  ];

  return (
    <div className='bg-white border border-gray-200 p-6 mx-auto w-full mt-5'>
      <h2 className='text-xl font-bold mb-6'>정산 진행 현황</h2>

      {progressData.map((item, index) => (
        <div key={index} className='mb-4'>
          <div className='flex justify-between mb-1'>
            <span className='text-sm font-medium'>{item.label}</span>
            <span className='text-sm font-medium'>{item.percentage}%</span>
          </div>
          <div className='w-full bg-gray-200 rounded-full h-2.5'>
            <div
              className='bg-[#1a2b3e] h-2.5 rounded-full'
              style={{ width: `${item.percentage}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
