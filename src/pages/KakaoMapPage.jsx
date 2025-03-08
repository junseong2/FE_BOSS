import React, { useEffect, useState } from 'react';

function KakaoMapPage() {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  let marker = null; // 마커를 전역 변수로 선언

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src =
      '//dapi.kakao.com/v2/maps/sdk.js?appkey=6cec803636734cf1381018cd02a8a18c&autoload=false';

    document.head.appendChild(script);

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const container = document.getElementById('map');
          const options = {
            center: new window.kakao.maps.LatLng(35.1595, 129.0605), // 서면위치
            level: 3,
          };
          const map = new window.kakao.maps.Map(container, options);

          window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();

            // LatLng 객체 생성
            const latLng = new window.kakao.maps.LatLng(lat, lng);
            setLocation({ lat, lng });

            // 이전에 찍은 마커가 있다면 삭제
            if (marker) {
              marker.setMap(null);
            }

            // 새 마커 아이콘 설정
            const markerImage = new window.kakao.maps.MarkerImage(
              'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png', // 아이콘 이미지 URL
              new window.kakao.maps.Size(24, 35), // 아이콘 크기 설정
            );

            // 새 마커 생성
            marker = new window.kakao.maps.Marker({
              position: latLng,
              image: markerImage, // 아이콘 설정
            });
            marker.setMap(map);

            // 클릭한 위치로 지도의 중심 이동
            map.setCenter(latLng);

            // 서버에서 편의점 데이터 가져오기
            fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
              .then((response) => response.json()) // JSON으로 응답 처리
              .then((data) => {
                console.log('Fetched stores data:', data); // 응답 데이터 출력
                setStores(data); // 받아온 데이터로 상태 업데이트
              })
              .catch((error) => console.error('Error fetching stores:', error));
          });
        });
      }
    };

    script.onerror = () => {
      console.error('카카오 맵 API 로드 실패');
    };
  }, []); // 한 번만 실행되도록 `[]`로 설정

  // 각도를 라디안으로 변환하는 함수
  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  //클라이언트측에서 거리계산시킴
  // 두 지점 간의 거리를 계산하는 함수 (단위: km)
  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const latDistance = toRadians(lat2 - lat1);
    const lonDistance = toRadians(lng2 - lng1);
    const a =
      Math.sin(latDistance / 2) * Math.sin(latDistance / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(lonDistance / 2) *
        Math.sin(lonDistance / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return 6371 * c; // 거리 계산
  };

  return (
    <div>
      <h1>카카오 지도 - 이마트24 편의점 추천</h1>
      <div id='map' style={{ width: '400px', height: '400px' }}></div>
      {location && (
        <div>
          <h2>
            선택한 위치: {location.lat}, {location.lng}
          </h2>
          {stores.length > 0 && (
            <div>
              <h3>주변 이마트24 편의점:</h3>
              <ul>
                {stores.map((store, index) => {
                  // 거리 계산
                  const distance = calculateDistance(
                    location.lat,
                    location.lng,
                    store.latitude,
                    store.longitude,
                  );
                  return (
                    <li key={index}>
                      {store.store_name} - {store.address} - {distance.toFixed(2)} km
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KakaoMapPage;
