"use client"

import { useRef, useState, useEffect } from "react"
import { useDrag, useDrop } from "react-dnd"
import { IoTrashOutline } from "react-icons/io5"
import { Rnd } from "react-rnd"
import { createPortal } from "react-dom"
import { Link } from "react-router-dom"

// Import your component previews and actual components
import EditorPreview from "./EditorPreview"
import Header from "../../../components/Header"
import Banner from "../../../components/Banner"
import ProductGrid from "../../../components/ProductGrid"
import Blank from "../../../components/Blank"
import Text from "../../../components/Text"
import ImageBox from "../../../components/ImageBox"
import ColorBox from "../../../components/ColorBox"
import MobileHeader from "../../../components/MobileHeader"
import MobileBanner from "../../../components/MobileBanner"
import MobileBottomNavigationBar from "../../../components/MobileBottomNavigationBar"
import MobileGrid from "../../../components/MobileGrid"

const componentsMap = {
  header: EditorPreview,
  banner: EditorPreview,
  grid: EditorPreview,
  blank: EditorPreview,
  text: EditorPreview,
  image: EditorPreview,
  colorbox: EditorPreview,
  mobileheader: EditorPreview,
  mobilebanner: EditorPreview,
  mobilegrid: EditorPreview,
  mobilebottomnavigationbar: EditorPreview,
}

