import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
};

export default function SellerMonthlyGraph({ data }) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const datasets = {
    labels: labels,
    datasets: [
      {
        label: '월별 매출',
        data: values,
        backgroundColor: [
          '#2c3e50', // 블루 그레이
          '#1a1b3e', // 딥 블루
          '#16a085', // 에메랄드
          '#e67e22', // 오렌지
          '#8e44ad', // 퍼플
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };
  return (
    <div className='lg:max-h-[350px] min-h-[200px] max-h-[500px] w-full h-full p-5 flex items-center justify-center lg:flex-row flex-col'>
      {labels.length > 0 ? (
        <div className='flex flex-col w-full'>
          <Bar options={options} data={datasets} />
          <ul className='flex flex-col gap-2 items-center mt-5'>
            {labels.map((label, i)=>{
              return (
                <li key={label} className='flex items-center gap-2 text-sm'>
                  <div className='w-3 h-3 bg-[#1A2B3E] rounded-[3px]'></div>
                  <span>{label}</span>
                  <p>(￦{values[i]?.toLocaleString()})</p>
                </li>
              )

            })}
          </ul>
        </div>
      ) : (
        <p className='text-gray-500'>보여줄 데이터가 없네요!</p>
      )}
    </div>
  );
}
