import styles from './styles/SellerProductPage.module.css';

import { useEffect, useState } from 'react';
import useToggle from '../../hooks/useToggle';
import SellerActionButton from './components/SellerActionButton';
import SellerContentHeader from './components/SellerContentHeader';
import SellerProductContentTable from './components/pages/product/SellerProductContentTable';
import SellerSearch from './components/SellerSearch';
import SellerTitle from './components/SellerTitle';
import SellerToolBar from './components/layout/SellerToolBar';
import SellerProductRegisterForm from './components/pages/product/SellerProductRegisterForm';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import {
  createSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getSearchSellerProducts,
  updateSellerProduct,
} from '../../services/seller/product.service';

const headers = ['선택', '상품ID', '상품명', '카테고리', '설명', '가격', '재고', '작업'];
const PAGE_SIZE = 15;
function SellerProductPage() {
  const { onToggle, isOpen, toggleId } = useToggle();
  const { onToggle: onToggleNewProductForm, isOpen: isOpenNewProductForm } = useToggle();
  const [productIds, setProductIds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([
    { productId: 1, name: '삼각김밥', price: 1200, categoryName: '도시락/즉석식', stock: 60 },
  ]);

  // 상품 선택
  async function onCheck(e) {
    const isChecked = e.currentTarget.checked;
    const id = e.currentTarget.value;

    if (isChecked) {
      setProductIds((prev) => [...prev, id]);
    } else {
      const updatedIds = productIds.filter((prevId) => {
        return prevId != id;
      });
      setProductIds(updatedIds);
    }
  }

  // 상품 삭제
  async function onDeleteProduct() {
    if (productIds.length < 1) {
      alert('선택된 상품 목록이 없습니다.');
      return;
    }

    const isDelete = confirm('정말로 삭제 하시겠습니까?(삭제 후 복원 불가능)');
    if (!isDelete) {
      alert('삭제 요청을 취소하였습니다.');
      return;
    }

    const idsInfo = {
      ids: productIds,
    };
    const data = deleteSellerProduct(idsInfo);
  }

  // 상품 조회
  async function getProductsFetch() {
    const data = await getAllSellerProducts(page, PAGE_SIZE);
    setProducts(data);
  }

  // 상품 검색
  async function onSearch(e) {
    const search = e.currentTarget.value;
    console.log('검색어:', search);
    const data = await getSearchSellerProducts(page, PAGE_SIZE, search);
    setProducts(data);
  }

  // 상품 추가
  async function onCreateProductSubmit(e) {
    const { product } = await mappingSubmitData(e);

    const data = await createSellerProduct([product]);

    console.log('상품추가:', data);
  }

  // 상품 수정
  async function onUpdateProduct(product) {
    const updatedProducts = products.map((oldProduct) => {
      if (oldProduct.productId === product.productId) {
        return product;
      }
      return oldProduct;
    });
    setProducts(updatedProducts);

    const data = await updateSellerProduct(product.productId, product);
    if (data.status === 'OK') {
      alert(data.data.productName + '의 정보가 수정되었습니다.');
    }
  }

  // 상품 추가/수정 시 데이터 맵핑
  async function mappingSubmitData(e) {
    const formData = new FormData(e.currentTarget);
    const productId = Number(formData.get('productId')) || 0;
    const name = formData.get('name')?.toString().trim() || '';
    const price = Number(formData.get('price')) || 0;
    const category = formData.get('category')?.toString().trim() || '';
    const description = formData.get('description')?.toString().trim() || '';
    const stock = Number(formData.get('stock')) || 0;

    const errors = [];

    if (!name) errors.push('상품명을 입력하세요.');
    if (!category) errors.push('카테고리를 선택하세요.');
    if (!description) errors.push('상품 설명을 입력하세요.');
    if (isNaN(price) || price <= 0) errors.push('가격은 0보다 커야 합니다.');
    if (isNaN(stock) || stock < 0) errors.push('재고는 0 이상이어야 합니다.');

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }
    const product = {
      name,
      price,
      categoryName: category,
      description,
      stock,
    };

    return { productId, product };
  }

  useEffect(() => {
    setLoading(true);
    getProductsFetch();
    setLoading(false);
  }, []);

  return (
    <>
      <section>
        {/* 헤더 */}
        <SellerContentHeader>
          <SellerTitle type={'main'}>상품관리</SellerTitle>
          <p>상품 목록 및 관리</p>
          <SellerToolBar>
            <SellerSearch placeholder={'상품명을 입력하세요.'} />
            <div className={styles.buttonLayout}>
              <SellerActionButton onClick={onDeleteProduct}>
                <IoRemoveCircleOutline />
                선택 삭제
              </SellerActionButton>
              <SellerActionButton onClick={onToggleNewProductForm}>
                <IoAddCircleOutline />새 상품
              </SellerActionButton>
            </div>
          </SellerToolBar>
        </SellerContentHeader>

        {/* 테이블 */}
        <SellerProductContentTable
          headers={headers}
          products={products}
          actionButtonName={'수정'}
          onCheck={onCheck}
          onToggle={onToggle}
          isToggle={isOpen}
          toggleId={toggleId}
          onUpdate={onUpdateProduct}
          onDelete={onDeleteProduct}
        />
      </section>
      {isOpenNewProductForm ? (
        <SellerProductRegisterForm
          onToggle={onToggleNewProductForm}
          onSubmit={onCreateProductSubmit}
        />
      ) : null}
    </>
  );
}

export default SellerProductPage;
