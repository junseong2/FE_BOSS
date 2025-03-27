import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import EditorPreview from './EditorPreview';
import { Link } from 'react-router-dom';

export default function EditorCanvas({
  editorTab,
  elements,
  selectedElement,
  setSelectedElement,
  onElementUpdate,
  setElements,  // 부모에서 전달된 setElements 함수
  onElementRemove,
  onElementMove,
}) {





  // handleElementMove: 요소의 순서를 바꾸는 함수
  const handleElementMove = (dragIndex, hoverIndex) => {
    const updatedElements = [...elements];  // 요소 배열 복사

    // 유효한 인덱스인지 확인
    if (dragIndex < 0 || hoverIndex < 0 || dragIndex >= updatedElements.length || hoverIndex >= updatedElements.length) {
      console.error('잘못된 인덱스:', dragIndex, hoverIndex);
      return; // 잘못된 인덱스일 경우 처리하지 않음
    }

    const [draggedElement] = updatedElements.splice(dragIndex, 1);  // 드래그된 요소를 배열에서 추출

    if (!draggedElement) {
      console.error('드래그된 요소가 없습니다.');
      return; // 드래그된 요소가 없으면 종료
    }

    console.log("드래그된 요소:", draggedElement); // 드래그된 요소 확인
    console.log("드래그 후 updatedElements (이동 전):", updatedElements); // 이동 전 배열 상태

    // 드래그된 요소의 index를 새로운 위치로 업데이트
    draggedElement.index = hoverIndex;  // index 업데이트
    updatedElements.splice(hoverIndex, 0, draggedElement); // 새로운 위치에 삽입

    console.log("드래그 후 updatedElements (이동 후):", updatedElements); // 이동 후 배열 상태

    // 상태 업데이트: 새로 업데이트된 배열을 setElements에 전달
    setElements(updatedElements);
    console.log("setElements 호출 후 elements 상태:", updatedElements); // 상태 업데이트 후 확인

    // 상위 컴포넌트로 새로운 배열 전달 (onElementMove)

    
    setElements(updatedElements);
    console.log("setElements 호출 후 elements 상태:", updatedElements); // 상태 업데이트 후 확인
    // 상위 컴포넌트로 새로운 배열 전달 (onElementMove)
    onElementMove(updatedElements);


    // selectedElement 상태도 갱신 (드래그 후 최신 요소로 선택된 요소 업데이트)
    setSelectedElement(draggedElement);  // 드래그된 요소로 선택된 요소 업데이트
  };

  return (
    <div className="w-full">

<div className="m-1 border border-gray-200 rounded max-w-[240px] flex gap-2 p-2">
  <Link
    to="/editor"
    className="flex-1 text-center py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
  >
    미리보기
  </Link>
  <Link
    to="/mobileeditor"
    className="flex-1 text-center py-1 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
  >
    모바일 미리보기
  </Link>
</div>     <div className="border border-gray-200 overflow-y-auto overflow-x-hidden auto max-h-[690px] h-full m-2 rounded-md">
        <div className="p-2">
          {elements.length === 0 ? (
            <p className="text-center mt-8">요소를 선택하여 쇼핑몰을 구성해보세요!</p>
          ) : (
            elements.filter(element => element != null).map((element, index) => {
              if (!element.id) return null; // 요소가 undefined인 경우 건너뜁니다.
              return (
                <DraggableElement
                  key={element.id}
                  element={element}
                  index={index}
                  onClick={() => setSelectedElement(element)}
                  onMove={(dragIndex, hoverIndex) => handleElementMove(dragIndex, hoverIndex)} // 순서 변경 처리
                  onRemove={onElementRemove}
                  onUpdate={onElementUpdate}
                />
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}





/** 드래그 가능한 요소 렌더링 *//** 드래그 가능한 요소 렌더링 */
function DraggableElement({ element, index, isSelected, onClick, onUpdate, onRemove, onMove }) {
  const divRef = useRef(null);

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

      // 순서가 동일한 경우에는 처리하지 않음
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = divRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      // 드래그한 요소가 위로 드롭되는지, 아래로 드롭되는지 판단
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      // 순서 변경을 처리하는 onMove 호출
      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex; // 드래그된 아이템의 index를 새 위치로 업데이트
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
      <EditorPreview element={element} />

      {/* 요소 삭제 버튼 */}
      <div
        className={`absolute top-0 right-0 cursor-pointer p-1 rounded ${isSelected ? 'opacity-100 border border-black' : 'opacity-20'}`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(element.id);  // 선택된 템플릿 요소 제거
          }}
        >
          <IoTrashOutline />
        </button>
      </div>
    </div>
  );
}
