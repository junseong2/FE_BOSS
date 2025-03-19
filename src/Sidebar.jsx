import { Link } from 'react-router-dom';
import styles from './styles/Sidebar.module.css';

const Sidebar = ({ filteredCategories }) => {
  return (
    <div className={styles.sidebar}>
      <h3>카테고리</h3>
      <ul>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <li key={category.id}>
              <Link to={`/category/${category.id}`}>{category.name}</Link>
            </li>
          ))
        ) : (
          <p>카테고리가 없습니다.</p>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
