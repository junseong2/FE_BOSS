import { Edit, Trash2, Eye } from "lucide-react"

function SellerProductTable({ headers, products, onCheck, onToggle, onSelect, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(price)
  }

  const truncateText = (text, maxLength = 50) => {
    if (!text) return ""
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            {headers.map((header, index) => (
              <th key={index} scope="col" className="px-4 py-3">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr className="bg-white border-b hover:bg-gray-50">
              <td colSpan={headers.length} className="px-4 py-16 text-center text-gray-500">
                등록된 상품이 없습니다.
              </td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    value={product.id}
                    onChange={onCheck}
                    className="w-4 h-4 text-gray-600 bg-gray-100 border-gray-300 rounded focus:ring-gray-500"
                  />
                </td>
                <td className="px-4 py-3 font-medium">{product.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  <div className="flex items-center">
                    {product.gImage && product.gImage[0] && (
                      <img
                        src={product.gImage[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 mr-3 rounded-md object-cover border border-gray-200"
                      />
                    )}
                    <span className="line-clamp-1">{product.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">
                    {product.categoryName}
                  </span>
                </td>
                <td className="px-4 py-3">{truncateText(product.description, 30)}</td>
                <td className="px-4 py-3 font-medium">
                  <div className="flex flex-col">
                    <span className="text-gray-900">{formatPrice(product.price)}</span>
                    {product.originPrice > product.price && (
                      <span className="text-xs text-gray-500 line-through">{formatPrice(product.originPrice)}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                  <td className='px-2 py-1 text-sm text-center'>{product.stock || 0}</td>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onSelect(product)
                        onToggle()
                      }}
                      className="p-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      title="수정"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`${product.name} 상품을 삭제하시겠습니까?`)) {
                          onDelete([product.id])
                        }
                      }}
                      className="p-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <a
                      href={`/product/${product.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      title="상품 보기"
                    >
                      <Eye className="w-4 h-4" />
                    </a>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default SellerProductTable
