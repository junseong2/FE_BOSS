import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import UserProfile from "./components/UserProfile"
import OrderList from "./components/OrderList"
import { useNavigate } from "react-router-dom"
import {BASE_URL} from '../../lib/api'

const MyPage = () => {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("한국어")
  const navigate = useNavigate()

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(BASE_URL+"/auth/user-info", {
        method: "GET",
        credentials: "include",
      })

      if (response.status === 403) {
        console.warn("❌ 로그인 정보 없음. 로그인 페이지로 이동.")
        navigate("/signin")
        return
      }

      if (!response.ok) {
        throw new Error("로그인 정보 조회 실패")
      }

      const data = await response.json()
      setUserId(data.userId)
      setUserName(data.userName)
    } catch (error) {
      console.error("❌ 사용자 정보 조회 오류:", error.message)
    }
  }

  useEffect(() => {
    fetchUserInfo()
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  return (
    <div
      className={`flex items-stretch min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white"}`}
    >
      <div className="mx-auto px-4 py-8 pt-24 md:pt-8 container">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/4 w-full">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              userName={userName}
              userId={userId}
              setUserId={setUserId}
              setUserName={setUserName}
            />
          </div>

          <div className="flex-1 mt-4 md:mt-0">
            {activeTab === "profile" && <UserProfile maskPassword={true} />}
            {activeTab === "orders" && <OrderList userId={userId} />}
            {activeTab === "followedStores" && (
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
            )}
            {activeTab === "notifications" && (
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
                      <input type="checkbox" id="email-toggle" className="sr-only peer" onChange={() => {}} />
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
                      <input type="checkbox" id="sms-toggle" className="sr-only peer" onChange={() => {}} />
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
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-200 dark:peer-focus:ring-blue-700 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-300"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "settings" && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyPage
