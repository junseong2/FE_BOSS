import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function SellerMonthlyGraph({ data }) {
  const labels = Object.keys(data)
  const values = Object.values(data)

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `매출: ￦${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) => {
            if (value >= 1000000) {
              return `${(value / 1000000).toFixed(1)}M`
            } else if (value >= 1000) {
              return `${(value / 1000).toFixed(0)}K`
            }
            return value
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  const datasets = {
    labels: labels,
    datasets: [
      {
        label: "월별 매출",
        data: values,
        backgroundColor: [
          "rgba(44, 62, 80, 0.8)", // 블루 그레이
          "rgba(26, 43, 62, 0.8)", // 딥 블루
          "rgba(22, 160, 133, 0.8)", // 에메랄드
          "rgba(230, 126, 34, 0.8)", // 오렌지
          "rgba(142, 68, 173, 0.8)", // 퍼플
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }

  return (
    <div className="h-full w-full">
      {labels.length > 0 ? (
        <div className="flex flex-col h-full">
          <div className="h-[300px]">
            <Bar options={options} data={datasets} />
          </div>
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-500 mb-3">월별 매출 현황</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {labels.map((label, i) => (
                <div key={label} className="flex items-center p-2 bg-gray-50 rounded-md border border-gray-100">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: datasets.datasets[0].backgroundColor[i % 5] }}
                  ></div>
                  <div className="ml-2 text-sm">
                    <span className="font-medium">{label}</span>
                    <p className="text-gray-600">￦{values[i]?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <p className="text-gray-500 text-center">
            <span className="block text-4xl mb-2">📈</span>
            보여줄 데이터가 없네요!
          </p>
        </div>
      )}
    </div>
  )
}
