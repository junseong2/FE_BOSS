import React, { useEffect, useState } from 'react';
import bossLogo from '../assets/boss_logo.png';

let map = null;
let userMarker = null;
let storeMarkers = [];
let marker = null;

function KakaoMapPage() {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [sortedStores, setSortedStores] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(3);
  const [markerPosition, setMarkerPosition] = useState(null);

  // ✅ 카카오 Geocoding API 사용 (주소 → 위도/경도 변환)
  const fetchCoordinatesFromKakao = async (address) => {
    try {
      const KAKAO_API_KEY = '7210989739eb7f2416d0b24bda92824e'; // 🔹 카카오 API 키 입력
      const query = encodeURIComponent(address);
      const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${query}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: `KakaoAK ${KAKAO_API_KEY}` },
      });

      if (!response.ok) {
        throw new Error(`카카오 API 요청 실패! 상태 코드: ${response.status}`);
      }

      const data = await response.json();
      console.log('📌 카카오 API 응답:', data);

      if (data.documents.length > 0) {
        const { y: latitude, x: longitude } = data.documents[0];
        return { latitude: parseFloat(latitude), longitude: parseFloat(longitude) };
      } else {
        console.warn('⚠️ 해당 주소에 대한 위도/경도 정보를 찾을 수 없습니다.');
        return null;
      }
    } catch (error) {
      console.error('❌ 카카오 API 요청 중 오류 발생:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const response = await fetch('http://localhost:5000/auth/user/address', {
          method: 'GET',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('✅ 유저 주소 데이터:', data);

        if (data.length > 0) {
          const userAddress = `${data[0].address1} ${data[0].address2}`;
          console.log('📌 변환할 주소:', userAddress);

          const coordinates = await fetchCoordinatesFromKakao(userAddress);
          if (coordinates) {
            setLocation({ lat: coordinates.latitude, lng: coordinates.longitude });
            console.log('📍 변환된 위도/경도:', coordinates);
          }
        }
      } catch (error) {
        console.error('❌ 유저 주소 가져오기 실패:', error);
      }
    };

    fetchUserAddress();
  }, []);

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

          if (location) {
            const userLatLng = new window.kakao.maps.LatLng(location.lat, location.lng);
            map.setCenter(userLatLng);

            if (!userMarker) {
              userMarker = new window.kakao.maps.Marker({ position: userLatLng });
              userMarker.setMap(map);
            }
          }

          window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
            const lat = mouseEvent.latLng.getLat();
            const lng = mouseEvent.latLng.getLng();
            setMarkerPosition({ lat, lng });

            if (marker) marker.setMap(null);

            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lng),
            });
            newMarker.setMap(map);
            marker = newMarker;

            map.setCenter(new window.kakao.maps.LatLng(lat, lng));
            fetchStoresAndUpdateMarkers(lat, lng);
          });

          window.kakao.maps.event.addListener(map, 'dragend', function () {
            const center = map.getCenter();
            const lat = center.getLat();
            const lng = center.getLng();
            setMarkerPosition({ lat, lng });

            if (marker) marker.setMap(null);

            const newMarker = new window.kakao.maps.Marker({
              position: new window.kakao.maps.LatLng(lat, lng),
            });
            newMarker.setMap(map);
            marker = newMarker;

            setZoomLevel(map.getLevel());
            fetchStoresAndUpdateMarkers(lat, lng);
          });

          window.kakao.maps.event.addListener(map, 'zoom_changed', function () {
            setZoomLevel(map.getLevel());
          });
        });
      }
    };

    script.onerror = () => {
      console.error('❌ 카카오 맵 API 로드 실패');
    };
  }, [location]);

  const fetchStoresAndUpdateMarkers = (lat, lng) => {
    fetch(`http://localhost:5000/api/stores?lat=${lat}&lng=${lng}`)
      .then((response) => response.json())
      .then((data) => {
        console.log('📌 Fetched stores data:', data);
        setStores(data);
        findClosestStores(data);
      })
      .catch((error) => console.error('❌ Error fetching stores:', error));
  };

  const findClosestStores = (stores) => {
    if (markerPosition) {
      const distances = stores.map((store) => {
        const distance = getDistance(
          markerPosition.lat,
          markerPosition.lng,
          store.latitude,
          store.longitude,
        );
        return { store, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      setSortedStores(distances);
      addStoreMarkers(stores);
    }
  };

  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const addStoreMarkers = (stores) => {
    storeMarkers.forEach((marker) => marker.setMap(null));

    storeMarkers = stores.map((store) => {
      const storeLatLng = new window.kakao.maps.LatLng(store.latitude, store.longitude);
      const storeMarker = new window.kakao.maps.Marker({
        position: storeLatLng,
        image: new window.kakao.maps.MarkerImage(bossLogo, new window.kakao.maps.Size(50, 50)),
      });

      storeMarker.setMap(map);
      return storeMarker;
    });

    console.log('마커 갱신됨');
  };

  return (
    <div>
      <h1>카카오 지도 - 이마트24 편의점 추천</h1>
      <div id='map' style={{ width: '100%', height: '500px' }}></div>
      {sortedStores.length > 0 && (
        <div>
          <h2>편의점 목록</h2>
          <ul>
            {sortedStores.map(({ store }, index) => (
              <li key={index}>
                {store.name} - 거리: {store.distance.toFixed(2)}km
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default KakaoMapPage;
