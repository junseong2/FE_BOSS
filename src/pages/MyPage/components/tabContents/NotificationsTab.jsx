export default function NotificationsTab() {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">알림 설정</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">이메일 알림</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            주문 및 배송 관련 알림을 이메일로 받습니다
                        </p>
                    </div>
                    <label htmlFor="email-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="email-toggle" className="sr-only peer" onChange={() => { }} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">SMS 알림</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            주문 및 배송 관련 알림을 SMS로 받습니다
                        </p>
                    </div>
                    <label htmlFor="sms-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="sms-toggle" className="sr-only peer" onChange={() => { }} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">앱 푸시 알림</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">모바일 앱에서 푸시 알림을 받습니다</p>
                    </div>
                    <label htmlFor="push-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="push-toggle"
                            className="sr-only peer"
                            defaultChecked
                            onChange={() => { }}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                    </label>
                </div>
            </div>
        </div>
    )
}