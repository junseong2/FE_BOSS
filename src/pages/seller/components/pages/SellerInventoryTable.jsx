import { useState } from 'react';
import { formatDate } from '../../../../utils/formatter.js';
import TableHeader from '../common/SellerTableHeader.jsx';

export function SellerInventoryTable({
  headers,
  inventories,
  actionButtonName,
  onToggle,
  onUpdate,
  toggleId,
}) {
  const [modifiedInventories, setModifiedInventories] = useState(inventories);

  const handleInputChange = (e, inventoryId, field) => {
    setModifiedInventories(
      inventories.map((inventory) =>
        inventory.inventoryId === inventoryId
          ? { ...inventory, [field]: Number(e.target.value) }
          : inventory,
      ),
    );
  };

  const handleUpdate = (inventoryId) => {
    const updatedInventory = modifiedInventories.find(
      (inventory) => inventory.inventoryId === inventoryId,
    );
    if (updatedInventory) {
      onUpdate(updatedInventory);
    }
  };

  return (
    <div className='mt-10 w-full'>
      <table className='w-full border-collapse'>
        <TableHeader headers={headers} />

        <tbody>
          {!Array.isArray(inventories) || inventories.length === 0 ? (
            <p className='mt-5'>조회할 재고 목록이 존재하지 않습니다.</p>
          ) : (
            inventories.map((inventory, index) => {
              const stockWarn =
                inventory.stock < inventory.minStock
                  ? '재고부족'
                  : inventory.stock === 0
                    ? '품절'
                    : '정상';
              const isEditing = index === toggleId;

              return (
                <tr
                  key={inventory.inventoryId}
                  className='hover:bg-gray-100 transition duration-200'
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
                  <td className='p-2'>{stockWarn}</td>
                  <td className='p-2'>
                    <button
                      className='bg-gray-700 text-white rounded px-3 py-1 text-sm hover:bg-gray-900'
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
                        className='ml-2 bg-white border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100'
                        onClick={() => onToggle(null)}
                      >
                        취소
                      </button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
