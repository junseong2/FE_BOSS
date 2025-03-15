import { TemplateBanner, TemplateHeader, TemplateProductGrid } from './EditorTemplates';

/**
 * 판매자가 수정한 쇼핑몰 미리보기
 * @param {element} element 템플릿 요소
 */
export default function EditorPreview({ element }) {
  switch (element.type) {
    case 'header':
      return <TemplateHeader properties={element.properties} />;
    case 'banner':
      return <TemplateBanner properties={element.properties} />;
    case 'productGrid':
      return <TemplateProductGrid properties={element.properties} />;
  }
}
