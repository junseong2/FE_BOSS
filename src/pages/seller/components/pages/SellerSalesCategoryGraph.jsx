// interface SellerSalesCategoryGraphProps { }
import { Chart as ChartJS, ArcElement, Tooltip, Legend, scales } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function SellerSalesCategoryGraph({ data }) {
  const labels = data?.map((salesInfo) => salesInfo.categoryName);
  const totalSales = data?.map((salesInfo) => salesInfo.totalSales);

  const dataset = {
    labels: labels,
    datasets: [
      {
        data: totalSales,
        backgroundColor: [
          'rgba(26, 43, 62, 0.8)', // #1a2b3e
          'rgba(44, 62, 80, 0.8)', // #2c3e50
          'rgba(22, 160, 133, 0.8)', // #16a085
          'rgba(230, 126, 34, 0.8)', // #e67e22
          'rgba(243, 156, 18, 0.8)', // #f39c12
          'rgba(142, 68, 173, 0.8)', // #8e44ad
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className='lg:max-h-[350px] min-h-[200px] max-h-[500px] w-full h-full p-5 flex items-center justify-center lg:flex-row flex-col'>
      {data.length > 0 ? (
        <>
          <Doughnut
            data={dataset}
            anim
            options={{
                
              hover: {
                mode: null,
              },
            }}
          />
          <ul className='lg:mt-0 mt-5'>
            {data.map((info, i) => {
              return (
                <li key={info.categoryName} className='flex items-center justify-start  text-sm'>
                  <div className='w-3 h-3 bg-gray-500 rounded-sm'></div>
                  <div className='ml-3 flex'>
                    <span className='flex items-center gap-2'>
                      {i + 1}. {info.categoryName}
                    </span>
                    <p>(￦ {info.totalSales.toLocaleString()})</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      ) : (
        <p className='text-gray-500'>보여줄 데이터가 없네요!</p>
      )}
    </div>
  );
}
