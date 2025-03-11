import common from '../styles/common.module.css';

function SellerActionButton({ children, onClick }) {
  return (
    <button onClick={onClick} className={common.commonButton}>
      {children}
    </button>
  );
}

export default SellerActionButton;
