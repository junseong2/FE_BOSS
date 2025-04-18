import { useState } from "react"
import { formatDate } from "../../../../utils/formatter.js"

export function SellerInventoryTable({ inventories, actionButtonName, onToggle, onUpdate, toggleId }) {
  const [modifiedInventories, setModifiedInventories] = useState(inventories)

  // 변경된 재고 상태를 실시간으로 수정
  const handleInputChange = (e, inventoryId, field) => {
    setModifiedInventories(
      inventories.map((inventory) =>
        inventory.inventoryId === inventoryId ? { ...inventory, [field]: Number(e.target.value) } : inventory,
      ),
    )
  }

  // 앞서 수정된 재고 상태 항목을 인벤토리 ID와 일치하는 경우 실제로 반영처리
  const handleUpdate = (inventoryId) => {
    const updatedInventory = modifiedInventories.find((inventory) => inventory.inventoryId === inventoryId)
    if (updatedInventory) {
      onUpdate(updatedInventory)
    }
  }

  return (
    <div className="overflow-x-auto p-2">
      <table className="w-full min-w-[1024px] border-collapse">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-200">
            <th className="py-3 px-4 text-left font-medium">카테고리ID</th>
            <th className="py-3 px-4 text-left font-medium">상품ID</th>
            <th className="py-3 px-4 text-left font-medium">상품명</th>
            <th className="py-3 px-4 text-center font-medium">재고</th>
            <th className="py-3 px-4 text-left font-medium">최소 재고</th>
            <th className="py-3 px-4 text-left font-medium">최근 입고일</th>
            <th className="py-3 px-4 text-left font-medium">상태</th>
            <th className="py-3 px-4 text-center font-medium">작업</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(inventories) && inventories.length > 0 ? (
            inventories.map((inventory, index) => {
              const stockWarn =
                inventory.stock < inventory.minStock && inventory.stock > 0
                  ? "재고부족"
                  : inventory.stock === 0
                    ? "품절"
                    : "정상"
              const isEditing = index === toggleId

              return (
                <tr
                  key={inventory.inventoryId}
                  className="hover:bg-gray-50 transition duration-200 border-b border-gray-100"
                >
                  <td className="py-3 px-4 text-gray-700">{inventory.inventoryId}</td>
                  <td className="py-3 px-4 text-gray-700">{inventory.productId}</td>
                  <td className="py-3 px-4 text-gray-700 font-medium">{inventory.name}</td>
                  <td className="py-3 px-4 text-center">
                    {isEditing ? (
                      <input
                        className="border border-gray-300 rounded-md px-3 py-1.5 w-20 text-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        type="number"
                        defaultValue={inventory.stock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, "stock")}
                      />
                    ) : (
                      <span className="font-medium">{inventory.stock}</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {isEditing ? (
                      <input
                        className="border border-gray-300 rounded-md px-3 py-1.5 w-20 text-center focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        type="number"
                        defaultValue={inventory.minStock}
                        onChange={(e) => handleInputChange(e, inventory.inventoryId, "minStock")}
                      />
                    ) : (
                      inventory.minStock
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{formatDate(inventory.updatedDate)}</td>
                  <td className={`py-3 px-4`}>
                    <span className={`${getStatusClassName(stockWarn)} py-1.5 px-3 rounded-full text-xs font-medium`}>
                      {stockWarn}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col items-center gap-2">
                      <button
                        className="min-w-[80px] bg-gray-700 text-white rounded-md px-4 py-1.5 text-sm hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          if (!isEditing) onToggle(index)
                          else {
                            handleUpdate(inventory.inventoryId)
                            onToggle(null)
                          }
                        }}
                      >
                        {isEditing ? "등록" : actionButtonName}
                      </button>
                      {isEditing && (
                        <button
                          className="min-w-[80px] bg-white border border-gray-300 rounded-md px-4 py-1.5 text-sm hover:bg-gray-50 transition-colors"
                          onClick={() => onToggle(null)}
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-8 text-gray-500">
                조회할 재고 목록이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

/** 재고 상태별 색상처리 */
const getStatusClassName = (status) => {
  switch (status) {
    case "정상":
      return "bg-green-100 text-green-800"
    case "재고부족":
      return "bg-purple-100 text-purple-800"
    case "품절":
      return "bg-red-100 text-red-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}
