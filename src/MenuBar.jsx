import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { FaBars, FaTimes } from "react-icons/fa"
import {
  IoHomeOutline,
  IoInformationOutline,
  IoHelpCircleOutline,
  IoGiftOutline,
  IoChevronDownOutline,
  IoChevronForwardOutline,
} from "react-icons/io5"
import axios from "axios"

function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isIconClicked, setIsIconClicked] = useState(false)
  const [categories, setCategories] = useState([])
  const [openSubMenu, setOpenSubMenu] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/category/root")
        setCategories(response.data)
      } catch (error) {
        console.error("카테고리 데이터를 불러오는 중 오류 발생:", error)
      }
    }
    fetchCategories()
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
    setIsIconClicked((prev) => !prev)
  }

  const handleCategoryClick = async (categoryId, e) => {
    e.preventDefault()
    if (openSubMenu?.id === categoryId) {
      setOpenSubMenu(null)
      return
    }
    try {
      const response = await axios.get(`http://localhost:5000/category/${categoryId}/subcategories`)
      setOpenSubMenu({ id: categoryId, subcategories: response.data })
    } catch (error) {
      console.error("서브카테고리 데이터를 불러오는 중 오류 발생:", error)
    }
  }

  useEffect(() => {
    setIsMenuOpen(false)
    setIsIconClicked(false)
  }, [location.pathname])

  return (
    <>
      <div
        className="fixed top-3 left-3 z-50 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:bg-gray-100"
        onClick={toggleMenu}
        aria-label="메뉴 열기/닫기"
      >
        {isIconClicked ? (
          <FaTimes className="text-xl text-blue-600 transition-transform duration-300 transform rotate-90" />
        ) : (
          <FaBars className="text-xl text-blue-600 transition-transform duration-300" />
        )}
      </div>


      <div
        className={`fixed top-0 left-0 h-full w-[85vw] max-w-[280px] bg-white shadow-xl z-40 transition-transform duration-300 ease-in-out transform ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white mt-20">
          <h2 className="text-lg font-bold">메뉴</h2>
          <button
            onClick={toggleMenu}
            className="text-white hover:text-gray-200 transition-colors p-2"
            aria-label="메뉴 닫기"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="py-1">
          <Link to="/" className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === "/" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3" : ""}`}>
            <IoHomeOutline className="text-lg mr-3" />
            <span className="font-medium text-sm">홈</span>
          </Link>

          <Link to="/about" className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === "/about" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3" : ""}`}>
            <IoInformationOutline className="text-lg mr-3" />
            <span className="font-medium text-sm">소개</span>
          </Link>

          <Link to="/contact" className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === "/contact" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3" : ""}`}>
            <IoHelpCircleOutline className="text-lg mr-3" />
            <span className="font-medium text-sm">FAQ</span>
          </Link>

          <Link to="/event" className={`flex items-center px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === "/event" ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3" : ""}`}>
            <IoGiftOutline className="text-lg mr-3" />
            <span className="font-medium text-sm">이벤트상품</span>
          </Link>

          <div className="my-1 border-t border-gray-200"></div>

          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">카테고리</div>

          {categories.map((category) => (
            <div key={category.id} className="relative">
              <div
                className={`flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors cursor-pointer ${location.pathname === `/category/${category.id}` ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-3" : ""}`}
                onClick={(e) => handleCategoryClick(category.id, e)}
              >
                <span className="font-medium text-sm">{category.name}</span>
                {openSubMenu?.id === category.id && openSubMenu.subcategories.length > 0 ? (
                  <IoChevronDownOutline className="text-gray-400" />
                ) : (
                  <IoChevronForwardOutline className="text-gray-400" />
                )}
              </div>

              {openSubMenu?.id === category.id && openSubMenu.subcategories.length > 0 && (
                <div className="bg-gray-50 py-1">
                  {openSubMenu.subcategories.map((sub) => (
                    <Link
                      key={sub.id}
                      to={`/category/${sub.id}`}
                      className={`flex items-center pl-10 pr-4 py-2 text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors ${location.pathname === `/category/${sub.id}` ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600 pl-9" : ""}`}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="my-1 border-t border-gray-200"></div>
        </div>
      </div>
    </>
  )
}

export default MenuBar