const previewComponentsMap = {
  header: Header,
  banner: Banner,
  grid: ProductGrid,
  blank: Blank,
  text: Text,
  image: ImageBox,
  colorbox: ColorBox,
  mobileheader: MobileHeader,
  mobilebanner: MobileBanner,
  mobilegrid: MobileGrid,
  mobilebottomnavigationbar: MobileBottomNavigationBar,
}

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
  const [canvasHeight, setCanvasHeight] = useState(1000) // 초기 캔버스 높이
  const [gridColumns, setGridColumns] = useState(8)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const bottomRef = useRef(null)
  const gridContainerRef = useRef(null)
  const gridGap = 8

  const gridOverlayStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)`,
    backgroundSize: `${100 / gridColumns}% 100%`,
    zIndex: 1,
  }

  // 요소 이동 시 canvasHeight 갱신
  const handleElementMove = (dragIndex, hoverIndex) => {
    const updatedElements = [...elements]
    if (dragIndex < 0 || hoverIndex < 0 || dragIndex >= updatedElements.length || hoverIndex >= updatedElements.length)
      return

    const [draggedElement] = updatedElements.splice(dragIndex, 1)
    if (!draggedElement) return

    draggedElement.index = hoverIndex
    updatedElements.splice(hoverIndex, 0, draggedElement)

    setElements(updatedElements)
    onElementMove(updatedElements)
    setSelectedElement(draggedElement)

    // canvasHeight는 이동만으로 갱신되지 않도록 설정
  }

  // 캔버스 높이를 계산하는 함수
  const updateCanvasHeight = () => {
    if (gridContainerRef.current) {
      const children = Array.from(gridContainerRef.current.children)
      let maxHeight = 0

      children.forEach((child) => {
        const childRect = child.getBoundingClientRect()
        const childBottom = childRect.top + childRect.height
        maxHeight = Math.max(maxHeight, childBottom)
      })

      setCanvasHeight(maxHeight + 50) // 50px 여유 추가
    }
  }

  // 요소들이 변경될 때마다 캔버스 높이 자동 계산을 막기 위해 useEffect에서 상태 변경 방지
  useEffect(() => {
    // 요소 변경 시 canvasHeight를 자동으로 갱신하지 않도록 설정
    // updateCanvasHeight() 함수 호출을 막습니다.
  }, [elements]) // elements 상태 변화시 캔버스 높이 갱신 안함

  // 더보기 버튼 클릭 시 캔버스 높이 증가
  const handleLoadMore = () => {
    setCanvasHeight((prev) => prev + 500) // 더보기 버튼을 클릭하면 캔버스 높이 500px씩 증가
  }

  return (
    <div className="w-full">
      {/* 상단 탭 + 미리보기 */}
      <div className="m-2 border border-gray-200 rounded-lg shadow-sm max-w-[360px] flex gap-2 p-2 bg-white">
        <Link
          to="/editor"
          className="flex-1 text-center py-2 px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium"
        >
          웹 편집
        </Link>
        <Link
          to="/mobileeditor"
          className="flex-1 text-center py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors font-medium"
        >
          모바일
          <br />
          편집
        </Link>
        <button
          onClick={() => setIsPreviewOpen(true)}
          className="flex-1 text-center py-2 px-3 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors font-medium"
        >
          미리보기
        </button>
      </div>

      <div className="flex gap-2 m-2 items-center">
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          열 수:
          <input
            type="number"
            value={gridColumns}
            onChange={(e) => setGridColumns(Number(e.target.value))}
            className="border border-gray-300 rounded-md p-1.5 w-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </label>
      </div>

      {/* 캔버스 */}
      <div
        ref={gridContainerRef}
        className="border border-gray-200 overflow-y-auto overflow-x-hidden m-2 rounded-lg shadow-sm bg-white"
        style={{
          position: "relative",
          width: "100%",
          minHeight: `${canvasHeight}px`, // 자동으로 갱신된 높이 사용
          transform: "none",
        }}
      >
        <div style={gridOverlayStyle} />
        {elements.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-center">요소를 선택하여 쇼핑몰을 구성해보세요!</p>
          </div>
        ) : (
          elements
            .filter((el) => el != null)
            .sort((a, b) => (a.type === "colorbox" ? -1 : 1)) // ColorBox를 가장 먼저(=뒤에 깔리도록)
            .map((element, index) => {
              if (!element.id) return null
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
              )
            })
        )}
        <div ref={bottomRef} style={{ height: "1px" }} />
      </div>

      {/* 더보기 버튼 */}
      <div className="text-center mt-4 mb-6">
        <button
          onClick={handleLoadMore} // 더보기 버튼을 클릭하면 캔버스 높이 500px씩 증가
          className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors font-medium shadow-sm"
        >
          더보기
        </button>
      </div>

      {/* 미리보기 모달 */}
      {isPreviewOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-[90%] max-h-[90%] overflow-y-auto p-6 relative">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
                onClick={() => setIsPreviewOpen(false)}
              >
                <span className="text-2xl font-bold">✕</span>
              </button>
              <div className="relative w-full min-h-[600px]">
                {elements.map((component, index) => {
                  const Component = previewComponentsMap[component.type]
                  if (!Component || !component.layout) return null

                  const platform = component.type.startsWith("mobile") ? "mobile" : "web"
                  const height = component?.properties?.size?.[platform]?.height || "auto"

                  return (
                    <div
                      key={component.id || index}
                      style={{
                        position: "absolute",
                        top: `${component.layout.top}px`,
                        left: `${((component.layout.column - 1) / gridColumns) * 100}%`,
                        width: `${(component.layout.columnSpan / gridColumns) * 100}%`,
                        height,
                      }}
                    >
                      <Component {...component.properties} sellerId={sellerId} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
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
  const divRef = useRef(null)
  const platform = element.type.startsWith("mobile") ? "mobile" : "web"

  const getElementPosition = () => {
    if (!gridContainerRef.current) return { top: 0, left: 0 }
    const containerRect = gridContainerRef.current.getBoundingClientRect()
    const cellWidth = containerRect.width / gridColumns
    const left = (element.layout.column - 1) * cellWidth + gridGap
    const top = element.layout.top !== undefined ? element.layout.top : gridGap
    return { top, left }
  }

  const { top, left } = getElementPosition()

  const calculateScaledSize = (value) => {
    if (!value) return "100%"
    if (value === "auto") return "auto"
    return value
  }

  const [{ isDragging }, drag] = useDrag({
    type: "TEMPLATE",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop({
    accept: "TEMPLATE",
    hover(item, monitor) {
      if (!gridContainerRef.current) return
      const containerRect = gridContainerRef.current.getBoundingClientRect()
      const scrollLeft = gridContainerRef.current.scrollLeft
      const clientOffset = monitor.getClientOffset()
      if (!clientOffset) return
      const cellWidth = containerRect.width / gridColumns
      const relativeX = clientOffset.x - containerRect.left + scrollLeft
      const cellX = Math.floor(relativeX / cellWidth) + 1

      const newLayout = {
        ...element.layout,
        column: cellX,
      }
      onUpdate({
        ...element,
        layout: newLayout,
      })
    },
  })

  drag(drop(divRef))

  return (
    <Rnd
      style={{
        zIndex: 1, // 낮게 명시해서 스택 우선순위 보장
      }}
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
        if (!gridContainerRef.current) return
        const containerRect = gridContainerRef.current.getBoundingClientRect()
        const scrollLeft = gridContainerRef.current.scrollLeft
        const cellWidth = containerRect.width / gridColumns
        const relativeX = d.x + scrollLeft
        const newColumn = Math.floor(relativeX / cellWidth) + 1
        const newTop = d.y

        onUpdate({
          ...element,
          layout: {
            ...element.layout,
            top: newTop,
            column: newColumn,
          },
        })
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!gridContainerRef.current) return
        const containerRect = gridContainerRef.current.getBoundingClientRect()
        const cellWidth = containerRect.width / gridColumns
        const rawWidth = ref.offsetWidth
        const rawHeight = ref.offsetHeight
        const newColumnSpan = Math.max(1, Math.round(rawWidth / cellWidth))

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
                width: ((rawWidth / containerRect.width) * 100).toFixed(2) + "%",
                height: rawHeight + "px",
              },
            },
          },
        }
        onUpdate(updatedElement)
      }}
    >
      <div
        ref={divRef}
        className={`relative p-2 border cursor-pointer h-full w-full transition-all ${
          isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:shadow-md hover:border-gray-300"
        }`}
        onClick={onClick}
      >
        <EditorPreview element={element} />
        <div
          className={`absolute top-1 right-1 cursor-pointer p-1 rounded-full bg-white shadow-sm ${
            isSelected ? "opacity-100" : "opacity-0 hover:opacity-100"
          }`}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove(element.id)
            }}
            className="text-gray-600 hover:text-red-500 transition-colors"
          >
            <IoTrashOutline size={16} />
          </button>
        </div>
      </div>
    </Rnd>
  )
}
