import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../lib/api"

import {
  IoHeartOutline,
  IoPersonCircleSharp as User,
  IoBagHandleOutline as ShoppingBag,
  IoLogOutOutline as LogOut,
  IoNotificationsOutline as Bell,
  IoSettingsOutline as Settings,
  IoMenuOutline as Menu,
  IoCloseOutline as Close,
} from "react-icons/io5"

const Sidebar = ({ activeTab, setActiveTab, userId, userName, setUserId, setUserName }) => {
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(BASE_URL+"/auth/user-info", {
          method: "GET",
          credentials: "include",
        })

        if (res.status === 403) {
          navigate("/signin")
          return
        }

        const data = await res.json()
        setUserId(data.userId)
        setUserName(data.userName)
      } catch (error) {
        console.error("❌ 사용자 정보 조회 실패:", error)
      }
    }

    fetchUserInfo()
  }, [navigate, setUserId, setUserName])

  const handleLogoutClick = async () => {
    const confirmLogout = window.confirm("정말 로그아웃하시겠습니까?")
    if (!confirmLogout) return

    try {
      await fetch(BASE_URL+"/auth/logout", {
        method: "GET",
        credentials: "include",
      })
      setUserId(null)
      setUserName(null)
      alert("로그아웃 되었습니다.")
      navigate("/")
      window.location.reload()
    } catch (error) {
      alert("로그아웃 처리 중 오류가 발생했습니다.")
      console.error("❌ 로그아웃 실패:", error)
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const handleTabClick = (tab) => {
    setActiveTab(tab)
    setIsMobileMenuOpen(false) // Close mobile menu when tab is selected
  }

  const menuItems = [
    { id: "profile", label: "프로필 정보", icon: <User className="h-5 w-5" /> },
    { id: "orders", label: "주문 내역", icon: <ShoppingBag className="h-5 w-5" /> },
    { id: "followedStores", label: "팔로우 상점 정보", icon: <IoHeartOutline className="h-5 w-5" /> },
    { id: "notifications", label: "알림 설정", icon: <Bell className="h-5 w-5" /> },
    { id: "settings", label: "계정 설정", icon: <Settings className="h-5 w-5" /> },
  ]

  return (
    <>
      {/* Mobile Menu Button - Always visible on small screens */}
      <div className="md:hidden fixed top-20 left-4 z-30">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-full bg-white shadow-md text-gray-600 hover:bg-gray-50 transition-colors"
          aria-label={isMobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {isMobileMenuOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:relative z-25
          ${isMobileMenuOpen ? "left-0" : "-left-80"} 
          md:left-0 transition-all duration-300 ease-in-out
          w-72 md:w-64 h-full overflow-y-auto
          shadow-md rounded-xl
        `}
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl dark:border dark:border-gray-700 shadow-md h-auto md:h-full overflow-hidden">
          {/* User Profile Section */}
          <div className="p-6 flex flex-col items-center dark:border dark:border-gray-700">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-300 to-blue-400 flex items-center justify-center mb-4 shadow-md">
              <User className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-medium text-lg text-gray-800 dark:text-white">{userName || "게스트"}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">사용자 ID: {userId ?? "로그인 필요"}</p>
          </div>

          {/* Navigation Menu */}
          <div className="flex flex-col space-y-1 p-3">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg font-medium transition-all
                  ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                  }`}
              >
                <span
                  className={`${activeTab === item.id ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className="flex items-center gap-3 px-4 py-3 mt-2 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>로그아웃</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation - Always visible on mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 border-t dark:border-gray-700 shadow-lg z-20">
        <div className="flex justify-around items-center h-16">
          {menuItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`flex flex-col items-center justify-center p-2 ${
                activeTab === item.id ? "text-blue-500 dark:text-blue-400" : "text-gray-600 dark:text-gray-400"
              }`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label.split(" ")[0]}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

export default Sidebar
