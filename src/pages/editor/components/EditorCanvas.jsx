import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import EditorPreview from './EditorPreview';
import { Link } from 'react-router-dom';
import { Rnd } from 'react-rnd';

export default function EditorCanvas({
  editorTab,
  elements,
  selectedElement,
  setSelectedElement,
  onElementUpdate,
  setElements,
  onElementRemove,
  onElementMove,
}) {
  const handleElementMove = (dragIndex, hoverIndex) => {
    const updatedElements = [...elements];

    if (
      dragIndex < 0 ||
      hoverIndex < 0 ||
      dragIndex >= updatedElements.length ||
      hoverIndex >= updatedElements.length
    ) {
      console.error('잘못된 인덱스:', dragIndex, hoverIndex);
      return;
    }

    const [draggedElement] = updatedElements.splice(dragIndex, 1);
    if (!draggedElement) {
      console.error('드래그된 요소가 없습니다.');
      return;
    }

    draggedElement.index = hoverIndex;
    updatedElements.splice(hoverIndex, 0, draggedElement);

    setElements(updatedElements);
    onElementMove(updatedElements);
    setSelectedElement(draggedElement);
  };

  return (
    <div className="w-full">
      <div className="m-1 border border-gray-200 rounded max-w-[240px] flex gap-2 p-2">
        <Link
          to="/editor"
          className="flex-1 text-center py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
        >
          웹 편집
        </Link>
        <Link
          to="/mobileeditor"
          className="flex-1 text-center py-1 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded transition-colors"
        >
          모바일 편집
        </Link>
      </div>
      <div className="border border-gray-200 overflow-y-auto overflow-x-hidden auto max-h-[690px] h-full m-2 rounded-md">
        <div className="p-2">
          {elements.length === 0 ? (
            <p className="text-center mt-8">요소를 선택하여 쇼핑몰을 구성해보세요!</p>
          ) : (
            elements
              .filter((element) => element != null)
              .map((element, index) => {
                if (!element.id) return null;
                return (
                  <DraggableElement
                    key={element.id}
                    element={element}
                    index={index}
                    isSelected={selectedElement?.id === element?.id}
                    onClick={() => setSelectedElement(element)}
                    onMove={handleElementMove}
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
function ensurePercent(value) {
  if (typeof value === 'number') return `${value}%`;
  if (typeof value === 'string') {
    if (value.endsWith('%')) return value;
    if (value.endsWith('px')) return value;
    return `${value}%`;
  }
  return '100%';
}
function DraggableElement({ element, index, isSelected, onClick, onUpdate, onRemove, onMove }) {
  const divRef = useRef(null);
  const platform = element.type.startsWith('mobile') ? 'mobile' : 'web'; // ✅ 여기!

  const [{ isDragging }, drag] = useDrag({
    type: 'TEMPLATE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  function calculateScaledSize(value) {
    if (!value) return '100%';
    if (value === 'auto') return 'auto';
  
    const number = parseFloat(value);
    const unit = value.includes('%') ? '%' : value.includes('px') ? 'px' : '';
  
    // 65%만큼 축소
    const scaled = number * 0.65;
  
    return `${scaled}${unit}`;
  }
  
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
    <Rnd
      size={{
        width: calculateScaledSize(element.properties?.size?.[platform]?.width),
        height: calculateScaledSize(element.properties?.size?.[platform]?.height),
      }}
      minWidth={100}
      minHeight={100}
      maxWidth={800}  // 또는 화면 크기에 맞춰서 계산
      maxHeight={400}
      enableResizing={{
        top: true, right: true, bottom: true, left: true,
        topRight: true, bottomRight: true, bottomLeft: true, topLeft: true,
      }}
      style={{ marginBottom: '12px' }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const rawWidth = ref.offsetWidth;
        const rawHeight = ref.offsetHeight;
        const node = ref.node || ref.resizable || ref; // react-rnd가 넘기는 실제 DOM 요소
        const parent = node?.parentElement;

        if (!parent) {
          console.warn('부모 요소를 찾을 수 없습니다. 기본값 사용');
          return;
        }

        const parentWidth = parent.offsetWidth;
        const parentHeight = parent.offsetHeight;


        const percentWidth = ((rawWidth / parentWidth) * 100).toFixed(2) + '%';
  const percentHeight =
    element.properties?.size?.[platform]?.height === 'auto'
      ? 'auto'
      : ((rawHeight / parentHeight) * 100).toFixed(2) + '%';

      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          size: {
            ...element.properties.size,
            [platform]: {
              ...(element.properties.size?.[platform] || {}),
              width: percentWidth,
              height: percentHeight,
            },
          },
        },
      };

        onUpdate(updatedElement);
      }}
    >
      <div
        ref={divRef}
        className='relative p-2 border border-none cursor-pointer hover:shadow-[0_0_1px_black] h-full w-full'
        onClick={onClick}
      >
        <EditorPreview element={element} />
        <div
          className={`absolute top-0 right-0 cursor-pointer p-1 rounded ${
            isSelected ? 'opacity-100 border border-black' : 'opacity-20'
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(element.id);
            }}
          >
            <IoTrashOutline />
          </button>
        </div>
      </div>
    </Rnd>
  );
}