import { useState, useEffect, useRef } from "react"
import Label from "../../../../components/Label"
import Input from "../../../../components/Input"
import { fetchSellerSettings } from "../../../../utils/usercustomui"
import { SingleImageUploader, SingleProductImageUploader } from "../../../../components/ImageUploader"

import { updateSellerSettings } from "../../../../utils/usercustomui" // ✅ API 호출 함수 추가
import { fetchSellerMobileSettings } from "../../../../utils/usercustomui"

export default function ElementEditor({
  element,
  onUpdate,
  sellerId,
  categories,
  elements,
  setElements,
  onSizeChange,
}) {
  const [headerLogoUrl, setHeaderLogoUrl] = useState(`http://localhost:5000/uploads/${sellerId}_headerlogo.png`)
  const [headerLogoFile, setHeaderLogoFile] = useState(null)
  const isFirstLoad = useRef(true)
  const [bannerUrl, setBannerUrl] = useState(`http://localhost:5000/uploads/${sellerId}_banner.png`)
  const [backgroundImage, setBackgroundImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const currentDevice = element.type.startsWith("mobile") ? "mobile" : "web"
  const currentSize = element.properties.size?.[currentDevice] || {}
  const [editedElement, setEditedElement] = useState(element)

  if (!sellerId) {
    console.error("❌ `sellerId`가 정의되지 않았습니다.")
    return <div className="p-4 bg-red-50 text-red-600 rounded-md">오류: 판매자 정보를 불러올 수 없습니다.</div>
  }

  console.log("✅ `sellerId`가 정의되었습니다.")
  console.log("element", element)

  // ✅ 헤더와 배너의 배경색 상태를 분리
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    element.type === "header" ? element.properties.backgroundColor || "#ffffff" : "#ffffff",
  )

  const [bannerBackgroundColor, setBannerBackgroundColor] = useState(
    element.type === "banner" ? element.properties.backgroundColor || "#ffffff" : "#ffffff",
  )

  const [MobileheaderBackgroundColor, setMobileHeaderBackgroundColor] = useState(
    element.type === "mobileheader" ? element.properties.backgroundColor || "#ffffff" : "#ffffff",
  )

  const [MobilebannerBackgroundColor, setMobileBannerBackgroundColor] = useState("#ffffff")

  // ✅ `useEffect`에서 헤더와 배너의 색상을 분리해서 로드
  console.log("📥 test elementaleditor:")

  useEffect(() => {
    let data
    if (!isFirstLoad.current) {
      console.log("📥 !isFirstLoad.current:", data)
      return
    }

    const loadSettings = async () => {
      try {
        data = await fetchSellerSettings(sellerId)
        console.log("📥 불러온 설정 데이터:", data)

        if (data) {
          if (data.header && element.type === "header") {
            setHeaderBackgroundColor(data.header.backgroundColor)
            console.log("ElementEditor-headerData=", data)
            setHeaderLogoUrl(data.header.logoUrl || `/uploads/${sellerId}_headerlogo.png`) // ✅ headerLogoUrl 설정
          }
          if (data.banner && element.type === "banner") {
            setBannerBackgroundColor(data.banner.backgroundColor)
            console.log("ElementEditor-bannerData=", data)
          }
        }

        isFirstLoad.current = false
      } catch (error) {
        console.error("❌ 설정 불러오기 실패:", error)
      }
    }

    loadSettings()
  }, [sellerId])

  useEffect(() => {
    let data
    if (!isFirstLoad.current) {
      console.log("📥 !isFirstLoad(mobile).current:", data)
      return
    }

    const loadMobileSettings = async () => {
      try {
        data = await fetchSellerMobileSettings(sellerId)
        console.log("📥 불러온 모바일 설정 데이터 by ElementEditor:", data)

        if (data) {
          if (data.header && element.type === "mobileheader") {
            setMobileHeaderBackgroundColor(data.header.backgroundColor)
            console.log("ElementEditor-headerData=", data)
            setHeaderLogoUrl(data.mobileheader.logoUrl || `/uploads/${sellerId}_mobileheaderlogo.png`) // ✅ headerLogoUrl 설정
          }
          if (data.banner && element.type === "mobilebanner") {
            setMobileBannerBackgroundColor(data.banner.backgroundColor)
            console.log("ElementEditor-mobilebannerData=", data)
          }
        }

        isFirstLoad.current = false
      } catch (error) {
        console.error("❌ 설정 불러오기 실패:", error)
      }
    }

    loadMobileSettings()
  }, [sellerId])

  // ✅ 헤더 배경색 변경 핸들러
  const handleHeaderColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return

    setHeaderBackgroundColor(value)

    if (element.type === "header") {
      console.log("Header change")
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      }

      onUpdate(updatedElement)
    }
  }

  // ✅ 헤더 배경색 변경 핸들러
  const handleMobileHeaderColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return

    setMobileHeaderBackgroundColor(value)

    if (element.type === "mobileheader") {
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      }

      onUpdate(updatedElement)
    }
  }

  // ✅ 배너 배경색 변경 핸들러
  const handleBannerColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return

    setBannerBackgroundColor(value)

    if (element.type === "banner") {
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      }

      onUpdate(updatedElement)
    }
  }

  // ✅ 배너 배경색 변경 핸들러
  const handleMobileBannerColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return

    setMobileBannerBackgroundColor(value)

    if (element.type === "mobilebanner") {
      console.log("bannerchange")
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      }

      onUpdate(updatedElement)
    }
  }

  const handleSizeChange = (key, value) => {
    const newSize = {
      ...(element.properties.size || {}),
      [currentDevice]: {
        ...(element.properties.size?.[currentDevice] || {}),
        [key]: value,
      },
    }

    onSizeChange({
      ...element,
      properties: {
        ...element.properties,
        size: newSize,
      },
    })
  }

  const handleBannerUpload = async (uploadedUrl) => {
    console.log("🚀 배너 이미지 업로드 완료:", uploadedUrl)

    setBannerUrl(uploadedUrl)

    const updatedElements = elements.map((el) =>
      el.type === "banner" ? { ...el, properties: { ...el.properties, imageUrl: uploadedUrl } } : el,
    )
    setElements(updatedElements)

    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        imageUrl: uploadedUrl,
      },
    })

    // ✅ 배너 이미지 URL 저장
    handleSave(null, uploadedUrl)
  }

  const handleMobileBannerUpload = async (uploadedUrl) => {
    console.log("🚀 배너 이미지 업로드 완료:", uploadedUrl)

    setBannerUrl(uploadedUrl)

    const updatedElements = elements.map((el) =>
      el.type === "banner" ? { ...el, properties: { ...el.properties, imageUrl: uploadedUrl } } : el,
    )
    setElements(updatedElements)

    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        imageUrl: uploadedUrl,
      },
    })

    // ✅ 배너 이미지 URL 저장
    handleSave(null, uploadedUrl)
  }

  // 이미지 URL을 절대 경로로 설정하는 함수
  const handleLogoUpload = (uploadedUrl) => {
    console.log("🚀 로고 이미지 업로드 완료:", uploadedUrl)

    setHeaderLogoUrl(uploadedUrl) // 상태 업데이트

    const updatedElements = elements.map((el) =>
      el.type === "header" ? { ...el, properties: { ...el.properties, logoUrl: uploadedUrl } } : el,
    )
    setElements(updatedElements)

    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        logoUrl: uploadedUrl, // 절대 경로로 업데이트
      },
    })

    handleSave(uploadedUrl) // 저장 함수 호출
  }

  const handleSaveInOrder = async () => {
    console.log("💾 저장 실행: 현재 elements 상태", elements)

    // UI에서 보이는 순서대로 요소들을 저장하려면 먼저 정렬해야 함
    const sortedElements = [...elements]

    // UI에서 보이는 순서대로 정렬 (순서 변경된 배열을 반영)
    sortedElements.sort((a, b) => a.index - b.index) // `index`가 없다면, 요소가 가진 순서대로 정의

    const updatedSettings = {}

    // 순서대로 elements 배열을 처리
    for (const el of sortedElements) {
      if (el.type === "header") {
        // 여러 개의 헤더 처리
        updatedSettings.header = {
          ...el.properties,
          logoUrl: el.properties.logoUrl || `http://localhost:5000/uploads/${sellerId}_headerlogo.png`,
          backgroundColor: el.properties.backgroundColor || "#ffffff",
        }
      } else if (el.type === "banner") {
        // 여러 개의 배너 처리
        updatedSettings.banner = {
          ...el.properties,
          imageUrl: el.properties.imageUrl || `http://localhost:5000/uploads/${sellerId}_banner.png`,
          backgroundColor: el.properties.backgroundColor || "#ffffff",
        }
      } else {
        // 다른 요소들 처리
        updatedSettings[el.type] = {
          ...el.properties,
        }
      }
    }

    try {
      await updateSellerSettings(sellerId, updatedSettings)
      alert("🎉 설정이 성공적으로 저장되었습니다!")

      // 저장 후 최신 데이터 다시 불러오기
      const newSettings = await fetchSellerSettings(sellerId)
      if (newSettings) {
        // 각 요소의 최신 데이터 업데이트
        if (newSettings.header) {
          setHeaderBackgroundColor(newSettings.header.backgroundColor)
          setHeaderLogoUrl(newSettings.header.logoUrl)
        }
        if (newSettings.banner) {
          setBannerBackgroundColor(newSettings.banner.backgroundColor)
          setBannerUrl(newSettings.banner.imageUrl)
        }
        // 다른 요소들에 대해서도 처리할 수 있음
      }
    } catch (error) {
      alert("❌ 설정 저장 실패! 다시 시도해주세요.")
      console.error("❌ 설정 저장 오류:", error)
    }
  }

  // ✅ 저장 핸들러 (헤더 & 배너 분리 저장)
  const handleSave = async (uploadedLogoUrl = null, uploadedBannerUrl = null) => {
    console.log("💾 저장 실행: 현재 elements 상태", elements)

    // ✅ elements가 배열인지 확인 후 변환
    const elementsArray = Array.isArray(elements) ? elements : Object.values(elements)
    console.log("🔍 elements 데이터 유형:", typeof elements)
    console.log("🔍 elements는 배열인가?", Array.isArray(elements))

    // ✅ header와 banner 데이터 찾기
    const headerElement = elementsArray.find((el) => el.type === "header")
    const bannerElement = elementsArray.find((el) => el.type === "banner")
    const gridElement = elementsArray.find((el) => el.type === "grid")

    console.log("🔍 찾은 headerElement:", headerElement)
    console.log("🔍 찾은 bannerElement:", bannerElement)
    console.log("🔍 찾은 gridElement:", gridElement)

    // ✅ 데이터가 없으면 빈 객체가 아니라 `null` 할당
    const updatedSettings = {}

    if (headerElement) {
      updatedSettings.header = {
        ...headerElement.properties,
        logoUrl: `http://localhost:5000/uploads/${sellerId}_headerlogo.png`, // ✅ 로고 URL 설정
      }
    } else {
      updatedSettings.header = null
    }

    if (bannerElement) {
      updatedSettings.banner = {
        ...bannerElement.properties,
        logoUrl: `http://localhost:5000/uploads/${sellerId}_banner.png`, // ✅ 배너 이미지 저장
      }
    } else {
      updatedSettings.banner = null
    }

    if (gridElement) {
      updatedSettings.grid = {
        ...gridElement.properties,
        columns: gridElement.properties.columns || 3, // 기본값은 3으로 설정
        sortList: gridElement.properties.sortList || [], // sortList 기본값은 빈 배열
        title: gridElement.properties.title || "추천 상품", // 기본값은 "추천 상품"
      }
    } else {
      updatedSettings.grid = null
    }

    console.log("📤 최종 요청 데이터 by ElementEditor.jsx (settings):", JSON.stringify(updatedSettings, null, 2))

    if (!updatedSettings) {
      console.error("❌ 저장할 설정 데이터가 없습니다.")
      return
    }

    try {
      const elements = []
      await updateSellerSettings(sellerId, updatedSettings) // ✅ elements 전달
      alert("🎉 설정이 성공적으로 저장되었습니다!")

      // ✅ 저장 후 최신 데이터를 다시 불러와 UI 업데이트
      const newSettings = await fetchSellerSettings(sellerId)
      if (newSettings) {
        if (newSettings.header) {
          setHeaderBackgroundColor(newSettings.header.backgroundColor)
          setHeaderLogoUrl(newSettings.header.logoUrl) // ✅ 저장 후 UI 업데이트
        }
        if (newSettings.banner) {
          setBannerBackgroundColor(newSettings.banner.backgroundColor)
          setBannerUrl(newSettings.banner.imageUrl) // ✅ 배너 이미지 업데이트
        }
        if (newSettings.grid) {
        }
      }
    } catch (error) {
      alert("❌ 설정 저장 실패! 다시 시도해주세요.")
      console.error("❌ 설정 저장 오류:", error)
    }
  }

  const handleMenuItemChange = (index, field, value) => {
    const updatedMenuItems = [...element.properties.menuItems]
    updatedMenuItems[index][field] = value
    onUpdate({ ...element, properties: { ...element.properties, menuItems: updatedMenuItems } })
  }

  const handleAddMenuItem = () => {
    const newMenuItem = { title: "", url: "", highlight: false }
    const updatedMenuItems = [...element.properties.menuItems, newMenuItem]
    onUpdate({ ...element, properties: { ...element.properties, menuItems: updatedMenuItems } })
  }

  const handleRemoveMenuItem = (index) => {
    const updatedMenuItems = element.properties.menuItems.filter((_, i) => i !== index)
    onUpdate({ ...element, properties: { ...element.properties, menuItems: updatedMenuItems } })
  }

  const handleChangeFont = (value) => {
    const updatedElement = {
      ...element,
      properties: {
        ...element.properties,
        fontFamily: value,
      },
    }

    onUpdate(updatedElement)
  }

  const handleChangeImage = (previewImgUrl) => {
    setEditedElement((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        logoUrl: previewImgUrl, // ✅ 헤더 로고 저장
      },
    }))

    onUpdate({
      ...editedElement,
      properties: {
        ...editedElement.properties,
        logoUrl: previewImgUrl, // ✅ UI에서도 즉시 반영
      },
    })
  }

  const handleNavLabelChange = (index, value) => {
    const updatedItems = [...element.properties.items]
    updatedItems[index].label = value
    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        items: updatedItems,
      },
    })
  }

  const handleBottomNavColorChange = (value) => {
    onUpdate({
      ...element,
      properties: {
        ...element.properties,
        backgroundColor: value,
      },
    })
  }

  // ✅ 편집기 렌더링
  const renderEditor = () => {
    switch (element.type) {
      case "header":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label={"로고 설정"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SingleProductImageUploader
                  elementType="header" // ✅ 헤더용 업로드
                  sellerId={sellerId}
                  elementId={element.id} // ✅ 이거 추가해주세요!
                  onUpdateImage={(imgUrl) => console.log("미리보기:", imgUrl)}
                  onUpload={handleLogoUpload}
                />
                {headerLogoUrl && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">현재 로고:</p>
                    <img src={headerLogoUrl || "/placeholder.svg"} alt="로고 미리보기" className="max-h-12 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="메뉴 항목 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {element.properties.menuItems.map((item, idx) => (
                  <div key={idx} className="border p-3 rounded-md space-y-2 bg-white mb-3 shadow-sm">
                    <div className="space-y-2">
                      <label className="block text-xs text-gray-500">메뉴 제목</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => handleMenuItemChange(idx, "title", e.target.value)}
                        placeholder="메뉴 제목 (예: NEW)"
                        className="w-full border rounded px-3 py-2 text-sm"
                      />

                      <label className="block text-xs text-gray-500 mt-2">링크 주소</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleMenuItemChange(idx, "url", e.target.value)}
                        placeholder="링크 주소 (예: /new)"
                        className="w-full border rounded px-3 py-2 text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.highlight}
                          onChange={(e) => handleMenuItemChange(idx, "highlight", e.target.checked)}
                          className="rounded text-blue-500"
                        />
                        <span className="text-sm text-gray-700">강조 표시</span>
                      </label>
                      <button
                        onClick={() => handleRemoveMenuItem(idx)}
                        className="ml-auto text-red-500 text-sm px-2 py-1 rounded hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddMenuItem}
                  className="w-full mt-2 py-2 text-sm bg-white border border-gray-300 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  + 메뉴 항목 추가
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label htmlFor={"headerBackgroundColor"} label={"헤더 배경 색상"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2">
              <input
                    id="headerBackgroundColor"
                    type="color"
                    className="w-[35px] h-[35px] rounded border"
                    value={headerBackgroundColor}
                    onChange={(e) => handleHeaderColorChange(e.target.value)}
                  />
                  <input
                    type="text"
                    value={headerBackgroundColor}
                    onChange={(e) => handleHeaderColorChange(e.target.value)}
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: headerBackgroundColor }}></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="글꼴 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">글꼴 크기</label>
                  <input
                    type="text"
                    value={element.properties.fontSize || ""}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          fontSize: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 16px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">글꼴 굵기</label>
                  <select
                    value={element.properties.fontWeight || ""}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          fontWeight: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="400">보통 (Normal)</option>
                    <option value="500">중간 (Medium)</option>
                    <option value="600">약간 굵게 (Semi-bold)</option>
                    <option value="700">굵게 (Bold)</option>
                    <option value="800">매우 굵게 (Extra-bold)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">글꼴 종류</label>
                  <select
                    value={element.properties.fontFamily}
                    onChange={(e) => handleChangeFont(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="Nanum Gothic">나눔고딕</option>
                    <option value="Arial">Arial</option>
                    <option value="Noto Sans KR">Noto Sans KR</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )

      case "banner":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label={"배너 이미지 설정"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SingleImageUploader
                  sellerId={sellerId}
                  elementType="banner" // ✅ 배너 업로드일 경우
                  onUpload={handleBannerUpload} // ✅ 배너 이미지 업로드
                />
                {bannerUrl && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">현재 배너:</p>
                    <img
                      src={bannerUrl || "/placeholder.svg"}
                      alt="배너 이미지 미리보기"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label htmlFor={"bannerBackgroundColor"} label={"배너 배경 색상"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3 items-center">
                  <input
                    id="bannerBackgroundColor"
                    type="color"
                    className="w-[35px] h-[35px] rounded border"
                    value={bannerBackgroundColor}
                    onChange={(e) => handleBannerColorChange(e.target.value)}
                  />
                  <input
                    type="text"
                    value={bannerBackgroundColor}
                    onChange={(e) => handleBannerColorChange(e.target.value)}
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: bannerBackgroundColor }}></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="배너 텍스트 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">타이틀</label>
                  <input
                    type="text"
                    value={element.properties.title || ""}
                    onChange={(e) =>
                      onUpdate({ ...element, properties: { ...element.properties, title: e.target.value } })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="배너 제목을 입력하세요"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">서브타이틀</label>
                  <input
                    type="text"
                    value={element.properties.subtitle || ""}
                    onChange={(e) =>
                      onUpdate({ ...element, properties: { ...element.properties, subtitle: e.target.value } })
                    }
                    className="w-full border rounded px-3 py-2"
                    placeholder="배너 부제목을 입력하세요"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "text":
      case "mobiletext":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label="내용" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <textarea
                  value={element.properties.content || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...element,
                      properties: { ...element.properties, content: e.target.value },
                    })
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={4}
                  placeholder="텍스트 내용을 입력하세요"
                />
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="글꼴 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 gap-4 mb-3">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">글꼴 종류</label>
                    <select
                      value={element.properties.fontFamily}
                      onChange={(e) => handleChangeFont(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    >
                      <option value="Spoqa Han Sans Neo">Spoqa Han Sans Neo</option>
                      <option value="SUIT">SUIT</option>
                      <option value="Gmarket Sans">Gmarket Sans</option>
                      <option value="Apple SD Gothic Neo">Apple SD Gothic Neo</option>
                      <option value="IBM Plex Sans KR">IBM Plex Sans KR</option>
                      <option value="Nanum Gothic">나눔고딕</option>
                      <option value="Noto Sans KR">Noto Sans KR</option>
                      <option value="Arial">Arial</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Pretendard">Pretendard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">폰트 크기</label>
                    <input
                      type="text"
                      value={element.properties.fontSize || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, fontSize: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      placeholder="예: 16px"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">폰트 굵기</label>
                    <select
                      value={element.properties.fontWeight || ""}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, fontWeight: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    >
                      <option value="">선택하세요</option>
                      <option value="normal">보통 (normal)</option>
                      <option value="bold">굵게 (bold)</option>
                      <option value="lighter">얇게 (lighter)</option>
                      <option value="100">100</option>
                      <option value="200">200</option>
                      <option value="300">300</option>
                      <option value="400">400</option>
                      <option value="500">500</option>
                      <option value="600">600</option>
                      <option value="700">700</option>
                      <option value="800">800</option>
                      <option value="900">900</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">글자 색상</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={element.properties.color || "#000000"}
                        onChange={(e) =>
                          onUpdate({
                            ...element,
                            properties: { ...element.properties, color: e.target.value },
                          })
                        }
                        className="w-[35px] h-[35px] rounded border"
                      />
                      <input
                        type="text"
                        value={element.properties.color || "#000000"}
                        onChange={(e) =>
                          onUpdate({
                            ...element,
                            properties: { ...element.properties, color: e.target.value },
                          })
                        }
                        className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                      />
                    </div>

                    <div className="mt-2 p-2 bg-white rounded border border-gray-200 flex items-center">
                      <div
                        className="w-6 h-6 rounded mr-2"
                        style={{ backgroundColor: element.properties.color || "#000000" }}
                      ></div>
                      <span className="text-sm">선택된 색상</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="텍스트 스타일" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">정렬</label>
                  <select
                    value={element.properties.textAlign || "left"}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: { ...element.properties, textAlign: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="left">왼쪽 정렬</option>
                    <option value="center">가운데 정렬</option>
                    <option value="right">오른쪽 정렬</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">등장 애니메이션</label>
                  <select
                    value={element.properties.animate ? "true" : "false"}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          animate: e.target.value === "true",
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="true">사용</option>
                    <option value="false">사용 안 함</option>
                  </select>
                </div>
              </div>
            </div>
          </>
        )

      case "image":
      case "mobileimage":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label="이미지/동영상 업로드" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SingleProductImageUploader
                  elementType={element.type}
                  elementId={element.id}
                  sellerId={sellerId}
                  onUpload={(url) =>
                    onUpdate({
                      ...element,
                      properties: {
                        ...element.properties,
                        imageUrl: url,
                      },
                    })
                  }
                />
                {element.properties.imageUrl && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">현재 이미지:</p>
                    <img
                      src={element.properties.imageUrl || "/placeholder.svg"}
                      alt={element.properties.alt || "이미지"}
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="이미지 스타일" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="mb-3">
                  <label className="block text-xs text-gray-500 mb-1">모서리 둥글기</label>
                  <select
                    value={element.properties.borderRadius || "0px"}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          borderRadius: e.target.value,
                        },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                  >
                    <option value="0px">각지게 (0px)</option>
                    <option value="8px">조금 둥글게 (8px)</option>
                    <option value="16px">중간 정도 둥글게 (16px)</option>
                    <option value="32px">많이 둥글게 (32px)</option>
                    <option value="9999px">완전 원형 (9999px)</option>
                    <option value="50%">정사각형이면 원형 (50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">대체 텍스트 (alt)</label>
                  <input
                    type="text"
                    value={element.properties.alt || ""}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: { ...element.properties, alt: e.target.value },
                      })
                    }
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="이미지에 대한 설명을 입력하세요"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "colorbox":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label="배경 색상" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={element.properties.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          backgroundColor: e.target.value,
                        },
                      })
                    }
                    className="w-[35px] h-[35px] rounded border"
                  />
                  <input
                    type="text"
                    value={element.properties.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      onUpdate({
                        ...element,
                        properties: {
                          ...element.properties,
                          backgroundColor: e.target.value,
                        },
                      })
                    }
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div
                    className="w-6 h-6 rounded mr-2"
                    style={{ backgroundColor: element.properties.backgroundColor || "#ffffff" }}
                  ></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <Input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <Input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "mobileheader":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label={"로고 설정"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SingleImageUploader
                  elementType="mobileheader" // ✅ 헤더 업로드일 경우
                  sellerId={sellerId}
                  onUpdateImage={(imgUrl) => console.log("미리보기:", imgUrl)}
                  onUpload={handleLogoUpload} // ✅ 로고 업로드
                />
                {headerLogoUrl && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">현재 로고:</p>
                    <img src={headerLogoUrl || "/placeholder.svg"} alt="로고 미리보기" className="max-h-12 mx-auto" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label
                htmlFor={"mobileheaderBackgroundColor"}
                label={"모바일 헤더 배경 색상"}
                className="font-medium text-gray-700"
              />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3 items-center">
                  <input
                    id="mobileheaderBackgroundColor"
                    type="color"
                    className="w-[35px] h-[35px] rounded border"
                    value={MobileheaderBackgroundColor}
                    onChange={(e) => handleMobileHeaderColorChange(e.target.value)}
                  />
                  <input
                    type="text"
                    value={MobileheaderBackgroundColor}
                    onChange={(e) => handleMobileHeaderColorChange(e.target.value)}
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: MobileheaderBackgroundColor }}></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "mobilebanner":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label={"배너 이미지 설정"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <SingleImageUploader
                  sellerId={sellerId}
                  elementType="mobilebanner" // ✅ 배너 업로드일 경우
                  onUpload={handleBannerUpload} // ✅ 배너 이미지 업로드
                />
                {bannerUrl && (
                  <div className="mt-3 p-2 bg-white rounded border border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">현재 배너:</p>
                    <img
                      src={bannerUrl || "/placeholder.svg"}
                      alt="배너 이미지 미리보기"
                      className="w-full h-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label
                htmlFor={"MobilebannerBackgroundColor"}
                label={"모바일 배너 배경 색상"}
                className="font-medium text-gray-700"
              />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3 items-center">
                  <Input
                    id="MobilebannerBackgroundColor"
                    type="color"
                    className="w-[35px] h-[35px] rounded border"
                    value={MobilebannerBackgroundColor}
                    onChange={(e) => handleMobileBannerColorChange(e.target.value)}
                  />
                  <Input
                    type="text"
                    value={MobilebannerBackgroundColor}
                    onChange={(e) => handleMobileBannerColorChange(e.target.value)}
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div className="w-6 h-6 rounded mr-2" style={{ backgroundColor: MobilebannerBackgroundColor }}></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>
          </>
        )

      case "mobileBottomNavigationBar":
        return (
          <>
            <div className="space-y-3 mb-5">
              <Label label={"네비게이션 항목 설정"} className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="grid grid-cols-5 gap-4 p-3 border rounded-lg bg-white">
                  {element.properties.items.map((item, index) => (
                    <div key={item.id} className="flex flex-col items-center">
                      <i className={`material-icons text-2xl`}>{item.icon}</i>
                      <Input
                        type="text"
                        value={item.label}
                        onChange={(e) => handleNavLabelChange(index, e.target.value)}
                        className="text-center w-full mt-1 text-sm px-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label
                htmlFor="BottomNavBackgroundColor"
                label={"바텀 네비게이션 배경 색상"}
                className="font-medium text-gray-700"
              />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex gap-3 items-center">
                  <Input
                    id="BottomNavBackgroundColor"
                    type="color"
                    className="w-[35px] h-[35px] rounded border"
                    value={element.properties.backgroundColor}
                    onChange={(e) => handleBottomNavColorChange(e.target.value)}
                  />
                  <Input
                    type="text"
                    value={element.properties.backgroundColor}
                    onChange={(e) => handleBottomNavColorChange(e.target.value)}
                    className="w-[140px] border rounded px-2 py-1 text-sm font-mono"
                  />
                </div>
                <div className="mt-3 p-2 bg-white rounded border border-gray-200 flex items-center">
                  <div
                    className="w-6 h-6 rounded mr-2"
                    style={{ backgroundColor: element.properties.backgroundColor }}
                  ></div>
                  <span className="text-sm">선택된 색상</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-5">
              <Label label="크기 설정" className="font-medium text-gray-700" />
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">넓이 (width)</label>
                  <input
                    type="text"
                    value={currentSize.width || ""}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: 100%, 300px"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">높이 (height)</label>
                  <input
                    type="text"
                    value={currentSize.height || ""}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="예: auto, 200px"
                  />
                </div>
              </div>
            </div>
          </>
        )

      default:
        return (
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center text-gray-500">
            이 요소 유형에 대한 편집기는 준비중입니다.
          </div>
        )
    }
  }

  return (
    <>
      <div className="space-y-4 p-2 bg-white rounded-lg shadow-sm w-full max-w-10xl">
        <div className="border-b pb-3 mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {element.type.startsWith("mobile") ? "모바일 " : ""}
            {element.type.replace("mobile", "").charAt(0).toUpperCase() + element.type.replace("mobile", "").slice(1)}{" "}
            편집
          </h3>
        </div>

        {renderEditor()}

        <button
          onClick={handleSave}
          className="w-full p-3 bg-[#4294F2] text-white rounded-md font-medium hover:bg-[#3a85db] transition-colors shadow-sm"
        >
          변경사항 저장
        </button>
      </div>
    </>
  )
}
