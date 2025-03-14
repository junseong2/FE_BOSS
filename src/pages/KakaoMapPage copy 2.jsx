import React, { useEffect, useState } from 'react';
import bossLogo from '../assets/boss_logo.png';

function KakaoMapPage() {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [sortedStores, setSortedStores] = useState([]);
  const [storeMarkers, setStoreMarkers] = useState([]); // 마커 상태 추가
  const [zoomLevel, setZoomLevel] = useState(3); // 확대 레벨 상태 추가
  let marker = null;
  let map = null;
  let userMarker = null;

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
            center: new window.kakao.maps.LatLng(35.1014, 128.977),
            level: zoomLevel, // 확대 레벨을 상태로 설정
          };
          map = new window.kakao.maps.Map(container, options);

          if (location) {
            const userLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
            map.setCenter(userLatLng);

            if (!userMarker) {
              userMarker = new window.kakao.maps.Marker({
                position: userLatLng,
              });
              userMarker.setMap(map);
            }
          }

          window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            setLocation({ lat, lng });

            if (marker) {
              marker.setMap(null);
            }

            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lng),
            });
            newMarker.setMap(map);
            marker = newMarker;

            map.setCenter(new window.kakao.maps.LatLng(lat, lng));
            fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
              .then((response) => response.json())
              .then((data) => {
                console.log('📌 Fetched stores data:', data);
                setStores(data);
                findClosestStores(data);
              })
              .catch((error) => console.error('❌ Error fetching stores:', error));
          });

          window.kakao.maps.event.addListener(map, 'dragend', function () {
            const center = map.getCenter();
            const lat = center.getLat();
            const lng = center.getLng();
            setLocation({ lat, lng });

            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lng),
            });
            newMarker.setMap(map);
            marker = newMarker;

            // 확대 레벨 상태 업데이트
            const currentZoomLevel = map.getLevel();
            setZoomLevel(currentZoomLevel); // 현재 확대 레벨 상태 저장

            fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
              .then((response) => response.json())
              .then((data) => {
                console.log('📌 Fetched stores data:', data);
                setStores(data);
                findClosestStores(data);
              })
              .catch((error) => console.error('❌ Error fetching stores:', error));
          });

          window.kakao.maps.event.addListener(map, 'zoom_changed', function () {
            const currentZoomLevel = map.getLevel();
            setZoomLevel(currentZoomLevel); // 확대 레벨 상태 업데이트
          });
        });
      }
    };

    script.onerror = () => {
      console.error('❌ 카카오 맵 API 로드 실패');
    };
  }, [location]); // zoomLevel을 의존성 배열에서 제거

  useEffect(() => {
    fetch('http://localhost:5000/auth/user/location', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.latitude && data.longitude) {
          setLocation({ lat: data.latitude, lng: data.longitude });

          if (map) {
            map.setCenter(new window.kakao.maps.LatLng(data.latitude, data.longitude));
            map.setLevel(zoomLevel); // 확대 레벨 유지

            if (!userMarker) {
              userMarker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(data.latitude, data.longitude),
              });
              userMarker.setMap(map);
            }
          }
        } else {
          console.error('❌ 사용자 위치를 가져오지 못했습니다.');
        }
      })
      .catch((error) => console.error('❌ 위치 데이터 가져오기 실패:', error));
  }, []);

  const findClosestStores = (stores) => {
    if (location) {
      const userLat = location.lat;
      const userLng = location.lng;

      const distances = stores.map((store) => {
        const storeLat = store.latitude;
        const storeLng = store.longitude;
        const distance = getDistance(userLat, userLng, storeLat, storeLng);
        return { store, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      setSortedStores(distances.map((item) => item));
      addStoreMarkers(stores, map); // 여기서 마커 추가
    }
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // 지구의 반지름 (킬로미터)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 거리 반환
  };

  const addStoreMarkers = (stores, map) => {
    // 이전 마커를 제거
    storeMarkers.forEach((marker) => {
      marker.setMap(null); // 마커를 지도에서 제거
    });

    // 새로운 마커 생성
    const newMarkers = stores.map((store) => {
      const storeLatLng = new window.kakao.maps.LatLng(store.latitude, store.longitude);
      const storeMarkerImage = new window.kakao.maps.MarkerImage(
        bossLogo,
        new window.kakao.maps.Size(50, 50),
      );

      const storeMarker = new window.kakao.maps.Marker({
        position: storeLatLng,
        image: storeMarkerImage,
      });

      storeMarker.setMap(map); // 마커를 지도에 추가
      return storeMarker; // 새로 생성된 마커를 반환
    });

    // 마커 상태를 업데이트하여 기존 마커를 새로운 마커로 교체
    setStoreMarkers(newMarkers); // 상태를 새로운 마커 배열로 설정
    console.log('마커 갱신됨');
  };

  return (
    <div>
      <h1>카카오 지도 - 이마트24 편의점 추천</h1>
      <div id='map' style={{ width: '100%', height: '500px' }}></div>
      {sortedStores.length > 0 && (
        <div>
          <h2>편의점 목록 (가까운 순서)</h2>
          <ul>
            {sortedStores.map((item, index) => (
              <li key={index}>
                {item.store.store_name} - {item.store.address} - {item.distance.toFixed(2)} km
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default KakaoMapPage;
