import { useState } from 'react';
import styles from '../../../styles/SellerContentTable.module.css';
import common from '../../../styles/common.module.css';
import { formatDate } from '../../../../../utils/formatter.js';
import TableHeader from '../../common/SellerTableHeader.jsx';

function SellerInventoryContentTable({
  headers,
  inventories,
  actionButtonName,
  onToggle,
  onUpdate,
  toggleId,
}) {
  const [modifiedInventories, setModifiedInventories] = useState(inventories);

  // 사용자 재고의 입력값 변경 감지
  const handleInputChange = (e, inventoryId, field) => {
    setModifiedInventories(
      inventories.map((inventory) =>
        inventory.inventoryId === inventoryId
          ? { ...inventory, [field]: Number(e.target.value) }
          : inventory,
      ),
    );
  };

  // 재고 변경 수정
  const handleUpdate = (inventoryId) => {
    const updatedInventory = modifiedInventories.find(
      (inventory) => inventory.inventoryId === inventoryId,
    );
    if (updatedInventory) {
      onUpdate(updatedInventory);
    }
  };

  return (
    <div className={styles.sellerContentTableLayout}>
      {!Array.isArray(inventories) || inventories.length === 0 ? (
        <p>조회할 상품목록이 존재하지 않습니다.</p>
      ) : (
        <table className={styles.sellerContentTable}>
          <TableHeader headers={headers} />
          <tbody>
            {inventories.map((inventory, index) => {
              const stockWarn =
                inventory.stock < inventory.minStock
                  ? '재고부족'
                  : inventory.stock === 0
                    ? '품절'
                    : '정상';
              const isEditing = index === toggleId;

              return (
                <tr key={inventory.inventoryId}>
                  <td>{inventory.inventoryId}</td>
                  <td>{inventory.productId}</td>
                  <td>{inventory.name}</td>
                  <td>
                    {isEditing ? (
                      <input
                        className={common.commonInput}
                        type='number'
                        defaultValue={inventory.stock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, 'stock')}
                      />
                    ) : (
                      inventory.stock
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        className={common.commonInput}
                        type='number'
                        defaultValue={inventory.minStock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, 'minStock')}
                      />
                    ) : (
                      inventory.minStock
                    )}
                  </td>
                  <td>{formatDate(inventory.updatedDate)}</td>
                  <td>{stockWarn}</td>
                  <td>
                    <button
                      className={common.commonButtonNormal}
                      onClick={() => {
                        if (!isEditing) onToggle(index);
                        else {
                          handleUpdate(inventory.inventoryId); //해당 하는 재고 업데이트
                          onToggle(null);
                        }
                      }}
                    >
                      {isEditing ? '등록' : actionButtonName}
                    </button>
                    {isEditing && (
                      <button
                        style={{ marginTop: '5px' }}
                        className={common.commonButtonNormal}
                        onClick={() => onToggle(null)}
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

export default SellerInventoryContentTable;
