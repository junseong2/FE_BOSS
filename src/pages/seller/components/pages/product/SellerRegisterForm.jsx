import { useState } from 'react';
import styles from '../../../styles/SellerProductRegisterForm.module.css';
import { IoCloseCircle } from 'react-icons/io5';

const mockData = [
  {
    productName: 'boss 초코파이',
    category: '과자/스낵',
    price: 1200,
    stock: 0,
    description: '맛있는 초콜릿으로 덮인 부드러운 파이',
  },
  {
    productName: 'boss 아메리카노',
    category: '커피',
    price: 3000,
    stock: 0,
    description: '진한 커피 맛이 특징인 아메리카노',
  },
  {
    productName: 'boss 에너지 드링크',
    category: '음료',
    price: 2500,
    stock: 0,
    description: '피로 회복과 에너지 충전을 위한 음료',
  },
];

const categories = [
  '식품',
  '음료',
  '생활용품',
  '미용/건강',
  '도시락/즉석식',
  '과자/스낵',
  '라면/면류',
  '탄산음료',
  '커피',
  '생수/이온음료',
  '우유/두유',
];

function SellerRegisterForm({ onSubmit, onToggle }) {
  const [selectedProduct, setSelectedProduct] = useState(mockData[0]); // 기본값 설정

  const handleProductChange = (event) => {
    const selectedName = event.target.value;
    const product = mockData.find((p) => p.productName === selectedName);
    setSelectedProduct(product);
  };

  const handleSubmit = (e) => {
    onSubmit(e);
    onToggle();
  };

  return (
    <div className={styles.sellerProductRegisterFormLayout}>
      <form onSubmit={handleSubmit} className={styles.sellerProductRegisterForm}>
        <h2>상품 추가</h2>
        <button onClick={onToggle} className={styles.closeButton} title='닫기 버튼'>
          <IoCloseCircle />
        </button>

        <div className={styles.inputGroup}>
          <label htmlFor='productSelect'>상품 선택</label>
          <select id='productSelect' onChange={handleProductChange}>
            {mockData.map((product) => (
              <option key={product.productName} value={product.productName}>
                {product.productName}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formBottomLayout}>
          <div className={styles.inputGroup}>
            <label htmlFor='name'>상품명</label>
            <input type='text' value={selectedProduct.productName} readOnly name='name' />
          </div>

          <div className={styles.flexLayout}>
            <div className={styles.inputGroup}>
              <label htmlFor='price'>가격</label>
              <input type='number' value={selectedProduct.price} readOnly name='price' />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor='stock'>재고</label>
              <input type='number' value={selectedProduct.stock} readOnly name='stock' />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor='category'>카테고리</label>
            <select value={selectedProduct.category} readOnly name='category'>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor='description'>상품설명</label>
            <textarea name='description' readOnly value={selectedProduct.description}></textarea>
          </div>
        </div>
        <button className={styles.submitButton} type='submit'>
          등록
        </button>
      </form>
    </div>
  );
}

export default SellerRegisterForm;
