import { useEffect, useState } from "react"
import useToggle from "../../hooks/useToggle"
import { PlusCircle, MinusCircle, Download, Loader2, Package } from "lucide-react"

import {
  deleteSellerProduct,
  getAllSellerProducts,
  registerSellerProduct,
  updateSellerProduct,
} from "../../services/product.service"
import SellerSearch from "./components/common/SellerSearch"
import SellerActionButton from "./components/common/SellerActionButton"
import SellerProductTable from "./components/pages/SellerProductTable"
import SellerRegisterForm from "./components/form/SellerRegisterForm"
import Pagination from "../../components/Pagination"
import CrawledProductRegisterForm from "./components/pages/CrawledProductRegisterForm"
import { toastError } from "../../components/toast/CustomToast"
import SellerEditForm from "./components/form/SellerEditForm"

const headers = ["선택", "상품ID", "상품명", "카테고리", "설명", "가격", "재고", "작업"]
const PAGE_SIZE = 15

function SellerProductPage() {
  const { onToggle, isOpen, toggleId } = useToggle()

  const { onToggle: onToggleNewProductForm, isOpen: isOpenNewProductForm } = useToggle()
  const { onToggle: onToggleCrawledForm, isOpen: isOpenCrawledForm } = useToggle()

  const { onToggle: onToggleRegisterForm, isOpen: isOpenRegisterForm } = useToggle()
  const { onToggle: onToggleEditForm, isOpen: isOpenEditForm } = useToggle()

  const [selectedProduct, setSelectedProduct] = useState([])

  const [productIds, setProductIds] = useState([])
  const [loadingTrigger, setLoadingTrigger] = useState(false)
  const [page, setPage] = useState(0)
  const [productName, setProductName] = useState("")
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [totalCount, setTotalCount] = useState(1)

  // 상품 선택
  async function onCheck(e) {
    const isChecked = e.currentTarget.checked
    const id = Number(e.currentTarget.value)

    if (isChecked) {
      setProductIds((prev) => [...prev, id])
    } else {
      const updatedIds = productIds.filter((prevId) => {
        return prevId != id
      })
      setProductIds(updatedIds)
    }
  }

  // 상품 삭제
  async function onDeleteProduct() {
    if (productIds.length < 1) {
      alert("선택된 상품 목록이 없습니다.")
      return
    }

    const isDelete = confirm("정말로 삭제 하시겠습니까?(삭제 후 복원 불가능)")
    if (!isDelete) {
      alert("삭제 요청을 취소하였습니다.")
      return
    }

    const idsInfo = {
      ids: productIds,
    }
    try {
      await deleteSellerProduct(idsInfo)
    } finally {
      setLoadingTrigger((prev) => !prev)
    }
  }

  // 상품 조회
  async function getProductsFetch(page, productName) {
    setLoading(true)
    try {
      const data = await getAllSellerProducts(Math.max(0, page), PAGE_SIZE, productName)
      if (data) {
        console.log(data)
        setProducts(data.products ?? [])
        setTotalCount(data.totalCount ?? 1)
      }
    } finally {
      setLoading(false)
    }
  }

  // 상품 추가
  async function onCreateProductSubmit(e, images, category) {
    const { requestData } = await mappingSubmitData(e, images, category)

    try {
      await registerSellerProduct(requestData)
    } finally {
      setLoadingTrigger((prev) => !prev)
    }
  }

  // 상품 수정
  async function onUpdateProductSubmit(e, productId, images, category) {
    const { requestData } = await mappingSubmitData(e, images, category)
    try {
      const data = await updateSellerProduct(productId, requestData)
      if (data.status === "OK") {
        alert(data.data.productName + "의 정보가 수정되었습니다.")
      }
    } finally {
      setLoadingTrigger((prev) => !prev)
    }
  }

  // 상품 추가/수정 시 데이터 맵핑
  async function mappingSubmitData(e, images, category) {
    const formData = new FormData(e.currentTarget)
    const productId = Number(formData.get("productId")) || 0
    const name = formData.get("name")?.toString().trim() || ""
    const description = formData.get("description")?.toString().trim() || ""
    const price = Number(formData.get("price")) || 0
    const originPrice = Number(formData.get("originPrice")) || 0
    const discountRate = Number(formData.get("discountRate")) || 0
    const stock = Number(formData.get("stock")) || 0
    const minStock = Number(formData.get("minStock")) || 0
    let expiryDate = new Date(formData.get("expiryDate"))

    if (expiryDate instanceof Date) {
      expiryDate = expiryDate.toISOString().slice(0, 19)
    } else {
      toastError(expiryDate + "는 잘못된 날짜 형식입니다. YYYY-MM-DD 형식을 맞춰주세요.")
      return
    }

    const errors = []

    if (!name) errors.push("상품명을 입력하세요.")
    if (!category) errors.push("카테고리를 선택하세요.")
    if (!description) errors.push("상품 설명을 입력하세요.")
    if (isNaN(stock) || stock < 0) errors.push("재고는 0 이상이어야 합니다.")
    if (isNaN(minStock) || minStock < 0) errors.push("최소 재고는 0 이상이어야 합니다.")
    if (isNaN(price) || price < 0) errors.push("(할인된) 상품 가격은 0 이상이어야 합니다.")
    if (isNaN(originPrice) || originPrice < 0) errors.push("원본 상품 가격은 0 이상이어야 합니다.")

    if (errors.length > 0) {
      alert(errors.join("\n"))
      return
    }

    const product = {
      name,
      price,
      originPrice,
      discountRate,
      categoryName: category,
      description,
      minStock,
      expiryDate,
      stock,
    }

    // FormData를 보내기
    const requestData = new FormData()
    requestData.append("product", JSON.stringify(product))

    // 다중 이미지 파일 추가
    for (let i = 0; i < images.length; i++) {
      requestData.append("images", images[i])
    }

    return { productId, requestData }
  }

  useEffect(() => {
    getProductsFetch(page, productName)
  }, [page, productName, loadingTrigger])

  return (
    <>
      <section className="bg-gray-100 min-h-screen p-6">
        {/* 대시보드 헤더 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                <Package className="mr-2 text-gray-700" />
                상품관리
              </h1>
              <p className="text-gray-500 mt-1">상품을 추가, 수정, 삭제할 수 있습니다.</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">총 상품 수:</span>
              <span className="text-lg font-semibold text-gray-700">{totalCount}</span>
            </div>
          </div>
        </div>

        {/* 검색 및 액션 버튼 */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-1/2">
              <SellerSearch
                placeholder={"상품명을 입력하세요."}
                onSearch={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const search = formData.get("search") || ""
                  setProductName(search)
                }}
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-end">
              {/* 상품 선택 삭제 버튼 */}
              <SellerActionButton onClick={onDeleteProduct}>
                <MinusCircle className="w-4 h-4 mr-1.5" />
                선택 삭제
              </SellerActionButton>

              {/* 새상품 추가 버튼 */}
              <SellerActionButton onClick={onToggleRegisterForm}>
                <PlusCircle className="w-4 h-4 mr-1.5" />새 상품
              </SellerActionButton>

              {/* 상품 받아오기 모달 버튼 */}
              <SellerActionButton onClick={onToggleCrawledForm}>
                <Download className="w-4 h-4 mr-1.5" />
                상품 받아오기
              </SellerActionButton>
            </div>
          </div>
        </div>

        {/* 상품 테이블 */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="w-12 h-12 text-gray-500 animate-spin mb-4" />
              <p className="text-gray-500">상품 정보를 불러오는 중입니다...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <SellerProductTable
                headers={headers}
                products={products}
                onCheck={onCheck}
                onToggle={onToggleEditForm}
                onSelect={setSelectedProduct}
                onDelete={onDeleteProduct}
              />
            </div>
          )}

          {/* 페이지네이션 */}
          <div className="p-4 border-t border-gray-100">
            <Pagination
              handlePageClick={({ selected }) => {
                setPage(selected)
              }}
              totalPageCount={Math.ceil(totalCount / PAGE_SIZE)}
            />
          </div>
        </div>
      </section>

      {/* 모달 */}
      {isOpenNewProductForm && (
        <SellerRegisterForm onToggle={onToggleNewProductForm} onSubmit={onCreateProductSubmit} />
      )}

      {isOpenCrawledForm && <CrawledProductRegisterForm onClose={onToggleCrawledForm} categories={[]} />}

      {isOpenRegisterForm && <SellerRegisterForm onToggle={onToggleRegisterForm} onSubmit={onCreateProductSubmit} />}

      {isOpenEditForm && (
        <SellerEditForm
          onToggle={onToggleEditForm}
          onUpdateSubmit={onUpdateProductSubmit}
          oldProduct={selectedProduct}
        />
      )}
    </>
  )
}

export default SellerProductPage
