import { useEffect, useState } from 'react';
import { getMajorCategories } from '../../../services/category.service';

export default function HomeCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 카테고리(대분류) 조회
  const fetchCategories = async () => {
    const response = await getMajorCategories();

    if (response.status === 200) {
      setCategories(response.data);
    } else {
      setError('카테고리 목록을 불러올 수 없습니다.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className='w-full h-96 pt-14'>
      <h2 className='text-3xl'>전체 카테고리</h2>
      <div className='mt-5 flex flex-wrap gap-3'>
        {categories.map((category) => {
          return (
            <div key={category.id} className='w-[86px] border border-gray-100 p-2 rounded-xl'>
              <div className='border-gray-100 border w-9 h-9 mx-auto rounded-full bg-gray-100'></div>
              <div className='mt-1.5 text-center'>{category.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
