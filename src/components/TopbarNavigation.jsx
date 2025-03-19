import { Link } from 'react-router-dom';

const TopbarNavigation = () => {
  return (
    <nav className='topbar'>
      <Link to='/'>홈</Link>
      <Link to='/about'>소개</Link>
    </nav>
  );
};

export default TopbarNavigation;
