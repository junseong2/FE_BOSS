import { useState } from "react"
import {
  IoGridOutline,
  IoImageOutline,
  IoBagHandleOutline,
  IoPhonePortraitOutline,
  IoSquareOutline,
  IoTextOutline,
  IoSettingsOutline,
  IoLayersOutline,
  IoColorPaletteOutline,
} from "react-icons/io5"
import { motion, AnimatePresence } from "framer-motion"

import EditorTemplateGrid from "../EditorTemplateGrid"
import { MultipleImageUploader } from "../../../../components/ImageUploader"
import EditorSettingModal from "../EditorSettingModal"

export default function EditorTabContent({ targetTabName, onSelectElement, elements }) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false)
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false)

  return (
    <div className="w-full px-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={targetTabName}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {targetTabName === "설정" ? (
            <div className="py-4">
              <div className="bg-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                <h3 className="text-blue-700 font-medium flex items-center mb-2">
                  <IoSettingsOutline className="mr-2" />
                  설정 도구
                </h3>
                <p className="text-sm text-blue-600">쇼핑몰의 다양한 설정 요소를 추가하고 관리할 수 있습니다.</p>
              </div>

              <button
                onClick={() => setIsSettingModalOpen(true)}
                className="w-full text-center text-blue-600 border border-blue-500 rounded-md py-3 hover:bg-blue-50 transition-colors duration-200 flex items-center justify-center shadow-sm"
              >
                <IoLayersOutline className="mr-2" size={18} />
                설정 요소 열기
              </button>

              <EditorSettingModal isOpen={isSettingModalOpen} onClose={() => setIsSettingModalOpen(false)}>
                <EditorElementGrid
                  onSelectElement={(element) => {
                    onSelectElement(element)
                    setIsSettingModalOpen(false)
                  }}
                  elements={elements}
                />
              </EditorSettingModal>
            </div>
          ) : targetTabName === "탬플릿" ? (
            <div className="py-4">
              <div className="bg-indigo-50 rounded-lg p-4 mb-4 border border-indigo-100">
                <h3 className="text-indigo-700 font-medium flex items-center mb-2">
                  <IoColorPaletteOutline className="mr-2" />
                  템플릿 갤러리
                </h3>
                <p className="text-sm text-indigo-600">미리 디자인된 템플릿을 선택하여 쇼핑몰을 빠르게 구성하세요.</p>
              </div>

              <EditorTemplateGrid
                isOpen={isTemplateModalOpen}
                onClose={() => setIsTemplateModalOpen(false)}
                onSelectTemplate={(template) => {
                  onSelectElement(template)
                  setIsTemplateModalOpen(false)
                }}
              />
            </div>
          ) : (
            <div className="py-4">
              <div className="bg-green-50 rounded-lg p-4 mb-4 border border-green-100">
                <h3 className="text-green-700 font-medium flex items-center mb-2">
                  <IoImageOutline className="mr-2" />
                  이미지 업로더
                </h3>
                <p className="text-sm text-green-600">쇼핑몰에 사용할 이미지를 업로드하고 관리할 수 있습니다.</p>
              </div>

              <MultipleImageUploader />
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function EditorElementGrid({ onSelectElement, elements }) {
  const items = [
    { icon: <IoGridOutline size={24} />, label: "헤더", type: "header", color: "blue" },
    { icon: <IoGridOutline size={24} />, label: "헤더2", type: "header2", color: "blue" },
    { icon: <IoImageOutline size={24} />, label: "배너", type: "banner", color: "purple" },
    { icon: <IoBagHandleOutline size={24} />, label: "상품 그리드", type: "grid", color: "green" },
    { icon: <IoBagHandleOutline size={24} />, label: "상품 그리드2", type: "grid2", color: "green" },
    {
      icon: <IoPhonePortraitOutline size={24} />,
      label: "바텀네비게이션바",
      type: "bottomNavigationbar",
      color: "indigo",
    },
    { icon: <IoSquareOutline size={24} />, label: "여백", type: "blank", color: "gray" },
    { icon: <IoTextOutline size={24} />, label: "텍스트", type: "text", color: "yellow" },
    { icon: <IoImageOutline size={24} />, label: "이미지", type: "image", color: "purple" },
    { icon: <IoSquareOutline size={24} />, label: "컬러 박스", type: "colorbox", color: "pink" },
  ]

  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300",
      purple: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 hover:border-purple-300",
      green: "bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:border-green-300",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300",
      gray: "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300",
      yellow: "bg-yellow-50 text-yellow-600 border-yellow-200 hover:bg-yellow-100 hover:border-yellow-300",
      pink: "bg-pink-50 text-pink-600 border-pink-200 hover:bg-pink-100 hover:border-pink-300",
    }
    return colorMap[color] || colorMap.blue
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      <div className="text-center w-full py-4 px-2 bg-blue-50 rounded-lg mb-2">
        <h3 className="font-medium text-blue-700 mb-1">요소 갤러리</h3>
        <p className="text-sm text-blue-600">요소를 클릭하여 쇼핑몰을 꾸며보세요!</p>
      </div>

      {items.map(({ icon, label, type, color }, index) => (
        <motion.div
          key={index}
          className="relative group"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <button
            onClick={() => {
              const selectedElement = elements[type]?.type === type ? elements[type] : null
              onSelectElement(selectedElement)
            }}
            className={`border rounded-lg flex flex-col justify-center items-center gap-2 w-[115px] h-[100px] transition duration-300 shadow-sm ${getColorClass(color)}`}
          >
            <div className="text-2xl">{icon}</div>
            <span className="text-[0.95rem] font-medium">{label}</span>
          </button>
        </motion.div>
      ))}
    </div>
  )
}
