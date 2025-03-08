import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function SearchPage() {
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query'); // 쿼리 파라미터 가져오기

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/products/search?query=${query}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('검색 결과를 불러오는 데 실패했습니다.', error);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div>
      <h2>검색 결과</h2>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((product) => (
            <li key={product.productId}>
              {product.name} - {product.price}원
            </li>
          ))}
        </ul>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchPage;
