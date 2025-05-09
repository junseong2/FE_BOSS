export default function SettingsTab({ darkMode, language, setDarkMode, setLanguage }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md dark:border dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">계정 설정</h2>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">다크 모드</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">어두운 테마로 전환합니다</p>
                    </div>
                    <label htmlFor="dark-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            id="dark-toggle"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                    </label>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">언어 설정</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">현재 언어: {language}</p>
                    </div>
                    <select
                        className="border rounded-lg p-2 text-sm bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="한국어">한국어</option>
                        <option value="English">English</option>
                        <option value="日本語">日本語</option>
                        <option value="中文">中文</option>
                    </select>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-medium text-gray-800 dark:text-white">개인정보 보호</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">프로필 정보 공개 설정</p>
                    </div>
                    <select className="border rounded-lg p-2 text-sm bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-300 focus:border-blue-300">
                        <option value="public">전체 공개</option>
                        <option value="friends">친구에게만 공개</option>
                        <option value="private">비공개</option>
                    </select>
                </div>
            </div>
        </div>
    )
}