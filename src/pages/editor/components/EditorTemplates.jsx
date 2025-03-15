import SortList from '../../../components/SortList';
import styles from '../styles/EditorTemplates.module.css';

/**
 * 커스텀 헤더
 * @returns
 */
export function TemplateHeader({ properties }) {
  return (
    <div className={styles.header}>
      {/* 팔로우 버튼 */}
      <div className={styles.followButton}>
        <button>팔로우</button>
      </div>

      {/* 로고 */}
      <div className={styles.logo}>
        <img src={properties.logoUrl} alt='로고 이미지' />
      </div>

      {/* 네비게이션 */}
      <nav className={styles.navigation}>
        {
          <ul className={styles.ul}>
            {properties?.menuItems.map((menu) => {
              return <li key={menu}> {menu}</li>;
            })}
          </ul>
        }
      </nav>
    </div>
  );
}

/**
 * 커스텀 배너
 * @returns
 */
export function TemplateBanner({ properties }) {
  return (
    <div className={styles.banner} style={{ backgroundColor: properties.backgroundColor }}>
      <img
        className={styles.logoImage}
        src={properties.imageUrl}
        alt=''
        width={1024}
        height={300}
      />
    </div>
  );
}

/**
 * 커스텀 상품 섹션(상품 그리드)
 * @returns
 */
export function TemplateProductGrid({ properties }) {
  return (
    <div className={styles.productGrid}>
      <h2 className={styles.title}>{properties.title}</h2>

      {/* 정렬 리스트 */}
      <SortList sortList={properties.sortList} />
      <ul className={styles.productList}></ul>
    </div>
  );
}
