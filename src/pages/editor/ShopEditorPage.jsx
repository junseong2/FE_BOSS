import { useEffect, useState } from 'react';
import EditorHeader from './components/layout/EditorHeader';
import EditorSidebar from './components/layout/EditorSidebar';
import EditorTab from './components/tab/EditorTab';
import EditorTabContent from './components/tab/EditorTabContent';
import EditorCanvas from './components/EditorCanvas';
import MobileEditorCanvas from './components/EditorCanvas';
import { createPortal } from 'react-dom';

import EditorTemplateGrid from './components/EditorTemplateGrid';
import ElementEditor from './components/input/ElementEditor';
import fetchUserInfo from '../../utils/api';
import axios from 'axios';
import { elementTemplates, initialElements } from '../../data/shop-templates';
import { IoCloseOutline } from 'react-icons/io5';
import { getCategories } from '../../services/category.service';
import { BASE_URL } from '../../lib/api';

const sidebarTabList = ['요소', '설정','탬플릿'];
const canvasTabList = ['미리보기'];

export default function ShopEditorPage() {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  const handleTemplateSelect = (template) => {
    try {
      console.log('@@@@@@선택된 템플릿:', template);
      setElements(template.elements);  // 여기가 실패할 수도 있음
      setIsTemplateModalOpen(false);
      setSidebarSelectedTabName('요소');
    } catch (err) {
      console.error('💥 템플릿 선택 처리 중 오류 발생:', err);
    }
  };
  
  const [elements, setElements] = useState(initialElements); // ✅ 기본 요소 상태
  const [selectedElement, setSelectedElement] = useState(null);
  const [sidebarSelectedTabName, setSidebarSelectedTabName] = useState('요소');
  const [canvasSelectedTabName, setCanvasSelectedTabName] = useState('에디터');
  const [categories, setCategories] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [userId, setUserId] = useState('');
  const [sellerId, setSellerId] = useState(null);
  const [settings, setSettings] = useState(initialElements);
  
  const handleElementMove = (updatedElements) => {
    setElements(updatedElements);  // 요소 순서 업데이트
  };

  console.log("EditorCanvas로 전달될 elements 배열:", elements); // 전달된 elements 배열 출력

  // ✅ 1. userId 가져오기
  useEffect(() => {
    fetchUserInfo(setUserId, () => {}, () => {}, () => {}, () => {});
  }, []);
  // ✅ 2. userId 기반으로 sellerId 가져오기 (axios 사용)
  async function fetchSellerInfo(userId) {
    try {
      const response = await axios.get(BASE_URL+`/seller/seller-info-byuserid/${userId}`);
      console.log('✅ 서버에서 받아온 sellerInfo:', response.data);
      setSellerInfo(response.data);
      setSellerId(response.data.sellerId);
    } catch (error) {
      console.error('❌ 판매자 정보 가져오기 실패:', error);
      setSellerInfo(null);
      setSellerId(null);
    }
  }

  useEffect(() => {
    console.log('✅ 현재 userId:', userId);
    if (userId) {
      fetchSellerInfo(userId);
    }
  }, [userId]);





  useEffect(() => {
    if (!sellerInfo) return; // sellerInfo가 없으면 리턴 (초기 상태에서 방어)
  
    let updatedSettings;
    if (!sellerInfo.settings || sellerInfo.settings === 'N/A') {
      updatedSettings = initialElements; // 설정이 없으면 기본값 사용
      console.log('❌ setting 불러오기 실패: 기본값 사용');
    } else {
      console.log('✅ setting 불러오기 성공');
      try {
        updatedSettings =
          typeof sellerInfo.settings === 'string'
            ? JSON.parse(sellerInfo.settings) // settings가 문자열인 경우 파싱
            : sellerInfo.settings; // 이미 객체라면 그대로 사용
      } catch (error) {
        console.error('❌ settings 파싱 오류:', error);
        updatedSettings = initialElements; // 파싱 오류 시 기본값 사용
      }
    }
  
    console.log('✅ 적용된 settings(shopeditor):', updatedSettings);
  
    // 각 요소 업데이트 로직
    const newElements = updatedSettings.map((setting) => {
      const elIndex = elements.findIndex(el => el.type === setting.type); // 각 요소 타입에 해당하는 인덱스 찾기
      console.log('현재 요소:', setting);  // setting 전체를 출력해보세요.
  // id가 없으면 새로운 id를 생성
  if (!setting.id) {
    setting.id = `el-${new Date().getTime()}`;  // 유니크한 ID 생성
    console.log('새로운 id가 설정되었습니다:', setting.id);  // 설정된 id 확인
  }

     // console.log('현재 요소의 id:', setting.id);
     // console.log('현재 요소의 type:', setting.type);
  
      // 해당 요소가 있으면 업데이트, 없으면 새로운 요소 추가
      if (elIndex !== -1) {
        const updatedElement = {
          ...elements[elIndex],
          properties: {
            ...elements[elIndex].properties,  // 기존 properties 유지
            ...setting.properties,  // setting 안의 properties만 업데이트
          },
        };

            // 업데이트된 요소의 id와 type 출력
    console.log('업데이트된 요소의 id:', updatedElement.id);
   console.log('업데이트된 요소의 type:', updatedElement.type);
        return updatedElement;
      } else {

        console.log('새로운 요소의 id:', setting.id);
        console.log('새로운 요소의 type:', setting.type);
        return {
          properties: setting.properties || {},
        };
      }
    });
  
    setElements(newElements); // 새롭게 설정된 elements 배열로 업데이트
  
    console.log('현재 요소의 newelements~::', newElements);
  }, [sellerInfo]); // sellerInfo가 변경될 때마다 실행
  
  
  // ✅ 요소가 업데이트된 후 출력
  useEffect(() => {
    console.log("✅ elements : ", elements);
  }, [elements]);  // elements 상태가 변경될 때마다 실행
  



  // ✅ 요소 추가/수정/삭제 함수
  const handleUpdate = (updatedElement) => {
    console.log("🔄 `handleUpdate` 실행됨 (변경된 요소):", updatedElement);
    setSelectedElement((prevSelected) =>
      prevSelected?.id === updatedElement.id ? updatedElement : prevSelected
    );
  
    setElements((prevElements) =>
      prevElements.map((el) =>
        el.id === updatedElement.id
          ? { 
              ...el, 
              properties: { ...el.properties, ...updatedElement.properties },
              layout: { ...el.layout, ...updatedElement.layout } // layout도 병합
            }
          : el
      )
    );
  };
  
  

  const seenIds = new Set();
  const deduplicatedElements = [];

  const handleAddElement = (element) => {
    if (!element || typeof element !== 'object') {
      console.warn("추가할 element가 유효하지 않습니다.");
      return;
    }
  
    // 현재 요소 중 가장 아래 위치 계산
    let maxBottom = 0;
    elements.forEach((el) => {
      let height = el?.properties?.size?.web?.height || 100;
      if (typeof height === 'string') {
        height = parseInt(height.replace('px', ''), 10) || 100;
      }
      const top = el?.layout?.top || 0;
      maxBottom = Math.max(maxBottom, top + height);
    });
  
    // 새 ID 생성
    const uniqueId = `el-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  
    // 새로운 요소 생성
    const newElement = {
      ...element,
      id: uniqueId,
      layout: {
        ...element.layout,
        top: maxBottom + 20, // 하단에 20px 간격 추가
      },
    };
  
    // ✅ 여기서 newElements를 선언하고 사용
    const newElements = [...elements, newElement];
    setElements(newElements);
  };
  
  const handleRemoveElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

const handleMoveElement = (dragIndex, hoverIndex) => {
  const newElements = [...elements];
  const draggedElement = newElements[dragIndex];

  // 드래그된 요소를 배열에서 제거
  newElements.splice(dragIndex, 1);

  // 드래그된 요소를 새로운 위치에 삽입
  newElements.splice(hoverIndex, 0, draggedElement);

  // 새로운 배열에서 각 요소의 index 값을 업데이트
  newElements.forEach((element, index) => {
    element.index = index;  // 각 요소의 index를 새 위치로 업데이트
  });

  // 요소 순서 변경 후 상태 업데이트
  setElements(newElements);

  // 상태 업데이트 후 상위 컴포넌트로 새로운 배열 전달 (onElementMove)
  onElementMove(newElements);  // 상위 컴포넌트로 새로운 요소 배열 전달
};


  // ✅ 카테고리 조회
  async function fetchCategories() {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  // ✅ 저장 버튼 클릭 시
  const handleSave = async () => {
    console.log("💾 저장 실행: 현재 elements 상태 by ShopEditorPage", elements);
    console.log("🔍 elements 데이터 유형:", typeof elements);
    console.log("🔍 elements는 배열인가?", Array.isArray(elements));
  
    const syncedElements = elements.map(el =>
      el.id === selectedElement?.id ? selectedElement : el
    );
  
    // ⭐ settings 객체로 변환 (layout 정보도 포함)
    const updatedSettings = syncedElements.map(el => ({
      type: el.type,
      id: el.id,
      layout: el.layout, // 새 layout 형식 (예: top, column, columnSpan 등)
      properties: el.properties,
    }));
  
    console.log("📤 최종 저장될 settings:", updatedSettings);
  
    try {
      await updateSellerSettings(sellerId, updatedSettings);
      alert('🎉 쇼핑몰 구성이 성공적으로 저장되었습니다!');
    } catch (error) {
      console.error("❌ 저장 실패:", error);
      alert("❌ 저장 중 문제가 발생했습니다.");
    }
    
    alert('쇼핑몰 구성이 성공적으로 저장되었습니다!');
  };
  



  return (
    <div className="w-full h-full absolute left-0 top-0 flex">
      <div className="w-full">
        {/* 헤더 */}
        <EditorHeader
          elements={elements}
          sellerId={sellerId}
          onSave={handleSave}
          onUpdate={handleUpdate}
        />
  
        <div className="flex h-full">
          {/* 사이드바 */}
          <EditorSidebar>
            <EditorTab
              tabList={sidebarTabList}
              targetTabName={sidebarSelectedTabName}
              onTabChange={setSidebarSelectedTabName}
            />
  
            <EditorTabContent
              targetTabName={sidebarSelectedTabName}
              onSelectElement={(elementOrTemplate) => {
                if (sidebarSelectedTabName === '탬플릿') {
                  setIsTemplateModalOpen(true);
                } else {
                  handleAddElement(elementOrTemplate);
                }
              }}
              elements={elementTemplates}
            />
          </EditorSidebar>
  
          {/* 캔버스 */}
          <EditorCanvas
            tab="editor"
            editorTab={
              <EditorTab
                tabList={canvasTabList}
                onTabChange={setCanvasSelectedTabName}
                targetTabName={canvasSelectedTabName}
              />
            }
            elements={elements}
            sellerId={sellerId}
            selectedElement={selectedElement}
            setElements={setElements}
            setSelectedElement={setSelectedElement}
            onElementUpdate={handleUpdate}
            onElementRemove={handleRemoveElement}
            onElementMove={handleMoveElement}
          />
        </div>
      </div>
  
      {/* 세부 편집기 */}
      {selectedElement && (
      <div className="w-80 border-l z-50 border-[#E4E4E7] p-4 overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">{selectedElement?.name || '요소 없음'} 편집</h3>
          <button className="border rounded-xl" onClick={() => setSelectedElement(null)}>
            <IoCloseOutline className="w-4 h-4" />
          </button>
        </div>
  
          <ElementEditor
            element={selectedElement}
            onUpdate={handleUpdate}
            sellerId={sellerId}
            categories={categories}
            elements={elements}
            setElements={setElements}
            onSizeChange={(updatedElement) => {
              setElements((prev) =>
                prev.map((el) => (el.id === updatedElement.id ? updatedElement : el))
              );
              setSelectedElement(updatedElement);
            }}
          />
        </div>
      )}
  
      {/* ✅ 템플릿 모달 (항상 별도 포탈로 분리) */}
      {isTemplateModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto p-6 relative">
              <button
                onClick={() => setIsTemplateModalOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <IoCloseOutline size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4"> 템플릿 선택</h2>
              <EditorTemplateGrid
                onSelectTemplate={(template) => {
                  setElements(template.elements);
                  setIsTemplateModalOpen(false);
                  setSidebarSelectedTabName('요소');
                }}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
  
}





