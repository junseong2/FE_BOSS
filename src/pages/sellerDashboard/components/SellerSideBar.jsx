import { NavLink } from 'react-router';
import {
  IoLogOutOutline,
  IoBarChartOutline,
  IoBriefcaseOutline,
  IoCartOutline,
  IoCarOutline,
  IoStorefrontOutline,
  IoPersonOutline,
  IoCardOutline,
  IoGridOutline,
} from 'react-icons/io5';
import styles from '../styles/SellerSideBar.module.css';

function SellerSideBar() {
  return (
    <div className={styles.sidebar}>
      <div>
        <h2 className={styles.sidebarTitle}>
          <IoStorefrontOutline /> <span>판매자 대시보드</span>
        </h2>
        <hr />

        {/* 네비게이션 */}
        <div className={styles.sidebarNavigation}>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/dashboard'}
          >
            <IoGridOutline /> 대시보드
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/product'}
          >
            <IoBriefcaseOutline /> 상품관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/order'}
          >
            <IoCartOutline /> 주문관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/inventory'}
          >
            <IoCarOutline /> 재고관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/sales'}
          >
            <IoBarChartOutline /> 매출 관리
          </NavLink>
          <NavLink
            className={({ isActive }) => (isActive ? styles.active : undefined)}
            to={'/seller/payment'}
          >
            <IoCardOutline /> 정산 관리
          </NavLink>
          <hr />
        </div>
      </div>
      {/* 판매자 프로필 */}
      <div className={styles.sidebarProfile}>
        <IoPersonOutline className={styles.sellerIcon} />
        <div className={styles.profileContents}>
          <p className={styles.sellerName}>홍길동 점주님</p>
          <span className={styles.placeName}>부산점</span>
        </div>
        <button className={styles.logoutButton} title='로그아웃'>
          <IoLogOutOutline />
        </button>
      </div>
    </div>
  );
}

export default SellerSideBar;
