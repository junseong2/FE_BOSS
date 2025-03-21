import { useEffect, useState } from 'react';
import EditorHeader from './components/layout/EditorHeader';
import EditorSidebar from './components/layout/EditorSidebar';
import EditorTab from './components/tab/EditorTab';
import EditorTabContent from './components/tab/EditorTabContent';
import EditorCanvas from './components/EditorCanvas';
import ElementEditor from './components/input/ElementEditor';

import { elementTemplates, initialElements } from '../../data/shop-templates';
import { IoCloseOutline } from 'react-icons/io5';
import { getCategories } from '../../services/category.service';

const sidebarTabList = ['요소', '설정'];
const canvasTabList = ['미리보기'];

export default function ShopEditorPage() {
  const [elements, setElements] = useState(initialElements); // 보여질 요소
  const [selectedElement, setSelectedElement] = useState(null); // 선택된 요소
  const [sidebarSelectedTabName, setSidebarSelectedTapName] = useState('설정');
  const [canvasSelectedTabName, setCanvasSelectedTabName] = useState('에디터');

  const [categories, setCategories] = useState([]); // 상품 카테고리

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

  // 대/중분류 카테고리 조회
  async function getCategoriesFetch() {
    const categories = await getCategories();
    setCategories(categories);
  }

  useEffect(() => {
    getCategoriesFetch();
  }, []);

  return (
    <div className='w-full h-full absolute left-0 top-0 flex'>
      <div className='w-full'>
        {/* 헤더 */}
        <EditorHeader onSave={handleSave} />

        <div className='flex h-full'>
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

          {/* 편집기 설정 미리보기 */}
          <EditorCanvas
            tab='editor'
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

      {/* 각 요소(헤더, 배너 등) 세부 편집기 */}
      {selectedElement && (
        <div className='w-80 border-l border-[#E4E4E7] p-4 overflow-auto'>
          <div className='flex justify-between items-center  mb-4'>
            <h3 className='font-medium'>{selectedElement.name} 편집</h3>
            <button className='border rounded-xl' onClick={() => setSelectedElement(null)}>
              <IoCloseOutline className='w-4 h-4' />
            </button>
          </div>

          <ElementEditor
            element={selectedElement}
            onUpdate={onElementUpdate}
            categories={categories}
          />
        </div>
      )}
    </div>
  );
}
