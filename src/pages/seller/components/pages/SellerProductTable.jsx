import { IoBuildOutline } from 'react-icons/io5';

export default function SellerProductTable({ products, onToggle, onSelect }) {
  function handleToggleClick(product) {
    onSelect(product); // 수정할 상품 정보 설정
    onToggle(); // 편칩창 오픈
  }

  return (
    <div className='mt-2 w-full overflow-x-auto'>
      <table className='w-full table-auto min-w-[768px] '>
        <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-center font-medium'>선택</th>
            <th className='py-3 px-4 text-center font-medium'>상품ID</th>
            <th className='py-3 px-4 text-center font-medium'>상품명</th>
            <th className='py-3 px-4 text-center font-medium'>분류</th>
            <th className='py-3 px-4 text-center font-medium'>설명</th>
            <th className='py-3 px-4 text-center font-medium'>가격</th>
            <th className='py-3 px-4 text-center font-medium'>재고</th>
            <th className='py-3 px-4 text-center font-medium'>작업</th>
          </tr>
        </thead>

        <tbody>
          {products.length > 0 ? (
            products.map((product) => {
              console.log(product)
              return (
                <tr
                  key={product.productId}
                  className='transition-colors duration-200 hover:bg-gray-50 '
                >
                  <td className='px-2 py-1 text-sm'>
                    <input
                      type='checkbox'
                      name='productId'
                      value={product.productId}
                      className='accent-blue-500'
                    />
                  </td>
                  <td className='px-2 py-1 text-sm text-center'>{product.productId}</td>
                  <td className='px-2 py-1 text-sm flex items-center gap-2'>
                    <img className='w-10 h-10 border  rounded-sm border-gray-200 p-1' src={product.gimages?.length>0 ? 'http://localhost:5000/uploads/'+product.gimages[0]: 'https://picsum.photos/50/50'} alt={product.name+" 상품 이미지"}/>
                    {product.name}
                    </td>
                  <td className='px-2 py-1 text-sm'>{product.categoryName}</td>
                  <td className='px-2 py-1 text-sm'>{product.description}</td>
                  <td className='px-2 py-1 text-sm'>
                    <span className='flex'>
                      ￦
                      <span>{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                    </span>
                  </td>
                  <td className='px-2 py-1 text-sm text-center'>{product.stock || 0}</td>
                  <td className='px-2 py-1 text-sm'>
                    <button
                      onClick={() => handleToggleClick(product)}
                      title='수정'
                      className='bg-[#1a2b3e] text-white p-1 px-2 rounded-sm hover:opacity-70 cursor-pointer'
                    >
                      <IoBuildOutline />
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <p className='text-gray-500 p-3 mt-3'>조회할 상품목록이 없습니다.</p>
          )}
        </tbody>
      </table>
    </div>
  );
}
