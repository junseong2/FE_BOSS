import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

export default function SellerSalesCategoryGraph({ data }) {
  const labels = data?.map((salesInfo) => salesInfo.categoryName)
  const totalSales = data?.map((salesInfo) => salesInfo.totalSales)

  const dataset = {
    labels: labels,
    datasets: [
      {
        data: totalSales,
        backgroundColor: [
          "rgba(26, 43, 62, 0.8)", // #1a2b3e
          "rgba(44, 62, 80, 0.8)", // #2c3e50
          "rgba(22, 160, 133, 0.8)", // #16a085
          "rgba(230, 126, 34, 0.8)", // #e67e22
          "rgba(243, 156, 18, 0.8)", // #f39c12
          "rgba(142, 68, 173, 0.8)", // #8e44ad
        ],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  const chartOptions = {
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
          label: (context) => `${context.label}: ￦${context.raw.toLocaleString()}`,
        },
      },
    },
    hover: {
      mode: null,
    },
  }

  return (
    <div className="h-full w-full flex flex-col lg:flex-row items-center justify-between">
      {data.length > 0 ? (
        <>
          <div className="w-full lg:w-1/2 h-[300px] flex items-center justify-center">
            <Doughnut data={dataset} options={chartOptions} />
          </div>
          <div className="w-full lg:w-1/2 lg:pl-6 mt-6 lg:mt-0">
            <h4 className="text-sm font-medium text-gray-500 mb-3">카테고리별 매출 현황</h4>
            <ul className="space-y-3">
              {data.map((info, i) => (
                <li key={info.categoryName} className="flex items-center text-sm">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: dataset.datasets[0].backgroundColor[i % 6] }}
                  ></div>
                  <div className="ml-3 flex flex-col">
                    <span className="font-medium">
                      {i + 1}. {info.categoryName}
                    </span>
                    <span className="text-gray-600">￦ {info.totalSales.toLocaleString()}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="w-full h-[300px] flex items-center justify-center">
          <p className="text-gray-500 text-center">
            <span className="block text-4xl mb-2">📊</span>
            보여줄 데이터가 없네요!
          </p>
        </div>
      )}
    </div>
  )
}
