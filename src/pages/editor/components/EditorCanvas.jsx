import { useRef } from 'react';
import styles from '../styles/EditorCanvas.module.css';
import { useDrag, useDrop } from 'react-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import EditorPreview from './EditorPreview';

// const tabList = ['에디터', '미리보기'];
export default function EditorCanvas({
  editorTab,
  elements,
  selectedElement,
  setSelectedElement,
  onElementUpdate,
  onElementRemove,
  onElementMove,
}) {
  return (
    <div className={styles.editorCanvas}>
      <div className={styles.canvasTab}>{editorTab}</div>
      <div className={styles.editorCanvasDisplay}>
        {/* 편집기 와이어프레임 뷰 */}
        <div className={`${styles.wireframeView}`}>
          {elements.length === 0 ? (
            <p style={{ textAlign: 'center', marginTop: '2rem' }}>
              요소를 선택하여 쇼핑몰을 구성해보세요!
            </p>
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
    <div ref={divRef} className={styles.draggableElement} onClick={onClick}>
      {/* 렌더링되는 요소 */}
      <EditorPreview element={element} />

      {/* 요소 삭제 버튼 */}
      <div
        className={styles.elementDeleteButton}
        style={isSelected ? { opacity: 1 } : { opacity: 0.2 }}
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
