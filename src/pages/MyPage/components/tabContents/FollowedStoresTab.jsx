export default function FollowedStoresTab() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">팔로우 상점 정보</h2>
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-24 h-24 bg-slate-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-12 w-12 text-slate-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">아직 팔로우한 상점이 없습니다.</p>
                <button className="px-4 py-2 bg-blue-300 hover:bg-blue-400 text-white rounded-lg transition-colors">
                    상점 둘러보기
                </button>
            </div>
        </div>
    )
}