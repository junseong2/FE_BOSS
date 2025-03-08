import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import {
  IoHomeOutline,
  IoInformationOutline,
  IoHelpCircleOutline,
  IoGiftOutline,
  IoPersonOutline,
  IoLocationOutline,
} from 'react-icons/io5'; // 필요한 아이콘 추가
import axios from 'axios';
import styles from './styles/MenuBar.module.css'; // CSS 모듈 경로

function MenuBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  // 카테고리 데이터 가져오기
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/category/root');
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      }
    };
    fetchCategories();
  }, []);

  // 메뉴 토글
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsIconClicked((prev) => !prev);
  };

  // 서브카테고리 표시
  const handleMouseEnter = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/category/${categoryId}/subcategories`,
      );
      setOpenSubMenu({ id: categoryId, subcategories: response.data });
    } catch (error) {
      console.error('서브카테고리 데이터를 불러오는 중 오류 발생:', error);
    }
  };

  // 경로가 바뀔 때 메뉴 닫기
  useEffect(() => {
    setIsMenuOpen(false);
    setIsIconClicked(false);
  }, [location.pathname]);

  return (
    <>
      <div className={styles.menuIcon} onClick={toggleMenu}>
        {isIconClicked ? (
          <FaTimes className={styles.iconChange} />
        ) : (
          <FaBars className={styles.iconChange} />
        )}
      </div>

      <div className={`${styles.menuBar} ${isMenuOpen ? styles.open : styles.closed}`}>
        {/* 기본 메뉴 항목 */}
        <div className={styles.menuItem}>
          <Link to='/' className={styles.menuLink}>
            <IoHomeOutline /> 홈
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to='/about' className={styles.menuLink}>
            <IoInformationOutline /> 소개
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to='/contact' className={styles.menuLink}>
            <IoHelpCircleOutline /> FAQ
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to='/event' className={styles.menuLink}>
            <IoGiftOutline /> 이벤트상품
          </Link>
        </div>
        <div className={styles.menuItem}>
          <Link to='/kakaomap' className={styles.menuLink}>
            <IoLocationOutline /> 카카오맵
          </Link>
        </div>

        {/* 카테고리 및 서브카테고리 */}
        {categories.map((category) => (
          <div
            key={category.id}
            className={styles.menuItem}
            onMouseEnter={() => handleMouseEnter(category.id)}
          >
            <Link to={`/category/${category.id}`} className={styles.menuLink}>
              {category.name}
            </Link>

            {openSubMenu?.id === category.id && (
              <div className={styles.submenu}>
                {openSubMenu.subcategories.map((sub) => (
                  <Link key={sub.id} to={`/category/${sub.id}`} className={styles.submenuLink}>
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* 기타 메뉴 항목 */}
        <div className={styles.menuItem}>
          <Link to='/FaceSetDetail' className={styles.menuLink}>
            <IoPersonOutline /> 등록된 얼굴 목록
          </Link>
        </div>
      </div>
    </>
  );
}

export default MenuBar;
