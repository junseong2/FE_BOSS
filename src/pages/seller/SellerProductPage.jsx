import { useEffect, useState } from 'react';
import useToggle from '../../hooks/useToggle';

import { IoAddCircleOutline, IoRemoveCircleOutline } from 'react-icons/io5';
import {
  createSellerProduct,
  deleteSellerProduct,
  getAllSellerProducts,
  getSearchSellerProducts,
  updateSellerProduct,
} from '../../services/product.service';
import SellerContentHeader from './components/common/SellerContentHeader';
import SellerTitle from './components/common/SellerTitle';
import SellerToolBar from './components/layout/SellerToolBar';
import SellerSearch from './components/common/SellerSearch';
import SellerActionButton from './components/common/SellerActionButton';
import SellerProductTable from './components/pages/SellerProductTable';
import SellerRegisterForm from './components/pages/SellerRegisterForm';

const headers = ['선택', '상품ID', '상품명', '카테고리', '설명', '가격', '재고', '작업'];
const PAGE_SIZE = 10;
function SellerProductPage() {
  const { onToggle, isOpen, toggleId } = useToggle();
  const { onToggle: onToggleNewProductForm, isOpen: isOpenNewProductForm } = useToggle();
  const [productIds, setProductIds] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]);

  // 상품 선택
  async function onCheck(e) {
    const isChecked = e.currentTarget.checked;
    const id = Number(e.currentTarget.value);

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
    console.log(data);
  }

  // 상품 조회
  async function getProductsFetch() {
    const data = await getAllSellerProducts(page, PAGE_SIZE);
    setProducts(data);
  }

  // 상품 검색
  async function onSearch(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const search = formData.get('search');
    const data = await getSearchSellerProducts(page, PAGE_SIZE, search);
    setProducts(data);
  }

  // 상품 추가
  async function onCreateProductSubmit(e, images) {
    const { requestData } = await mappingSubmitData(e, images);
    createSellerProduct(requestData);
  }

  // 상품 수정cdc
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
  async function mappingSubmitData(e, images) {
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

    // FormData를 보내기
    const requestData = new FormData();
    requestData.append('product', JSON.stringify(product));

    // 다중 이미지 파일 추가
    for (let i = 0; i < images.length; i++) {
      requestData.append('images', images[i]);
    }

    return { productId, requestData };
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
            <SellerSearch placeholder={'상품명을 입력하세요.'} onSearch={onSearch} />
            <div className={`w-full flex justify-end mt-8 gap-2.5`}>
              {/* 상품 선택 삭제 버튼 */}
              <SellerActionButton onClick={onDeleteProduct}>
                <IoRemoveCircleOutline />
                선택 삭제
              </SellerActionButton>

              {/* 새상품 추가 버튼 */}
              <SellerActionButton onClick={onToggleNewProductForm}>
                <IoAddCircleOutline />새 상품
              </SellerActionButton>
            </div>
          </SellerToolBar>
        </SellerContentHeader>

        {/* 테이블 */}
        <SellerProductTable
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
        <SellerRegisterForm onToggle={onToggleNewProductForm} onSubmit={onCreateProductSubmit} />
      ) : null}
    </>
  );
}

export default SellerProductPage;
