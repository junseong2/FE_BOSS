import { useEffect, useState } from 'react';
import EditorHeader from './components/layout/EditorHeader';
import EditorSidebar from './components/layout/EditorSidebar';
import EditorTab from './components/tab/EditorTab';
import EditorTabContent from './components/tab/EditorTabContent';
import MobileEditorCanvas from './components/MobileEditorCanvas';

import ElementEditor from './components/input/ElementEditor';
import fetchUserInfo from '../../utils/api';
import axios from 'axios';
import { mobileelementTemplates, mobileinitialElements } from '../../data/shop-templates';
import { IoCloseOutline } from 'react-icons/io5';
import { getCategories } from '../../services/category.service';
import { BASE_URL } from '../../lib/api';

const sidebarTabList = ['요소', '설정'];
const canvasTabList = ['미리보기'];

export default function MobileShopEditorPage() {


  
  const [elements, setElements] = useState(mobileinitialElements); // ✅ 기본 요소 상태
  const [selectedElement, setSelectedElement] = useState(null);
  const [sidebarSelectedTabName, setSidebarSelectedTabName] = useState('요소');
  const [canvasSelectedTabName, setCanvasSelectedTabName] = useState('에디터');
  const [categories, setCategories] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [userId, setUserId] = useState('');
  const [sellerId, setSellerId] = useState(null);
  const handleElementMove = (updatedElements) => {
    setElements(updatedElements);  // 요소 순서 업데이트
  };

  console.log("MobileEditorCanvas로 전달될 elements 배열:", elements); // 전달된 elements 배열 출력

  // ✅ 1. userId 가져오기
  useEffect(() => {
    fetchUserInfo(setUserId, () => {}, () => {}, () => {}, () => {});
  }, []);
  // ✅ 2. userId 기반으로 sellerId 가져오기 (axios 사용)
  async function fetchSellerInfo(userId) {
    try {
      const response = await axios.get(BASE_URL+`/seller/seller-info-byuserid/${userId}`);
      console.log('✅ 서버에서 받아온 모바일 sellerInfo:', response.data);
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
    if (!sellerInfo.mobilesettings || sellerInfo.mobilesettings === 'N/A') {
      updatedSettings = mobileinitialElements; // 설정이 없으면 기본값 사용
      console.log('❌ setting 불러오기 실패: 기본값 사용');
    } else {
      console.log('✅ setting 불러오기 성공');
      try {
        updatedSettings =
          typeof sellerInfo.mobilesettings === 'string'
            ? JSON.parse(sellerInfo.mobilesettings) // settings가 문자열인 경우 파싱
            : sellerInfo.mobilesettings; // 이미 객체라면 그대로 사용
      } catch (error) {
        console.error('❌ settings 파싱 오류:', error);
        updatedSettings = mobileinitialElements; // 파싱 오류 시 기본값 사용
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
          ? { ...el, properties: { ...el.properties, ...updatedElement.properties } } // ✅ 해당 요소의 속성만 변경
          : el
      )
    );
  };

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
      
     


        
        const newElements = [...elements, newElement];
        setElements(newElements);
      };
      
  

  const handleRemoveElement = (id) => {
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleMoveElement = (dragIndex, hoverIndex) => {
    const newElements = [...elements];
    const draggedElement = newElements[dragIndex];
  
    newElements.splice(dragIndex, 1);
    newElements.splice(hoverIndex, 0, draggedElement);
  
    newElements.forEach((element, index) => {
      element.index = index;
    });
  
    setElements(newElements);
  };
  


  // ✅ 카테고리 조회
  async function fetchCategories() {
    const fetchedCategories = await getCategories();
    setCategories(fetchedCategories);
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSave = async () => {
    console.log("💾 저장 실행: 현재 elements 상태 by ShopEditorPage", elements);
  
    if (!sellerId) {
      alert('판매자 정보가 없습니다.');
      return;
    }
  
    try {
      const response = await axios.put(BASE_URL+`/seller/${sellerId}/updateMobileSettings`, 
        JSON.stringify(elements), // ✅ List<Map<String,Object>> 형식으로
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      alert(' 모바일 쇼핑몰 구성이 성공적으로 저장되었습니다!');
      console.log("서버 응답:", response.data);
    } catch (error) {
      console.error('xxxxxx저장 실패:', error);
      alert('xxxxxxxxxxxxxx 저장 중 오류가 발생했습니다. 콘솔 로그를 확인해주세요.');
    }
  };
  


  

  return (
 
    

    <div className='w-full h-full absolute left-0 top-0 flex'>
      <div className='w-full'>
        {/* 헤더 */}
        <EditorHeader
  elements={elements} // ✅ elements를 전달
  sellerId={sellerId}
          onSave={handleSave}
          onUpdate={handleUpdate} // ✅ `onUpdate` 추가 (오류 수정됨)
        />

        <div className='flex h-full'>
          {/* 사이드바 */}
          <EditorSidebar>
            <EditorTab
              tabList={sidebarTabList}
              targetTabName={sidebarSelectedTabName}
              onTabChange={setSidebarSelectedTabName}
            />




            <EditorTabContent
              targetTabName={sidebarSelectedTabName}
              onSelectElement={handleAddElement}
              elements={mobileelementTemplates}
            />




            
          </EditorSidebar>

          {/* 캔버스 */}
          <MobileEditorCanvas
            tab='editor'
            editorTab={
              <EditorTab
                tabList={canvasTabList}
                onTabChange={setCanvasSelectedTabName}
                targetTabName={canvasSelectedTabName}
              />
            }
            elements={elements}
            selectedElement={selectedElement}
            setElements={setElements}  // setElements를 전달
            setSelectedElement={setSelectedElement}
            onElementUpdate={handleUpdate}
            onElementRemove={handleRemoveElement}
            onElementMove={handleMoveElement}
          />
        </div>
      </div>

      {/* 세부 편집기 */}
      {selectedElement && (
        <div className='w-80 border-l border-[#E4E4E7] p-4 overflow-auto'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='font-medium'>
              {selectedElement?.name || '요소 없음'} 편집
            </h3>
            <button className='border rounded-xl' onClick={() => setSelectedElement(null)}>
              <IoCloseOutline className='w-4 h-4' />
            </button>
          </div>

          {selectedElement && (
            <ElementEditor
              element={selectedElement}
              onUpdate={handleUpdate} // ✅ 최신 데이터 전달
              sellerId={sellerId}
              categories={categories}
              elements={elements}
              setElements={setElements}
            />
          )}
        </div>
      )}
    </div>
  );
}
