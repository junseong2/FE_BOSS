import { TemplateBanner, TemplateHeader, TemplateProductGrid } from './EditorTemplates';

/**
 * 판매자가 수정한 쇼핑몰 미리보기
 * @param {element} element 템플릿 요소
 */
export default function EditorPreview({ element }) {
  console.log('선택된 요소와 타입', element, element.type);
  switch (element.type) {
    case 'header':
      console.log('헤더 선택됨:', element.type === 'header');
      return <TemplateHeader properties={element.properties} />;
    case 'banner':
      console.log('배너 선택됨', element.type === 'banner');
      return <TemplateBanner properties={element.properties} />;
    case 'productGrid':
      console.log('그리드 선택됨', element.type === 'productGrid');
      return <TemplateProductGrid properties={element.properties} />;
  }
}
