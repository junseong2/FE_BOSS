import React, { useEffect, useState } from 'react';
import bossLogo from '../assets/boss_logo.png';

function KakaoMapPage() {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  let marker = null; // 🔥 마커를 전역 변수로 유지
  let map = null; // 🔥 지도 객체를 전역 변수로 유지

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
            center: new window.kakao.maps.LatLng(35.1014, 128.9770), // 기본 위치(사하구중심)
            level: 3,
          };
          map = new window.kakao.maps.Map(container, options);

          // ✅ 사용자가 지도 클릭 시 마커 추가
          window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            setLocation({ lat, lng });

            // ✅ 기존 마커 삭제 후 새 마커 추가
            if (marker) {
              marker.setMap(null);
            }

            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lng),
            });
            newMarker.setMap(map);
            marker = newMarker; // 🔥 전역 변수에 저장

            // 지도 중심 이동
            map.setCenter(new window.kakao.maps.LatLng(lat, lng));

            // ✅ 서버에서 편의점 데이터 가져오기
            fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
              .then((response) => response.json())
              .then((data) => {
                console.log('📌 Fetched stores data:', data);
                setStores(data);

                // ✅ 각 매장에 대한 마커 추가
                data.forEach((store) => {
                  const storeLatLng = new window.kakao.maps.LatLng(store.latitude, store.longitude);
                  const storeMarkerImage = new window.kakao.maps.MarkerImage(
                    bossLogo,
                    new window.kakao.maps.Size(50, 50)
                  );

                  const storeMarker = new window.kakao.maps.Marker({
                    position: storeLatLng,
                    image: storeMarkerImage,
                  });
                  storeMarker.setMap(map);

                  // ✅ 매장 클릭 이벤트 추가
                  window.kakao.maps.event.addListener(storeMarker, 'click', function () {
                    const message = `${store.store_name} - ${store.address}\n주문하시겠습니까?`;
                    if (window.confirm(message)) {
                      alert('주문이 접수되었습니다.');
                    }
                  });
                });
              })
              .catch((error) => console.error('❌ Error fetching stores:', error));
          });

          // ✅ 새로고침 후 `location`을 가져오면 지도 중심 업데이트
          if (location) {
            const userLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
            map.setCenter(userLatLng); // 지도 중심을 사용자 위치로 이동

            if (!userMarker) {
              userMarker = new window.kakao.maps.Marker({
                position: userLatLng,
              });
              userMarker.setMap(map); // 사용자 위치 마커를 지도에 표시
            }
          }
        });
      }
    };

    script.onerror = () => {
      console.error('❌ 카카오 맵 API 로드 실패');
    };
  }, []);

  // ✅ **사용자 위치 가져오기 (초기 실행)**
  useEffect(() => {
    fetch('http://localhost:5000/auth/user/location', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          setLocation({ lat: data.latitude, lng: data.longitude });

          // ✅ API에서 받은 좌표로 지도 중심 이동
          if (map) {
            map.setCenter(new window.kakao.maps.LatLng(data.latitude, data.longitude));

            if (!userMarker) {
              userMarker = new window.kakao.maps.Marker({
                position: userLatLng,
                //  if (data.latitude && data.longitude) {setLocation({ lat: data.latitude, lng: data.longitude });에서 가져온 좌표
              });
              userMarker.setMap(map); // 사용자 위치 마커를 지도에 표시
            }
       
            
          }
        } else {
          console.error('❌ 사용자 위치를 가져오지 못했습니다.');
        }
      })
      .catch((error) => console.error('❌ 위치 데이터 가져오기 실패:', error));
  }, []);

  return (
    <div>
      <h1>카카오 지도 - 이마트24 편의점 추천</h1>
      <div id="map" style={{ width: '400px', height: '400px' }}></div>
      {location && (
        <div>
          <h2>
            선택한 위치: {location.lat}, {location.lng}
          </h2>
          {stores.length > 0 && (
            <div>
              <h3>주변 이마트24 편의점:</h3>
              <ul>
                {stores.map((store, index) => (
                  <li key={index}>
                    {store.store_name} - {store.address}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default KakaoMapPage;