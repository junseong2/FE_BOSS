import { useEffect, useState } from "react";
import { X, ImageIcon, Calendar, Tag, Package2, DollarSign, FileText, AlertCircle, Plus } from "lucide-react";
import Label from "../../../../components/Label";
import Input from "../../../../components/Input";
import useToggle from "../../../../hooks/useToggle";
import SellerCategorySelector from "./SellerCategorySelector";
import SellerProductPriceSelector from "../pages/SellerProductPriceSelector";
import { getCategories } from "../../../../services/category.service";

function CrawledProductRegisterForm({ onClose }) {
  const BACKEND_URL = "http://localhost:5000";
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [originPrice, setOriginPrice] = useState("");
  const [discountRate, setDiscountRate] = useState(0);
  const [stock, setStock] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [expiryDate, setExpiryDate] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: 1, name: "기본카테고리" });
  const [isLoading, setIsLoading] = useState(false);

  const { onToggle: onToggleCategorySelector, isOpen: isOpenCategorySelector } = useToggle();
  const { onToggle: onTogglePriceSelector, isOpen: isOpenPriceSelector } = useToggle();

  const handleImageToggle = (index) => {
    setSelectedImages((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], checked: !updated[index].checked };
      return updated;
    });
  };

  const handleSaveCategory = (selected) => {
    setCategory(selected);
    onToggleCategorySelector();
  };

  const fetchCrawledData = async () => {
    if (!url.trim()) return alert("URL을 입력하세요.");
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/crawl/product`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const json = await res.json();
      if (json && json.uuid) {
        setData(json);
        setName(json.title || "");
        setDescription(json.description || "");
        setPrice(json.price || "");
        setSelectedImages(json.images.map((img) => ({ filename: img, checked: true })));
      } else {
        alert("크롤링 실패");
      }
    } catch (e) {
      alert("크롤링 중 오류 발생");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category?.id) return alert("카테고리를 선택해주세요.");

    setIsLoading(true);
    const selected = selectedImages.filter((img) => img.checked);
    const formData = new FormData();

    const productPayload = {
      name,
      description,
      price,
      originPrice,
      discountRate,
      stock,
      minStock,
      expiryDate,
      categoryId: category.id,
      gImage: selected.map((img) => img.filename),
    };

    formData.append("product", JSON.stringify(productPayload));
    formData.append("uuid", data.uuid);

    try {
      for (const img of selected) {
        const folder = img.filename.startsWith("desc_") ? "desc" : "image";
        const file = await fetch(`${BACKEND_URL}/crawl/${data.uuid}/${folder}/${img.filename}`)
          .then((res) => res.blob())
          .then((blob) => new File([blob], img.filename));
        formData.append("images", file);
      }

      await uploadCrawledProduct(formData);
      onClose();
    } catch (error) {
      alert("상품 등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((c) => setCategories(c));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
      {!data ? (
        <div className="bg-white p-6 rounded-xl shadow-xl max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">상품 URL 입력</h3>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="알리익스프레스, 테무 등 상품 URL"
            className="w-full border px-3 py-2 rounded mb-4"
          />
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800">
              취소
            </button>
            <button
              onClick={fetchCrawledData}
              disabled={isLoading}
              className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 text-white"
            >
              {isLoading ? "처리 중..." : "가져오기"}
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="overflow-y-auto overflow-x-hidden max-h-[90vh] bg-white rounded-2xl text-black w-full max-w-lg p-6 shadow-xl animate-slideUp relative"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-gray-600" />
              상품 등록 (크롤링 데이터)
            </h2>
            <button
              onClick={onClose}
              type="button"
              className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 상품명 */}
          <div className="mb-5">
            <Label label="상품명" className="mb-1.5 text-sm font-medium flex items-center text-gray-700">
              <Tag className="w-4 h-4 mr-1.5 text-gray-500" />
              상품명
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm"
              required
            />
          </div>

          <div className="mb-4">
            <Label label="상품 설명" />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none"
              required
            />
          </div>

          <div className="mb-5">
            <Label label="가격" className="text-sm font-medium flex items-center text-gray-700 mb-1.5">
              <DollarSign className="w-4 h-4 mr-1.5 text-gray-500" />
              가격 정보
            </Label>
            <div className="flex gap-2 items-center">
              <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full" />
              <button
                type="button"
                onClick={onTogglePriceSelector}
                className="text-xs text-white bg-gray-600 px-3 py-2 rounded-md hover:bg-gray-700 whitespace-nowrap"
              >
                할인 설정
              </button>
            </div>
            {originPrice && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500 line-through">{originPrice}원</span>
                <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">{discountRate}% 할인</span>
              </div>
            )}
             <SellerProductPriceSelector
              isOpen={isOpenPriceSelector}
              onToggle={onTogglePriceSelector}
              onSave={({ discountedPrice, originPrice, discountRate }) => {
                setOriginPrice(originPrice);
                setDiscountRate(discountRate);
                setPrice(discountedPrice);
                setData((prev) => ({ ...prev, price: discountedPrice }));
              }}
            />
          </div>

          <div className="mb-4">
            <Label label="재고 / 최소 재고" />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="재고 수량"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                required
              />
              <Input
                type="number"
                placeholder="최소 재고 수량"
                value={minStock}
                onChange={(e) => setMinStock(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <Label label="유통기한" />
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mb-4">
            <Label label="카테고리" />
            <button
              type="button"
              onClick={onToggleCategorySelector}
              className="w-full text-left px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 hover:bg-gray-100"
            >
              {category.name || "카테고리 선택"}
            </button>
            <SellerCategorySelector
              categories={categories}
              onCancel={onToggleCategorySelector}
              onSave={handleSaveCategory}
              isOpen={isOpenCategorySelector}
            />
          </div>

          <div className="mb-6">
            <Label label="사용할 이미지 선택" />
            <div className="grid grid-cols-3 gap-2 mt-2">
              {selectedImages.map((img, i) => {
                const folder = img.filename.startsWith("desc_") ? "desc" : "image"
                return (
                  <label key={img.filename} className="relative cursor-pointer">
                    <div
                      className={`relative overflow-hidden rounded-md border-2 ${img.checked ? "border-gray-700" : "border-gray-300"}`}
                    >
                      <img
                        src={`${BACKEND_URL}/crawl/${data.uuid}/${folder}/${img.filename}`}
                        alt="product"
                        className="w-full h-24 object-cover"
                      />
                      <div className={`absolute inset-0 ${img.checked ? "bg-black/10" : "bg-black/30"}`}></div>
                    </div>
                    <input
                      type="checkbox"
                      className="absolute top-2 left-2 h-4 w-4"
                      checked={img.checked}
                      onChange={() => handleImageToggle(i)}
                    />
                  </label>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-600 text-white py-3 font-semibold rounded-lg hover:bg-gray-700 transition"
          >
            {isLoading ? "처리 중..." : "등록하기"}
          </button>
        </form>
      )}
    </div>
  )
}

export default CrawledProductRegisterForm

async function uploadCrawledProduct(formData) {
  try {
    const res = await fetch("http://localhost:5000/crawl/product/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    })

    if (!res.ok) {
      throw new Error("업로드 실패")
    }

    const result = await res.json()
    console.log("✅ 등록 성공:", result.message)
  } catch (err) {
    console.error("❌ 등록 실패:", err)
    alert("상품 등록 중 오류 발생")
  }
}
