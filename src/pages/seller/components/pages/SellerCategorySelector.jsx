import { useState } from "react"
import { X, Check, ChevronRight } from "lucide-react"

export default function SellerCategorySelector({ onCancel, onSave, categories, isOpen }) {
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState({
    id: 0,
    name: "식품",
    index: 0,
    subCategory: {
      name: "도시락/즉석식",
    },
  })

  const [selectedCategory, setSelectedCategory] = useState(null)

  function handleSelect(subCategory) {
    setSelectedCategory(subCategory)
  }

  function handleRemove() {
    setSelectedCategory(null)
  }

  return (
    <div
      className={`${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } fixed left-0 top-0 bottom-0 right-0 bg-black/50 z-50 transition-all duration-200 backdrop-blur-sm overflow-y-scroll`}
    >
      <div className="bg-white rounded-xl absolute overflow-hidden left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[768px] max-h-[580px] w-full h-full shadow-xl">
        {/* 헤더 */}
        <div className="bg-gray-700 text-white p-3 px-4 font-bold flex items-center justify-between">
          <h3 className="text-lg">판매할 카테고리 선택</h3>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-full hover:bg-black/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 선택 경로 */}
        <div className="bg-gray-50 border-b border-gray-200 p-3 px-4">
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium">선택 경로:</span>
            <div className="flex items-center ml-2">
              <span className="text-gray-800">{selectedCategoryInfo.name}</span>
              <ChevronRight className="w-4 h-4 mx-1 text-gray-400" />
              <span className="text-gray-800">{selectedCategoryInfo.subCategory?.name}</span>
            </div>
          </div>

          {/* 선택된 카테고리 표시 */}
          <div className="mt-2">
            {selectedCategory ? (
              <div className="flex flex-wrap gap-1">
                <span className="bg-gray-200 text-xs px-3 py-1.5 rounded-lg flex items-center">
                  <span className="font-medium">{selectedCategory.name}</span>
                  <button
                    className="ml-1.5 text-gray-500 hover:text-gray-700 p-0.5 rounded-full hover:bg-gray-300 transition-colors"
                    onClick={handleRemove}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">선택된 카테고리가 없습니다.</div>
            )}
          </div>
        </div>

        {/* 카테고리 선택 영역 */}
        <div className="flex min-h-[312px] h-auto">
          {/* 대분류 카테고리 목록 */}
          <div className="w-1/3 max-w-[180px] border-r border-gray-200 bg-gray-50">
            <div className="p-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
              대분류
            </div>
            <ul className="py-1 overflow-y-auto max-h-[350px]">
              {categories?.map((category, index) => (
                <li
                  onClick={() =>
                    setSelectedCategoryInfo({
                      id: category.id,
                      name: category.name,
                      index: index,
                    })
                  }
                  className={`${
                    selectedCategoryInfo.name === category.name
                      ? "bg-gray-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  } px-4 py-2 cursor-pointer transition-colors flex items-center justify-between`}
                  key={category.id}
                >
                  <span>{category.name}</span>
                  {selectedCategoryInfo.name === category.name && <ChevronRight className="w-4 h-4" />}
                </li>
              ))}
            </ul>
          </div>

          {/* 중분류 카테고리 목록 */}
          <div className="flex-1 bg-white">
            <div className="p-2 bg-gray-100 border-b border-gray-200 text-xs font-medium text-gray-500 uppercase">
              중분류
            </div>
            <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto max-h-[350px]">
              {categories[selectedCategoryInfo?.index || 0]?.subCategories?.map((subCategory) => {
                const isSelected = selectedCategory?.id === subCategory.id
                return (
                  <div
                    onClick={() => {
                      setSelectedCategoryInfo((prev) => ({
                        ...prev,
                        subCategory: {
                          name: subCategory.name,
                          id: subCategory.id,
                        },
                      }))
                      handleSelect(subCategory)
                    }}
                    className={`${
                      isSelected
                        ? "border-gray-600 bg-gray-50 ring-1 ring-gray-600"
                        : "border-gray-200 hover:border-gray-400"
                    } rounded-lg border p-3 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all`}
                    key={subCategory.id}
                  >
                    <span className="text-sm text-center text-gray-700">{subCategory.name}</span>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* 모달 푸터 */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              onClick={onCancel}
            >
              취소
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-1.5"
              onClick={() => onSave(selectedCategory)}
            >
              <Check className="w-4 h-4" />
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
