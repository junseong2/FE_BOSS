import { useEffect, useState } from 'react';
import { IoCloseCircle } from 'react-icons/io5';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import useToggle from '../../../../hooks/useToggle';
import SellerCategorySelector from './SellerCategorySelector';
import { getCategories } from '../../../../services/category.service';

function CrawledProductRegisterForm({ onClose }) {
  const BACKEND_URL = 'http://localhost:5000';
  const [url, setUrl] = useState('');
  const [data, setData] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({ id: 1, name: '기본카테고리' });

  const { onToggle: onToggleCategorySelector, isOpen: isOpenCategorySelector } = useToggle();

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
    if (!url.trim()) return alert('URL을 입력하세요.');
    try {
      const res = await fetch(`${BACKEND_URL}/crawl/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const json = await res.json();
      if (json && json.uuid) {
        setData(json);
        setName(json.title || '');
        setDescription(json.description || '');
        setPrice(json.price || '');
        setSelectedImages(json.images.map((img) => ({ filename: img, checked: true })));
      } else {
        alert('크롤링 실패');
      }
    } catch (e) {
      alert('크롤링 중 오류 발생');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category?.id) return alert('카테고리를 선택해주세요.');

    const selected = selectedImages.filter((img) => img.checked);
    const formData = new FormData();

    const productPayload = {
      name,
      description,
      price,
      categoryId: category.id,
      gImage: selected.map((img) => img.filename),
    };

    formData.append('product', JSON.stringify(productPayload));
    formData.append('uuid', data.uuid);
    for (let img of selected) {
      const folder = img.filename.startsWith('desc_') ? 'desc' : 'image';
      const file = await fetch(`${BACKEND_URL}/crawl/${data.uuid}/${folder}/${img.filename}`)
        .then((res) => res.blob())
        .then((blob) => new File([blob], img.filename));
      formData.append('images', file);
    }

    await uploadCrawledProduct(formData);
    onClose();
  };

  useEffect(() => {
    getCategories().then((c) => setCategories(c));
  }, []);

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn'>
      {!data ? (
        <div className='bg-white p-6 rounded-xl shadow-xl max-w-md w-full'>
          <h3 className='text-lg font-bold mb-4'>상품 URL 입력</h3>
          <input
            type='text'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder='알리익스프레스, 테무 등 상품 URL'
            className='w-full border px-3 py-2 rounded mb-4'
          />
          <div className='flex justify-end gap-2'>
            <button onClick={onClose} className='px-4 py-2 rounded bg-gray-300'>취소</button>
            <button onClick={fetchCrawledData} className='px-4 py-2 rounded bg-blue-500 text-white'>가져오기</button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className='overflow-y-auto max-h-[90vh] bg-white rounded-2xl text-black w-full max-w-lg p-6 shadow-xl relative'
        >
          <h2 className='text-xl font-semibold mb-6 text-center'>상품 등록 (크롤링 데이터)</h2>
          <button onClick={onClose} className='absolute top-3 right-3 text-2xl' title='닫기 버튼'>
            <IoCloseCircle />
          </button>

          <div className='mb-4'>
            <Label label='상품명' />
            <Input value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className='mb-4'>
            <Label label='상품 설명' />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-lg text-sm h-24 resize-none'
              required
            />
          </div>

          <div className='mb-4'>
            <Label label='가격' />
            <Input
              type='number'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>

          <div className='mb-4'>
            <Label label='카테고리' className='mb-1 text-sm' />
            <p
              onClick={onToggleCategorySelector}
              className='text-sm text-gray-600 hover:text-gray-800 cursor-pointer pl-1'
            >
              선택된 카테고리: <span className='font-medium'>{category.name || '없음'}</span>
            </p>
            <SellerCategorySelector
              categories={categories}
              onCancel={onToggleCategorySelector}
              onSave={handleSaveCategory}
              isOpen={isOpenCategorySelector}
            />
          </div>

          <div className='mb-6'>
            <Label label='사용할 이미지 선택' />
            <div className='grid grid-cols-3 gap-2 mt-2'>
              {selectedImages.map((img, i) => {
                const folder = img.filename.startsWith('desc_') ? 'desc' : 'image';
                return (
                  <label key={img.filename} className='relative cursor-pointer'>
                    <img
                      src={`${BACKEND_URL}/crawl/${data.uuid}/${folder}/${img.filename}`}
                      alt='product'
                      className={`w-full h-24 object-cover border-2 rounded ${img.checked ? 'border-blue-500' : 'border-gray-300'}`}
                    />
                    <input
                      type='checkbox'
                      className='absolute top-1 left-1 scale-150'
                      checked={img.checked}
                      onChange={() => handleImageToggle(i)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type='submit'
            className='w-full bg-blue-600 text-white py-3 font-semibold rounded-lg hover:bg-blue-500 transition'
          >
            등록하기
          </button>
        </form>
      )}
    </div>
  );
}

export default CrawledProductRegisterForm;

// ✅ 아래에 직접 정의된 업로드 함수
async function uploadCrawledProduct(formData) {
  try {
    const res = await fetch('http://localhost:5000/crawl/product/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('업로드 실패');
    }

    const result = await res.json();
    console.log('✅ 등록 성공:', result.message);
  } catch (err) {
    console.error('❌ 등록 실패:', err);
    alert('상품 등록 중 오류 발생');
  }
}



