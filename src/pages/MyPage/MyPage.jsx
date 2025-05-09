import { useEffect, useState } from "react"
import Sidebar from "./components/Sidebar"
import OrderList from "./components/OrderList"
import { useNavigate } from "react-router-dom"
import { getUserInfo } from "../../services/user.service"
import ProfileTab from "./components/tabContents/ProfileTab"
import FollowedStoresTab from "./components/tabContents/FollowedStoresTab"
import NotificationsTab from "./components/tabContents/NotificationsTab"
import SettingsTab from "./components/tabContents/SettingsTab"

export default function MyPage() {
  const [userName, setUserName] = useState("")
  const [userId, setUserId] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState("한국어")


  const navigate = useNavigate()

  // 유저 정보 조회
  const fetchUserInfo = async () => {
    const data = getUserInfo(navigate)
    setUserId(data.userId)
    setUserName(data.userName)
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
            {activeTab === "profile" && <ProfileTab maskPassword={true} />}
            {activeTab === "orders" && <OrderList userId={userId} />}
            {activeTab === "followedStores" && <FollowedStoresTab />}
            {activeTab === "notifications" && <NotificationsTab />}
            {activeTab === "settings" && <SettingsTab language={language} darkMode={darkMode} setDarkMode={setDarkMode} setLanguage={setLanguage} />}
          </div>
        </div>
      </div>
    </div>
  )
}
