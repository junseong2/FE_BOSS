import React, { useEffect, useState } from 'react';
import bossLogo from '../assets/boss_logo.png';

let map = null; // 카카오 맵 인스턴스
let userMarker = null; // 사용자 마커
let storeMarkers = []; // 스토어 마커 배열
let marker = null; // 클릭 시 생성되는 마커

function KakaoMapPage() {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [sortedStores, setSortedStores] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [markerPosition, setMarkerPosition] = useState(null); // 마커 위치 상태 추가

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
            level: zoomLevel,
          };
          map = new window.kakao.maps.Map(container, options);

          // 사용자 위치가 있는 경우 중심 설정
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

          // 클릭 시 마커 추가 및 스토어 정보 가져오기
          window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            setMarkerPosition({ lat, lng }); // 마커 위치 상태 업데이트

            if (marker) {
              marker.setMap(null); // 이전 마커 제거
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

          // 드래그 종료 시 마커 업데이트 및 스토어 정보 가져오기
          window.kakao.maps.event.addListener(map, 'dragend', function () {
            const center = map.getCenter();
            const lat = center.getLat();
            const lng = center.getLng();
            setMarkerPosition({ lat, lng }); // 마커 위치 상태 업데이트

            if (marker) {
              marker.setMap(null); // 이전 마커 제거
            }

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
    if (markerPosition) {
      const { lat, lng } = markerPosition;

      // 마커가 위치가 변경되면 스토어 정보를 가져오는 부분
      fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('📌 Fetched stores data:', data);
          setStores(data);
          findClosestStores(data);
        })
        .catch((error) => console.error('❌ Error fetching stores:', error));
    }
  }, [markerPosition]); // 마커 위치가 변경될 때마다 실행

  const findClosestStores = (stores) => {
    if (markerPosition) {
      const userLat = markerPosition.lat;
      const userLng = markerPosition.lng;

      const distances = stores.map((store) => {
        const storeLat = store.latitude;
        const storeLng = store.longitude;
        const distance = getDistance(userLat, userLng, storeLat, storeLng);
        return { store, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      setSortedStores(distances); // 거리 정보를 포함한 스토어 리스트 업데이트
      addStoreMarkers(stores); // 마커 추가
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

  const addStoreMarkers = (stores) => {
    // 이전 마커를 제거
    storeMarkers.forEach((marker) => {
      marker.setMap(null); // 마커를 지도에서 제거
    });

    // 새로운 마커 생성
    storeMarkers = stores.map((store) => {
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
