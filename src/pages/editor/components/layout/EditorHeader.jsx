import { useState, useEffect } from "react"
import { IoDesktopOutline, IoPhonePortraitOutline, IoCheckmarkCircle } from "react-icons/io5"
import { updateSellerSettings, updateSellerMobileSettings } from "../../../../utils/usercustomui"

export default function EditorHeader({ elements, editedElement, sellerId, onUpdate, onSave }) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [saveType, setSaveType] = useState("")

  // Reset success message after 3 seconds
  useEffect(() => {
    let timer
    if (saveSuccess) {
      timer = setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    }
    return () => clearTimeout(timer)
  }, [saveSuccess])

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveType("desktop")

      if (!sellerId) {
        console.error("판매자 ID가 없습니다.")
        alert("로그인이 필요합니다.")
        setIsSaving(false)
        return
      }

      if (!elements.length) {
        console.error("저장할 데이터가 없습니다.")
        alert("저장할 데이터가 없습니다.")
        setIsSaving(false)
        return
      }

      // ✅ 통일된 형태로 데이터 저장
      const settingsToSave = elements.map((element) => ({
        type: element.type,
        id: element.id,
        layout: {
          column: element.layout.column || 1,
          columnSpan: element.layout.columnSpan || 1,
          top: element.layout.top || 0,
        },
        properties: element.properties,
      }))

      console.log("📤 최종 settings 데이터:", settingsToSave)

      const response = await updateSellerSettings(sellerId, settingsToSave)

      if (response && response.message) {
        console.log("✅ 저장 성공:", response)
        setSaveSuccess(true)
      } else {
        console.error("서버 응답 오류:", response)
        alert("설정 저장에 실패했습니다.")
      }
    } catch (error) {
      console.error("저장 중 오류:", error)
      alert("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  // 변경사항 저장 함수
  const handleMobileSaveChanges = async () => {
    try {
      setIsSaving(true)
      setSaveType("mobile")

      console.log("🔍 EditorHeader에서 받은 elements: by EditorHeader", elements)

      if (!sellerId) {
        console.error("❌ 판매자 ID를 찾을 수 없습니다.")
        alert("로그인이 필요합니다.")
        setIsSaving(false)
        return
      }

      if (!elements || elements.length === 0) {
        console.error("❌ 저장할 elements가 없습니다.")
        alert("저장할 데이터가 없습니다.")
        setIsSaving(false)
        return
      }

      const mobilesettingsToSave = elements.map((element) => {
        const baseProperties = {
          // 공통 필드
          id: element.id,
          title: element.properties.title,
          layout: element.layout,
          backgroundColor: element.properties.backgroundColor,
        }

        // 타입별 추가 필드 처리
        switch (element.type) {
          case "mobileheader":
            return {
              type: "mobileheader",
              layout: element.layout,
              properties: {
                ...baseProperties,
                logoUrl: element.properties.logoUrl,
                menuItems: element.properties.menuItems,
                categories: element.properties.categories,
                backgroundColor: element.properties.backgroundColor, // 배경색 추가
              },
            }
          case "mobilebanner":
            return {
              type: "mobilebanner",
              layout: element.layout,
              properties: {
                ...baseProperties,
                subtitle: element.properties.subtitle,
                imageUrl: element.properties.imageUrl,
                backgroundColor: element.properties.backgroundColor, // 배경색 추가
              },
            }
          case "mobilegrid":
            return {
              type: "mobilegrid",
              layout: element.layout,
              properties: {
                ...baseProperties,
                columns: element.properties.columns,
                sortList: element.properties.sortList,
                backgroundColor: element.properties.backgroundColor, // 배경색 추가
              },
            }
          case "mobileBottomNavigationBar":
            return {
              type: "mobileBottomNavigationBar",
              layout: element.layout,
              properties: {
                ...baseProperties,
                backgroundColor: element.properties.backgroundColor, // 배경색 유지
                items: element.properties.items, // 네비게이션 항목 추가
              },
            }
          default:
            return element
        }
      })

      console.log("📤 최종 요청 데이터 (settings) by EditorHeader:", {
        sellerId,
        settings: mobilesettingsToSave,
      })
      console.log("💾 저장 실행: 현재 elements 상태 by EditorHeader", mobilesettingsToSave)

      elements.forEach((el) => {
        if (el.type === "mobileheader") {
          console.log("✅ 헤더 이미지 URL (저장 전):", el.properties.logoUrl) // ✅ 확인용 로그

          mobilesettingsToSave.mobileheader = {
            title: el.properties.title || "",
            logoUrl: el.properties.logoUrl || "",
            menuItems: el.properties.menuItems || [],
            categories: el.properties.categories || [],
            backgroundColor: el.properties.backgroundColor || "#ffffff",
          }
        }

        if (el.type === "mobilebanner") {
          console.log("✅ 배너 이미지 URL (저장 전):", el.properties.imageUrl) // ✅ 확인용 로그

          mobilesettingsToSave.mobilebanner = {
            title: el.properties.title || "",
            subtitle: el.properties.subtitle || "",
            imageUrl: el.properties.imageUrl || "",
            backgroundColor: el.properties.backgroundColor || "#ffffff",
          }
        }

        if (el.type === "mobilegrid") {
          console.log("✅ 그리드 정보 (저장 전):", el.properties) // ✅ 확인용 로그

          mobilesettingsToSave.mobilegrid = {
            title: el.properties.title || "추천 상품", // 기본값 "추천 상품"
            columns: el.properties.columns || 3, // 기본값 3
            sortList: el.properties.sortList || [], // 기본값 빈 배열
          }
        }

        if (el.type === "mobileBottomNavigationBar") {
          console.log("✅ 바텀 네비게이션 정보 (저장 전):", el.properties) // ✅ 확인용 로그

          mobilesettingsToSave.mobilebottomNavigationBar = {
            items: el.properties.items || [
              { id: "nav-home", label: "홈", icon: "home" },
              { id: "nav-search", label: "검색", icon: "search" },
              { id: "nav-category", label: "카테고리", icon: "category" },
              { id: "nav-cart", label: "장바구니", icon: "shopping_cart" },
              { id: "nav-mypage", label: "마이페이지", icon: "person" },
            ], // 기본 네비게이션 항목 추가
            backgroundColor: el.properties.backgroundColor || "#ffffff", // 배경색 기본값 유지
          }
        }
      })

      console.log("📤 최종 요청 모바일 데이터 (settings) by EditorHeader:", {
        sellerId,
        mobilesettings: mobilesettingsToSave,
      })

      // ✅ API 호출
      const response = await updateSellerMobileSettings(sellerId, mobilesettingsToSave)

      if (response && response.message) {
        console.log("✅ 설정이 성공적으로 저장되었습니다:", response)
        console.log("✅ 설정이 성공적으로 저장되었습니다2:", mobilesettingsToSave)
        setSaveSuccess(true)
      } else {
        console.error("❌ 서버 응답 오류:", response)
        alert("설정 저장에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("❌ 설정 저장 실패:", error.message || error)
      alert("저장 중 오류가 발생했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full bg-blue-500 shadow-lg">
      <div className="w-full flex justify-between items-center h-18">
        <div className="pl-4">
          <h1 className="text-xl font-bold text-white flex items-center">
            <span className="bg-white text-blue-600 p-1 rounded-md mr-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </span>
            디자인 에디터
          </h1>
        </div>

        <div className="flex items-center pr-4">
          {saveSuccess && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm animate-pulse mr-3">
              <IoCheckmarkCircle className="mr-1" />
              {saveType === "desktop" ? "데스크톱" : "모바일"} 저장 완료!
            </div>
          )}

          <button
            onClick={handleSaveChanges}
            disabled={isSaving && saveType === "desktop"}
            className={`relative overflow-hidden group px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 mr-2 ${isSaving && saveType === "desktop"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
              }`}
          >
            {isSaving && saveType === "desktop" ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                저장 중...
              </div>
            ) : (
              <>
                <IoDesktopOutline className="text-blue-600 group-hover:scale-110 transition-transform" />
                <span>데스크톱 저장</span>
              </>
            )}
            <span className="absolute inset-0 bg-blue-100 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 -z-10"></span>
          </button>

          <button
            onClick={handleMobileSaveChanges}
            disabled={isSaving && saveType === "mobile"}
            className={`relative overflow-hidden group px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all duration-200 ${isSaving && saveType === "mobile"
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-white text-blue-600 hover:bg-blue-50 shadow-md hover:shadow-lg"
              }`}
          >
            {isSaving && saveType === "mobile" ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                저장 중...
              </div>
            ) : (
              <>
                <IoPhonePortraitOutline className="text-blue-600 group-hover:scale-110 transition-transform" />
                <span>모바일 저장</span>
              </>
            )}
            <span className="absolute inset-0 bg-blue-100 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-200 -z-10"></span>
          </button>
        </div>
      </div>
    </div>
  )
}
