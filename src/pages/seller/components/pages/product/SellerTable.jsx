import { useState } from 'react';
import styles from '../../../styles/SellerContentTable.module.css';
import common from '../../../styles/common.module.css';
import SellerTableHeader from '../../common/SellerTableHeader';

function SellerTable({
  headers,
  products,
  actionButtonName,
  onToggle,
  onUpdate,
  onCheck,
  isToggle,
  toggleId,
}) {
  const [modifiedProducts, setModifiedProducts] = useState(products);

  // 사용자 입력값 처리 이벤트 핸들러
  const handleInputChange = (e, productId, field) => {
    const updatedProducts = modifiedProducts.map((product) => {
      if (product.productId === productId) {
        return { ...product, [field]: e.target.value };
      }
      return product;
    });
    setModifiedProducts(updatedProducts);
  };

  // 상품 정보 업데이트
  const handleUpdate = (productId) => {
    const updatedProduct = modifiedProducts.find((product) => product.productId === productId);
    if (updatedProduct) {
      onUpdate(updatedProduct); // 수정된 상품 정보를 부모에게 전달
    }
  };

  return (
    <div className={styles.sellerContentTableLayout}>
      {!Array.isArray(products) ? (
        <p>조회할 상품목록이 존재하지 않습니다.</p>
      ) : (
        <table className={styles.sellerContentTable}>
          <SellerTableHeader headers={headers} />

          <tbody>
            {products.map((product, index) => {
              if (index !== toggleId) {
                return (
                  <tr key={product.id}>
                    <td>
                      <input
                        type='checkbox'
                        name='productId'
                        onChange={onCheck}
                        defaultValue={product.productId}
                      />
                    </td>
                    <td>{product.productId}</td>
                    <td>{product.name}</td>
                    <td>{product.categoryName}</td>
                    <td>{product.description}</td>

                    <td>
                      {'￦ ' +
                        product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')}
                    </td>
                    <td>{product.stock}</td>
                    <td>
                      <button className={common.commonButtonNormal} onClick={() => onToggle(index)}>
                        {actionButtonName}
                      </button>
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={product.id}>
                  <td>
                    <input
                      type='checkbox'
                      name='productId'
                      onChange={onCheck}
                      defaultValue={product.productId}
                    />
                  </td>
                  <td>{product.productId}</td>
                  <td>
                    {isToggle ? (
                      <input
                        className={common.commonInput}
                        type='text'
                        defaultValue={product.name}
                        onChange={(e) => handleInputChange(e, product.productId, 'name')}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td>
                    {isToggle ? (
                      <input
                        className={common.commonInput}
                        type='text'
                        defaultValue={product.categoryName}
                        onChange={(e) => handleInputChange(e, product.productId, 'categoryName')}
                      />
                    ) : (
                      product.categoryName
                    )}
                  </td>
                  <td>
                    {isToggle ? (
                      <input
                        className={common.commonInput}
                        type='text'
                        defaultValue={product.description}
                        onChange={(e) => handleInputChange(e, product.productId, 'description')}
                      />
                    ) : (
                      product.description
                    )}
                  </td>

                  <td>
                    {isToggle ? (
                      <input
                        className={common.commonInput}
                        type='number'
                        defaultValue={product.price}
                        onChange={(e) => handleInputChange(e, product.productId, 'price')}
                      />
                    ) : (
                      '￦ ' +
                      product.price.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    )}
                  </td>
                  <td>
                    {isToggle ? (
                      <input
                        className={common.commonInput}
                        type='number'
                        defaultValue={product.stock}
                        onChange={(e) => handleInputChange(e, product.productId, 'stock')}
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td>
                    {/* 수정/등록 버튼 */}
                    <button
                      className={common.commonButtonNormal}
                      onClick={() => {
                        if (!isToggle) onToggle(index);
                        else handleUpdate(product.productId);
                      }}
                    >
                      {isToggle ? '등록' : actionButtonName}
                    </button>

                    {/* 취소 버튼 */}
                    {isToggle ? (
                      <button
                        style={{ marginTop: '5px' }}
                        className={common.commonButtonNormal}
                        onClick={() => {
                          onToggle(index);
                        }}
                      >
                        취소
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SellerTable;
