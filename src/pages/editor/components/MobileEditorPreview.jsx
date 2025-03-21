import {  MobileTemplateHeader,MobileTemplateBanner, MobileTemplateProductGrid  ,MobileTemplateBottomNavigationBar} from './MobileEditorTemplates';

/**
 * 판매자가 수정한 쇼핑몰 미리보기
 * @param {element} element 템플릿 요소
 */
export default function MobileEditorPreview({ element }) {
  switch (element.type) {
    case 'header':
      return <MobileTemplateHeader properties={element.properties} />;
    case 'banner':
      return <MobileTemplateBanner properties={element.properties} />;
    case 'productGrid':
      return <MobileTemplateProductGrid properties={element.properties} />;
    case 'bottomNavigationbar':
      return <MobileTemplateBottomNavigationBar properties={element.properties} />;
      
  }
}
