import styles from '../../styles/EditorTabContent.module.css';
import { IoGridOutline, IoImageOutline, IoBagHandleOutline } from 'react-icons/io5';

export default function EditorTabContent({ targetTabName, onSelectElement, elements }) {
  return (
    <div className={`${styles.editorTabContent}`}>
      {targetTabName === '요소' ? (
        <EditorElementGrid onSelectElement={onSelectElement} elements={elements} />
      ) : null}
    </div>
  );
}

// 커스텀할 레이아웃 요소 그리드
function EditorElementGrid({ onSelectElement, elements }) {
  const items = [
    { icon: <IoGridOutline />, label: '헤더', type: 'header' },
    { icon: <IoImageOutline />, label: '배너', type: 'banner' },
    { icon: <IoBagHandleOutline />, label: '상품 그리드', type: 'productGrid' },
    // { icon: <IoFilter />, label: '카테고리 목록' },
  ];

  return (
    <div className={styles.elementGrid}>
      <p>요소를 클릭하여 쇼핑몰을 꾸며보세요!</p>
      {items.map(({ icon, label, type }, index) => {
        return (
          <div key={index} className={styles.elementGridItem}>
            <button
              onClick={() => onSelectElement(elements[type].type === type ? elements[type] : null)}
            >
              {icon}
              <span className={`${styles.label}`}>{label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// 사이트 설정
function EditorSettings({ onChange }) {}
