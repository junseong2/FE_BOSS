import {  MobileTemplateHeader,MobileTemplateBanner, MobileTemplategrid  ,MobileTemplateBottomNavigationBar} from './MobileEditorTemplates';
import React, { useEffect, useState } from 'react'; // useState, useEffect 추가

/**
 * 판매자가 수정한 쇼핑몰 미리보기
 * @param {element} element 템플릿 요소
 */
export default function MobileEditorPreview({ element }) {
  const [previewElement, setPreviewElement] = useState(element);

  useEffect(() => {
    console.log("🚀 element 업데이트 (MobileEditorPreview)in editorpreview.js:", element);  // element 값을 콘솔에 출력
    setPreviewElement(element); // element 변경 시 미리보기 업데이트
  }, [element]);

  console.log("🚀 previewElement 상태 in MobileEditorPreview.js:", previewElement);  // previewElement 상태를 콘솔에 출력

  // `index` 값을 포함한 `elementWithIndex`로 switch 문 처리
  const elementWithIndex = {
    ...previewElement,
    index: previewElement.index || 0,  // index 값이 없으면 기본값 0
  };

  // `elementWithIndex`를 사용하여 렌더링 처리
  switch (elementWithIndex.type) {
    case 'mobileheader': 
    
    console.log("🚀 MobileHeader의 경우~~previewElement 상태 in MobileEditorPreview.js:", previewElement);  
      return (
        <MobileTemplateHeader
          key={previewElement.id} // 🔥 변경될 때마다 리렌더링 강제
          properties={elementWithIndex.properties}
        />
      );
    case 'mobilebanner':
      return <MobileTemplateBanner properties={elementWithIndex.properties} />;
    case 'mobilegrid':
      console.log("🚀 grid properties:", elementWithIndex.properties); // 값 출력
      console.log("🚀 grid element:", elementWithIndex); // 값 출력
      return <MobileTemplategrid properties={elementWithIndex.properties} />;


      case 'mobileBottomNavigationBar':
        console.log("🚀 grid properties:", elementWithIndex.properties); // 값 출력
        console.log("🚀 grid element:", elementWithIndex); // 값 출력
        return <MobileTemplateBottomNavigationBar properties={elementWithIndex.properties} />;

    default:
      return <p className="text-gray-400">지원되지 않는 요소 타입: {elementWithIndex.type}</p>;
  }
}
