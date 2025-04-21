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
import { BASE_URL } from './lib/api';

function MenuBar5() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isIconClicked, setIsIconClicked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(BASE_URL + '/category/root');
        console.log('Fetched Categories:', response.data);
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchCategories();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
    setIsIconClicked((prev) => !prev);
  };

  const handleMouseEnter = async (categoryId) => {
    try {
      const response = await axios.get(
        BASE_URL + `/category/${categoryId}/subcategories`,
      );
      setOpenSubMenu({ id: categoryId, subcategories: response.data });
    } catch (error) {
      console.error('서브카테고리를 불러오는 중 오류 발생:', error);
    }
  };

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
   {/* 추가된 Intro와 Shop 버튼 */}
 
   
      <div className={`${styles.menuBar2} ${isMenuOpen ? styles.open : styles.closed}`}>
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

        <div className={styles.menuItem}>
          <Link to='/FaceSetDetail' className={styles.menuLink}>
            <IoPersonOutline /> 등록된 얼굴 목록
          </Link>
        </div>


        
      </div>
    </>
  );
}

export default MenuBar5;
