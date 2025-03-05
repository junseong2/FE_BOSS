// frontend/src/pages/KakaoMapPage.jsx
import React, { useEffect, useState } from 'react';

const KakaoMapPage = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);

  useEffect(() => {
    // Kakao 지도 API 로드
    const script = document.createElement("script");
    script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=YOUR_KAKAO_APP_KEY&autoload=false";
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const container = document.getElementById('map');
        const options = {
          center: new window.kakao.maps.LatLng(33.450701, 126.570667), // 초기 위치 (기본 설정)
          level: 3
        };
        const map = new window.kakao.maps.Map(container, options);

        // 클릭 이벤트: 사용자가 클릭한 위치로 이동하고, 위치 정보를 백엔드로 전송
        window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
          const lat = mouseEvent.latLng.getLat();
          const lng = mouseEvent.latLng.getLng();
          setLocation({ lat, lng });

          // 백엔드 API 호출: 사용자가 선택한 위치 근처 이마트24 편의점 검색
          fetch(`/api/stores?lat=${lat}&lng=${lng}`)
            .then((response) => response.json())
            .then((data) => setStores(data))
            .catch((error) => console.error('Error fetching stores:', error));

          // 마커 생성
          const markerPosition = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition
          });
          marker.setMap(map);
        });
      });
    };
  }, []);

  return (
    <div>
      <h1>카카오 지도 - 이마트24 편의점 추천</h1>
      <div id="map" style={{ width: '100%', height: '500px' }}></div>
      {location && (
        <div>
          <h2>선택한 위치: {location.lat}, {location.lng}</h2>
          <h3>주변 이마트24 편의점:</h3>
          <ul>
            {stores.map((store, index) => (
              <li key={index}>
                {store.name} - {store.address}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default KakaoMapPage;
