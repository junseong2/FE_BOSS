import { useState } from 'react';
import { formatDate } from '../../../../utils/formatter.js';

export function SellerInventoryTable({
  inventories,
  actionButtonName,
  onToggle,
  onUpdate,
  toggleId,
}) {
  const [modifiedInventories, setModifiedInventories] = useState(inventories);

  // 변경된 재고 상태를 실시간으로 수정
  const handleInputChange = (e, inventoryId, field) => {
    setModifiedInventories(
      inventories.map((inventory) =>
        inventory.inventoryId === inventoryId
          ? { ...inventory, [field]: Number(e.target.value) }
          : inventory,
      ),
    );
  };

  // 앞서 수정된 재고 상태 항목을 인벤토리 ID와 일치하는 경우 실제로 반영처리
  const handleUpdate = (inventoryId) => {
    const updatedInventory = modifiedInventories.find(
      (inventory) => inventory.inventoryId === inventoryId,
    );
    if (updatedInventory) {
      onUpdate(updatedInventory);
    }
  };

  return (
    <div className='overflow-x-auto'>
      <table className='w-full min-w-[1024px] '>
        <thead>
          <tr className='bg-[#F3F4F6] text-gray-600 text-sm'>
            <th className='py-3 px-4 text-left font-medium'>카테고리ID</th>
            <th className='py-3 px-4 text-left font-medium'>상품ID</th>
            <th className='py-3 px-4 text-left font-medium'>상품명</th>
            <th className='py-3 px-4 text-center font-medium'>재고</th>
            <th className='py-3 px-4 text-left font-medium'>최소 재고</th>
            <th className='py-3 px-4 text-left font-medium'>최근 입고일</th>
            <th className='py-3 px-4 text-left font-medium'>상태</th>
            <th className='py-3 px-4 text-center font-medium'>작업</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(inventories) && inventories.length > 0 ? (
            inventories.map((inventory, index) => {
              const stockWarn =
                inventory.stock < inventory.minStock && inventory.stock > 0
                  ? '재고부족'
                  : inventory.stock === 0
                    ? '품절'
                    : '정상';
              const isEditing = index === toggleId;

              return (
                <tr
                  key={inventory.inventoryId}
                  className='hover:bg-gray-50 transition duration-200'
                >
                  <td className='p-2'>{inventory.inventoryId}</td>
                  <td className='p-2'>{inventory.productId}</td>
                  <td className='p-2'>{inventory.name}</td>
                  <td className='p-2'>
                    {isEditing ? (
                      <input
                        className='border border-gray-400 rounded px-2 py-1 w-full'
                        type='number'
                        defaultValue={inventory.stock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, 'stock')}
                      />
                    ) : (
                      inventory.stock
                    )}
                  </td>
                  <td className='p-2'>
                    {isEditing ? (
                      <input
                        className='border border-gray-400 rounded px-2 py-1 w-full'
                        type='number'
                        defaultValue={inventory.minStock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, 'minStock')}
                      />
                    ) : (
                      inventory.minStock
                    )}
                  </td>
                  <td className='p-2'>{formatDate(inventory.updatedDate)}</td>
                  <td className={`p-2`}>
                    <span
                      className={`${getStatusClassName(stockWarn)} py-1 px-2 rounded-3xl text-[12px]`}
                    >
                      {stockWarn}
                    </span>
                  </td>
                  <td className='p-2 flex flex-col'>
                    <button
                      className='min-w-[70px] bg-gray-700 text-white rounded px-3 py-1 text-sm hover:bg-gray-900'
                      onClick={() => {
                        if (!isEditing) onToggle(index);
                        else {
                          handleUpdate(inventory.inventoryId);
                          onToggle(null);
                        }
                      }}
                    >
                      {isEditing ? '등록' : actionButtonName}
                    </button>
                    {isEditing && (
                      <button
                        className='min-w-[70px mt-1.5 bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100'
                        onClick={() => onToggle(null)}
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <p className='mt-5 pb-5 text-gray-500'>조회할 재고 목록이 없습니다.</p>
          )}
        </tbody>
      </table>
    </div>
  );
}

/** 재고 상태별 색상처리 */
const getStatusClassName = (status) => {
  switch (status) {
    case '정상':
      return 'bg-green-100 text-green-800';
    case '재고부족':
      return 'bg-purple-100 text-purple-800';
    case '품절':
      return 'bg-red-100 text-red-800';
  }
};
