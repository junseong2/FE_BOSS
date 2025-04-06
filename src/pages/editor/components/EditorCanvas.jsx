import { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import EditorPreview from './EditorPreview';
import { Link } from 'react-router-dom';
import { Rnd } from 'react-rnd';
import Header from '../../../components/Header';
import Banner from '../../../components/Banner';
import ProductGrid from '../../../components/ProductGrid';
import Blank from '../../../components/Blank';
import Text from '../../../components/Text';
import ImageBox from '../../../components/ImageBox';
import MobileHeader from '../../../components/MobileHeader';
import MobileBanner from '../../../components/MobileBanner';
import MobileBottomNavigationBar from '../../../components/MobileBottomNavigationBar';
import MobileGrid from '../../../components/MobileGrid';
const componentsMap = {
  header: EditorPreview,
  banner: EditorPreview,
  grid: EditorPreview,
  blank: EditorPreview,
  text: EditorPreview,
  image: EditorPreview,
  mobileheader: EditorPreview,
  mobilebanner: EditorPreview,
  mobilegrid: EditorPreview,
  mobilebottomnavigationbar: EditorPreview,
};
const previewComponentsMap = {
  header: Header,
  banner: Banner,
  grid: ProductGrid,
  blank: Blank,
  text: Text,
  image: ImageBox,
  mobileheader: MobileHeader,
  mobilebanner: MobileBanner,
  mobilegrid: MobileGrid,
  mobilebottomnavigationbar: MobileBottomNavigationBar,
};

export default function EditorCanvas({
  sellerId,
  editorTab,
  elements,
  selectedElement,
  setSelectedElement,
  onElementUpdate,
  setElements,
  onElementRemove,
  onElementMove,
}) {
  const [canvasHeight, setCanvasHeight] = useState(1000);
  const [gridColumns, setGridColumns] = useState(8);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const bottomRef = useRef(null);
  const gridContainerRef = useRef(null);
  const gridGap = 8;

  const gridOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.2) 1px, transparent 1px)`,
    backgroundSize: `${100 / gridColumns}% 100%`,
    zIndex: 1,
  };

  const handleElementMove = (dragIndex, hoverIndex) => {
    const updatedElements = [...elements];
    if (
      dragIndex < 0 ||
      hoverIndex < 0 ||
      dragIndex >= updatedElements.length ||
      hoverIndex >= updatedElements.length
    ) return;

    const [draggedElement] = updatedElements.splice(dragIndex, 1);
    if (!draggedElement) return;

    draggedElement.index = hoverIndex;
    updatedElements.splice(hoverIndex, 0, draggedElement);

    setElements(updatedElements);
    onElementMove(updatedElements);
    setSelectedElement(draggedElement);
  };

  return (
    <div className="w-full">
      {/* 상단 탭 + 미리보기 */}
      <div className="m-1 border border-gray-200 rounded max-w-[360px] flex gap-2 p-2">
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
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="flex-1 text-center py-1 px-3 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
        >
          미리보기
        </button>
      </div>


      <div className="flex gap-2 m-2">
        <label>
          열 수:
          <input
            type="number"
            value={gridColumns}
            onChange={(e) => setGridColumns(Number(e.target.value))}
            className="ml-1 border p-1 w-16"
          />
        </label>
      </div>

      {/* 캔버스 */}
      <div
        ref={gridContainerRef}
        className="border border-gray-200 overflow-y-auto overflow-x-hidden m-2 rounded-md"
        style={{
          position: 'relative',
          width: '100%',
          minHeight: `${canvasHeight}px`,
        }}
      >
        <div style={gridOverlayStyle} />
        {elements.length === 0 ? (
          <p className="text-center mt-8">요소를 선택하여 쇼핑몰을 구성해보세요!</p>
        ) : (
          elements
            .filter((el) => el != null)
            .map((element, index) => {
              if (!element.id) return null;
              return (
                <DraggableElement
                key={`${element.id}-${index}`}                  
                element={element}
                  gridColumns={gridColumns}
                  gridGap={gridGap}
                  gridContainerRef={gridContainerRef}
                  index={index}
                  isSelected={selectedElement?.id === element.id}
                  onClick={() => setSelectedElement(element)}
                  onMove={handleElementMove}
                  onRemove={onElementRemove}
                  onUpdate={onElementUpdate}
                />
              );
            })
        )}
        <div ref={bottomRef} style={{ height: '1px' }} />
      </div>

      {/* 더보기 버튼 */}
      <div className="text-center mt-4">
        <button
          onClick={() => setCanvasHeight((prev) => prev + 500)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          더보기
        </button>
      </div>

      {/*  미리보기 모달 */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg w-[90%] max-h-[90%] overflow-y-auto p-6 relative">
            <button
              className="absolute top-3 right-3 text-2xl font-bold"
              onClick={() => setIsPreviewOpen(false)}
            >
              ✕
            </button>
            <div className="relative w-full min-h-[600px]">
              {elements.map((component, index) => {
                
                const Component = previewComponentsMap[component.type]; // ✅ 변경
                if (!Component || !component.layout) return null;
                const platform = component.type.startsWith('mobile') ? 'mobile' : 'web';
                const height = component?.properties?.size?.[platform]?.height || 'auto';
                console.log("🧩 렌더링할 elements 목록:", elements);

                return (
                  <div
                    key={component.id || index}
                    style={{
                      position: 'absolute',
                      top: `${component.layout.top}px`,
                      left: `${((component.layout.column - 1) / gridColumns) * 100}%`,
                      width: `${(component.layout.columnSpan / gridColumns) * 100}%`,
                      height,
                    }}
                  >
<Component {...component.properties} sellerId={sellerId} />
</div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DraggableElement({
  element,
  gridColumns,
  gridGap,
  gridContainerRef,
  index,
  isSelected,
  onClick,
  onUpdate,
  onRemove,
}) {
  const divRef = useRef(null);
  const platform = element.type.startsWith('mobile') ? 'mobile' : 'web';

  const getElementPosition = () => {
    if (!gridContainerRef.current) return { top: 0, left: 0 };
    const containerRect = gridContainerRef.current.getBoundingClientRect();
    const cellWidth = containerRect.width / gridColumns;
    const left = (element.layout.column - 1) * cellWidth + gridGap;
    const top = element.layout.top !== undefined ? element.layout.top : gridGap;
    return { top, left };
  };

  const { top, left } = getElementPosition();

  const calculateScaledSize = (value) => {
    if (!value) return '100%';
    if (value === 'auto') return 'auto';
    return value;
  };

  const [{ isDragging }, drag] = useDrag({
    type: 'TEMPLATE',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'TEMPLATE',
    hover(item, monitor) {
      if (!gridContainerRef.current) return;
      const containerRect = gridContainerRef.current.getBoundingClientRect();
      const scrollLeft = gridContainerRef.current.scrollLeft;
      const clientOffset = monitor.getClientOffset();
      if (!clientOffset) return;
      const cellWidth = containerRect.width / gridColumns;
      const relativeX = clientOffset.x - containerRect.left + scrollLeft;
      const cellX = Math.floor(relativeX / cellWidth) + 1;

      const newLayout = {
        ...element.layout,
        column: cellX,
      };
      onUpdate({
        ...element,
        layout: newLayout,
      });
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
      minHeight={50}
      bounds="parent"
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
      position={{ x: left, y: top }}
      onDragStop={(e, d) => {
        if (!gridContainerRef.current) return;
        const containerRect = gridContainerRef.current.getBoundingClientRect();
        const scrollLeft = gridContainerRef.current.scrollLeft;
        const cellWidth = containerRect.width / gridColumns;
        const relativeX = d.x + scrollLeft;
        const newColumn = Math.floor(relativeX / cellWidth) + 1;
        const newTop = d.y;

        onUpdate({
          ...element,
          layout: {
            ...element.layout,
            top: newTop,
            column: newColumn,
          },
        });
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!gridContainerRef.current) return;
        const containerRect = gridContainerRef.current.getBoundingClientRect();
        const cellWidth = containerRect.width / gridColumns;
        const rawWidth = ref.offsetWidth;
        const rawHeight = ref.offsetHeight;
        const newColumnSpan = Math.max(1, Math.round(rawWidth / cellWidth));

        const updatedElement = {
          ...element,
          layout: {
            ...element.layout,
            columnSpan: newColumnSpan,
          },
          properties: {
            ...element.properties,
            size: {
              ...element.properties.size,
              [platform]: {
                width: ((rawWidth / containerRect.width) * 100).toFixed(2) + '%',
                height: rawHeight + 'px',
              },
            },
          },
        };
        onUpdate(updatedElement);
      }}
    >
      <div
        ref={divRef}
        className="relative p-2 border border-none cursor-pointer hover:shadow-[0_0_1px_black] h-full w-full"
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
