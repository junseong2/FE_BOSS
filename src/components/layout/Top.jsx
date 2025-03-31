"use client"

import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { IoSearch, IoCartOutline, IoPersonOutline, IoLogOutOutline } from "react-icons/io5"
import { MdDashboard, MdStorefront } from "react-icons/md"
import { useCart } from "../../context/CartContext"
import fetchUserInfo from "../../utils/api.js"
import { useUser } from "../../context/UserContext"
import SignIn from "../../pages/SignIn"

// Since you're using Vite with React Router, you likely don't have the shadcn/ui components
// Let's create a version that uses standard HTML elements with Tailwind classes

export default function Top() {
  const { userId, setUserId, userName, setUserName } = useUser()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [emails, setEmails] = useState([""])
  const [phones, setPhones] = useState([""])
  const [addresses, setAddresses] = useState([{ address1: "", address2: "", post: "", isDefault: false }])
  const [searchQuery, setSearchQuery] = useState("")
  const [showCartPopup, setShowCartPopup] = useState(false)
  const { cartItems, loadCart } = useCart()
  const [loadingCart, setLoadingCart] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const getUserInfo = async () => {
      await fetchUserInfo(setUserId, setUserName, setEmails, setPhones, setAddresses)
    }
    getUserInfo()
  }, [])

  const handleSignInClick = async () => {
    const currentUrl = location.pathname + location.search
    console.log("현재 URL:", currentUrl)
    setIsModalOpen(true)
  }

  const handleLogoutClick = async () => {
    await fetch("http://localhost:5000/auth/logout", { method: "GET", credentials: "include" })
    setUserId(null)
    setUserName(null)
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleMouseEnter = async () => {
    setLoadingCart(true)
    await loadCart()
    setLoadingCart(false)
    setShowCartPopup(true)
  }

  const handleMouseLeave = () => {
    setShowCartPopup(false)
  }

  const getCartItemList = () => {
    if (cartItems.length === 0) {
      return <p className="py-2 text-center text-sm text-gray-500">장바구니가 비어 있습니다</p>
    }
    return (
      <div className="max-h-60 overflow-y-auto">
        {cartItems.map((item, index) => (
          <div key={index} className="py-2 px-3 border-b border-gray-100 last:border-0">
            <div className="font-medium text-sm">{item.productName}</div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{item.productPrice.toLocaleString()}원</span>
              <span>수량: {item.quantity}</span>
            </div>
          </div>
        ))}
        <div className="p-2 mt-2">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm transition-colors"
            onClick={() => navigate("/cart")}
          >
            장바구니 보기
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="h-20"></div>
      <header className="fixed top-0 left-0 w-full h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50 shadow-sm">
      
        
        <div className="flex items-center">
          <img
            src={`${import.meta.env.VITE_BACKEND_URL}/uploads/boss_logo.png`}
            className="w-16 h-auto cursor-pointer transition-transform hover:scale-105"
            onClick={() => navigate("/")}
            alt="Boss Logo"
          />

          <form className="hidden md:flex items-center ml-8" onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                className="w-80 pl-4 pr-10 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="검색어 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                <IoSearch className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>

        <div className="flex items-center gap-2">
          {userId ? (
            <>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-700">
                  <span className="font-semibold text-black-600">{userName}</span>님
                </p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  onClick={() => navigate("/editor")}
                >
                  <MdDashboard className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    에디터
                  </span>
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  onClick={() => navigate("/seller")}
                >
                  <MdStorefront className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    판매자
                  </span>
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  onClick={() => navigate("/mypage")}
                >
                  <IoPersonOutline className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    마이페이지
                  </span>
                </button>

                <button
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors relative group"
                  onClick={handleLogoutClick}
                >
                  <IoLogOutOutline className="h-5 w-5" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    로그아웃
                  </span>
                </button>

                <div className="relative">
                  <button
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate("/cart")}
                  >
                    <IoCartOutline className="h-5 w-5" />
                    {cartItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cartItems.length}
                      </span>
                    )}
                  </button>

                  {showCartPopup && (
                    <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg w-64 z-50">
                      <div className="p-2 font-medium border-b">장바구니</div>
                      {loadingCart ? (
                        <div className="py-4 text-center text-sm text-gray-500">로딩 중...</div>
                      ) : (
                        getCartItemList()
                      )}
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <button
              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
              onClick={handleSignInClick}
            >
              로그인
            </button>
          )}
        </div>
      </header>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <SignIn onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  )
}

