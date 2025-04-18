import { useState } from 'react';

export default function EditorCategorySelector({ onCancel, onSave, categories }) {
  const [selectedCategoryInfo, setSelectedCategoryInfo] = useState({
    id: 0,
    name: '식품',
    index: 0,
    subCategory: {
      name: '도시락/즉석식',
    },
  });

  const [selectedCategories, setSelectedCategories] = useState([]);

  // 카테고리 선택
  function handleSelect(subCategory) {
    const exists = selectedCategories.some((cat) => cat.id === subCategory.id);
    if (!exists) {
      setSelectedCategories((prev) => [...prev, subCategory]);
    }
  }

  // 선택한 카테고리 제거
  function handleRemove(selectedId) {
    setSelectedCategories((prev) => prev.filter((cat) => cat.id !== selectedId));
  }

  return (
    <div className='fixed left-0 top-0 bottom-0 right-0 bg-[rgba(0,0,0,0.3)] z-10'>
      <div className='bg-white rounded-xl absolute overflow-hidden left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[768px] max-h-[540px] w-full h-full'>
        <div className='bg-[#4294F2] text-white p-1 px-2 font-bold'>판매할 카테고리 선택</div>
        <div className='text-sm p-1 px-2'>
          선택 경로: {selectedCategoryInfo.name} {'>'} {selectedCategoryInfo.subCategory?.name}
        </div>
        <div className='text-sm p-1 px-2'>
          {selectedCategories.length > 0 ? (
            <div className='flex flex-wrap gap-1'>
              {selectedCategories.map((category) => (
                <span
                  key={category.id}
                  className='bg-gray-200 text-xs px-2 py-1 rounded-lg flex items-center'
                >
                  {category.name}
                  <button className='ml-1 text-red-500' onClick={() => handleRemove(category.id)}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
          ) : (
            '선택된 카테고리가 없습니다.'
          )}
        </div>

        <div className='border-y my-2 border-[#E4E4E7] flex min-h-[312px] h-auto'>
          {/* 대분류 카테고리 목록 */}
          <ul className='py-2 overflow-y-auto max-h-[500px] max-w-[150px] w-full h-full border-r border-[#E4E4E7]'>
            {categories?.map((category, index) => (
              <li
                onClick={() =>
                  setSelectedCategoryInfo({ id: category.id, name: category.name, index: index })
                }
                className={`${selectedCategoryInfo.name === category.name ? 'bg-[#4294F2] text-white' : ''} px-2 mr-1 py-0.5 cursor-pointer hover:bg-[#3587E4] hover:text-white`}
                key={category.id}
              >
                {category.name}
              </li>
            ))}
          </ul>

          {/* 중분류 카테고리 목록 */}
          <ul className='w-full h-full flex flex-wrap gap-0.5 overflow-y-auto'>
            {categories[selectedCategoryInfo.index]?.subCategories?.map((subCategory) => {
              const isSelected = selectedCategories.some((cat) => cat.id === subCategory.id);
              return (
                <li
                  onClick={() => {
                    setSelectedCategoryInfo((prev) => ({
                      ...prev,
                      subCategory: {
                        name: subCategory.name,
                        id: subCategory.id,
                      },
                    }));
                    handleSelect(subCategory);
                  }}
                  className={`rounded-sm px-2 border-[#E4E4E7] w-33 h-24 border m-1 p-3 text-center transition duration-75 hover:border-[#4294F2] cursor-pointer ${
                    isSelected ? 'bg-blue-200 border-blue-500' : ''
                  }`}
                  key={subCategory.id}
                >
                  {subCategory.name}
                </li>
              );
            })}
          </ul>
        </div>

        {/* 모달 푸터 */}
        <div className='w-full px-2'>
          <div className='flex gap-1 justify-end '>
            <button className='border border-[#E4E4E7] rounded-[3px] p-1.5' onClick={onCancel}>
              취소
            </button>
            <button
              className='bg-[#4294F2] text-white border border-[#E4E4E7] rounded-[3px] p-1.5'
              onClick={onSave}
            >
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
