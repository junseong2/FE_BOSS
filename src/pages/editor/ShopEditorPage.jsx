import styles from './styles/ShopEditorPage.module.css';

import { useState } from 'react';
import EditorHeader from './components/layout/EditorHeader';
import EditorSidebar from './components/layout/EditorSidebar';
import EditorTab from './components/tab/EditorTab';
import EditorTabContent from './components/tab/EditorTabContent';
import EditorCanvas from './components/EditorCanvas';

import { elementTemplates, initialElements } from '../../data/shop-templates';

const sidebarTabList = ['요소', '설정'];
const canvasTabList = ['에디터', '미리보기'];

export default function ShopEditorPage() {
  const [elements, setElements] = useState(initialElements);
  const [selectedElement, setSelectedElement] = useState(null);
  const [sidebarSelectedTabName, setSidebarSelectedTapName] = useState('요소');
  const [canvasSelectedTabName, setCanvasSelectedTabName] = useState('에디터');

  // 요소 수정
  const onElementUpdate = (updatedElement) => {
    setElements(elements.map((el) => (el.id === updatedElement.id ? updatedElement : el)));
  };

  // 요소 추가
  const onAddElement = (element) => {
    setElements([...elements, { ...element, id: `el-${Date.now()}` }]);
  };

  // 요소 제거
  const onRemoveElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  // 요소 이동(드래그)
  const onMoveElement = (dragIndex, hoverIndex) => {
    const newElements = [...elements];
    const draggedElement = newElements[dragIndex];
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, draggedElement);
    setElements(newElements);
  };

  // 판매자의 레이아웃 설정 저장
  const handleSave = () => {
    // 실제 앱에서는 데이터베이스에 저장
    console.log('쇼핑몰 구성 저장:', { elements, shopSettings });
    alert('쇼핑몰 구성이 성공적으로 저장되었습니다!');
  };

  // 사이드바 탭 전환 함수
  function onSidebarTabChange(tabName) {
    setSidebarSelectedTapName(tabName);
  }

  // 캔버스 탭 전환 함수
  function onCanvasTabChange(tabName) {
    setCanvasSelectedTabName(tabName);
  }

  return (
    <div className={`${styles.editorPage}`}>
      {/* 헤더 */}
      <EditorHeader />

      <div className={styles.editorCanvasLayout}>
        {/* 사이드바 */}
        <EditorSidebar>
          <EditorTab
            tabList={sidebarTabList}
            targetTabName={sidebarSelectedTabName}
            onTabChange={onSidebarTabChange}
          />
          <EditorTabContent
            targetTabName={sidebarSelectedTabName}
            onSelectElement={onAddElement}
            elements={elementTemplates}
          />
        </EditorSidebar>

        {/* 캔버스 */}
        <EditorCanvas
          tab={'editor'}
          editorTab={
            <EditorTab
              tabList={canvasTabList}
              onTabChange={onCanvasTabChange}
              targetTabName={canvasSelectedTabName}
            />
          }
          elements={elements}
          selectedElement={selectedElement}
          setSelectedElement={setSelectedElement}
          onElementUpdate={onElementUpdate}
          onElementRemove={onRemoveElement}
          onElementMove={onMoveElement}
        />
      </div>
    </div>
  );
}
