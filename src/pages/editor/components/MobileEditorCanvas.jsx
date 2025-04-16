import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import MobileEditorPreview from './MobileEditorPreview';
import { Link } from 'react-router-dom';
import { MdDesktopWindows, MdPhoneIphone, MdVisibility } from 'react-icons/md';
export default function MobileEditorCanvas({
  editorTab,
  elements,
  selectedElement,
  setSelectedElement,
  onElementUpdate,
  onElementRemove,
  onElementMove,
}) {


  return (
    <div className='w-full '>

<div className="m-2 border border-gray-200 rounded-lg shadow-sm max-w-[360px] flex gap-2 p-2 bg-white">
  <Link
    to="/editor"
    className="flex-1 flex flex-col items-center justify-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"

  
  >
    <MdDesktopWindows size={24} />
    <span className="text-sm mt-1">웹 편집</span>
  </Link>

  <Link
    to="/mobileeditor"
    className="flex-1 flex flex-col items-center justify-center py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"

    >
    <MdPhoneIphone size={24} />
    <span className="text-sm mt-1">모바일</span>
  </Link>

  <button
    onClick={() => setIsPreviewOpen(true)}
    className="flex-1 flex flex-col items-center justify-center py-2 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium"
  >
    <MdVisibility size={24} />
    <span className="text-sm mt-1">미리보기</span>
  </button>
</div>      <div className='border-8 border-black overflow-y-auto overflow-x-hidden max-h-[915px] h-full w-[800px] m-2 rounded-lg'>
        {/* 편집기 와이어프레임 뷰 */}
        <div className='p-2'>
          {elements.length === 0 ? (
            <p className='text-center mt-8'>요소를 선택하여 쇼핑몰을 구성해보세요!</p>
          ) : (
            elements?.map((element, index) => {
              if (!element.id) return null;
              return (
                <DraggableElement
                  key={element.id}
                  element={element}
                  index={index}
                  isSelected={selectedElement?.id === element?.id}
                  onClick={() => setSelectedElement(element)}
                  onMove={onElementMove}
                  onRemove={onElementRemove}
                  onUpdate={onElementUpdate}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/** 드래그 가능한 요소 렌더링 */
function DraggableElement({ element, index, isSelected, onClick, onUpdate, onRemove, onMove }) {
  const divRef = useRef(null);

  console.log("편집 가능한 모바일 요소:",element)

  // 드래깅 처리 및 드래깅 유무 체크
  const [{ isDragging }, drag] = useDrag({
    type: 'TEMPLATE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // 드롭 처리
  const [, drop] = useDrop({
    accept: 'TEMPLATE',
    hover(item, monitor) {
      if (!divRef.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = divRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(divRef));

  return (
    <div
      ref={divRef}
      className='relative p-2 border border-none cursor-pointer hover:shadow-[0_0_1px_black]'
      onClick={onClick}
    >
      {/* 프리뷰(미리보기) 요소 */}
      <MobileEditorPreview element={element} />

      {/* 요소 삭제 버튼 */}
      <div
        className={`absolute top-0 right-0 cursor-pointer p-1 rounded ${
          isSelected ? 'opacity-100 border border-black' : 'opacity-20'
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(element.id); // 선택된 템플릿 요소 제거
          }}
        >
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
}
