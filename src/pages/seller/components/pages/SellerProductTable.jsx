import { useState, useEffect } from 'react';
import SellerEditButton from '../common/SellerEditButton';

export default function SellerProductTable({
  products,
  actionButtonName,
  onToggle,
  onUpdate,
  onCheck,
  toggleId,
}) {
  const [modifiedProducts, setModifiedProducts] = useState(products);

  useEffect(() => {
    // 페이지 로드시 toggleId 초기화
    if (toggleId === undefined) {
      onToggle(-1);
    }
  }, [toggleId, onToggle]);

  // 사용자 입력값 처리 이벤트 핸들러
  const handleInputChange = (e, targetProductId, field) => {
    const updatedProducts = products.map((product) =>
      product.productId === targetProductId ? { ...product, [field]: e.target.value } : product,
    );
    setModifiedProducts(updatedProducts);
  };

  // 상품 정보 업데이트
  const handleUpdate = (productId) => {
    const updatedProduct = modifiedProducts.find((product) => product.productId === productId);
    if (updatedProduct) {
      onUpdate(updatedProduct); // 수정된 상품 정보를 부모에게 전달
      onToggle(-1); // 등록 후 토글 상태 초기화
    }
  };

  return (
    <div className='mt-2 w-full overflow-x-auto'>
      {!Array.isArray(products) ? (
        <p>조회할 상품목록이 존재하지 않습니다.</p>
      ) : (
        <table className='w-full table-auto '>
                 <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-left font-medium'>선택</th>
            <th className='py-3 px-4 text-left font-medium'>상품ID</th>
            <th className='py-3 px-4 text-left font-medium'>상품명</th>
            <th className='py-3 px-4 text-center font-medium'>분류</th>
            <th className='py-3 px-4 text-left font-medium'>설명</th>
            <th className='py-3 px-4 text-left font-medium'>가격</th>
            <th className='py-3 px-4 text-left font-medium'>재고</th>
            <th className='py-3 px-4 text-center font-medium'>작업</th>
          </tr>
        </thead>

          <tbody>
            {products.map((product, index) => {
              const isEditableRow = index === toggleId;

              return (
                <tr
                  key={product.productId}
                  className='transition-colors duration-200 hover:bg-gray-100 '
                >
                  <td className='px-2 py-1 text-sm'>
                    <input
                      type='checkbox'
                      name='productId'
                      onChange={onCheck}
                      value={product.productId}
                      className='accent-blue-500'
                    />
                  </td>
                  <td className='px-2 py-1 text-sm'>{product.productId}</td>
                  <td className='px-2 py-1 text-sm'>
                    {isEditableRow ? (
                      <input
                        className='text-gray-800 border border-gray-400 rounded-md w-full px-3 py-2 text-sm'
                        type='text'
                        defaultValue={product.name} // 수정된 부분
                        onChange={(e) => handleInputChange(e, product.productId, 'name')}
                      />
                    ) : (
                      product.name
                    )}
                  </td>
                  <td className='px-2 py-1 text-sm'>
                    {isEditableRow ? (
                      <input
                        className='text-gray-800 border border-gray-400 rounded-md w-full px-3 py-2 text-sm'
                        type='text'
                        defaultValue={product.categoryName} // 수정된 부분
                        onChange={(e) => handleInputChange(e, product.productId, 'categoryName')}
                      />
                    ) : (
                      product.categoryName
                    )}
                  </td>
                  <td className='px-2 py-1 text-sm'>
                    {isEditableRow ? (
                      <input
                        className='text-gray-800 border border-gray-400 rounded-md w-full px-3 py-2 text-sm'
                        type='text'
                        defaultValue={product.description} // 수정된 부분
                        onChange={(e) => handleInputChange(e, product.productId, 'description')}
                      />
                    ) : (
                      product.description
                    )}
                  </td>
                  <td className='px-2 py-1 text-sm'>
                    {isEditableRow ? (
                      <input
                        className='text-gray-800 border border-gray-400 rounded-md w-full px-3 py-2 text-sm'
                        type='number'
                        defaultValue={product.price} // 수정된 부분
                        onChange={(e) => handleInputChange(e, product.productId, 'price')}
                      />
                    ) : (
                      `￦ ${product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
                    )}
                  </td>
                  <td className='px-2 py-1 text-sm'>
                    {isEditableRow ? (
                      <input
                        className='text-gray-800 border border-gray-400 rounded-md w-full px-3 py-2 text-sm'
                        type='number'
                        defaultValue={product.stock} // 수정된 부분
                        onChange={(e) => handleInputChange(e, product.productId, 'stock')}
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className='px-2 py-1 text-sm'>
                    {/* 편집(등록) 버튼 */}
                    <SellerEditButton
                      isEditable={isEditableRow}
                      index={index}
                      onToggle={onToggle}
                      onUpdate={handleUpdate}
                      productId={product.productId}
                      actionButtonName={actionButtonName}
                    />
                    {/* 편집 취소 버튼 */}
                    {isEditableRow && (
                      <button
                        className='flex items-center gap-2 justify-center bg-white text-black font-normal py-1 px-4 rounded-md mt-2 border border-gray-300 w-full text-sm hover:bg-gray-200 transition-colors'
                        onClick={() => onToggle(-1)} // 취소 버튼 클릭 시 수정 모드 해제
                      >
                        취소
                      </button>
                    )}
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
