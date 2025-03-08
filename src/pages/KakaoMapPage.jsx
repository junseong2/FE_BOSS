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
    fetch('http://localhost:5000/auth/user/location', {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        const { latitude, longitude } = data;

        if (latitude && longitude) {
          const userLocation = { lat: latitude, lng: longitude };
          setLocation(userLocation);
          // updateMapLocation(userLocation);
          // lat과 lng 대신 latitude와 longitude를 사용합니다.
          updateMapWithAddress(latitude, longitude);
          console.log('사용자주소기반위치지정');
        } else {
          console.error('❌ 사용자 위치를 가져오지 못했습니다.');
          console.log('사용자주소기반위치실패');
        }
      })
      .catch((error) => console.error('❌ 위치 데이터 가져오기 실패:', error));
  }, []);

  useEffect(
    () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src =
        '//dapi.kakao.com/v2/maps/sdk.js?appkey=6cec803636734cf1381018cd02a8a18c&autoload=false';

      document.head.appendChild(script);

      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            initializeMap();
          });
        }
      };

      script.onerror = () => {
        console.error('❌ 카카오 맵 API 로드 실패');
      };
    },
    [location],
    [],
  ); // location이 변경될 때마다 실행

  useEffect(
    () => {
      if (markerPosition) {
        const { lat, lng } = markerPosition;
        fetchStoresAndUpdateMarkers(lat, lng);
      }
    },
    [markerPosition, zoomLevel],
    [],
  ); // markerPosition이나 zoomLevel이 변경될 때마다 실행

  const updateMapLocation = (userLocation) => {
    if (map) {
      map.setCenter(new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng));
      map.setLevel(zoomLevel);

      if (!userMarker) {
        userMarker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(userLocation.lat, userLocation.lng),
        });
        userMarker.setMap(map);
      }
    }
  };

  const initializeMap = () => {
    const container = document.getElementById('map');
    const options = {
      center: location
        ? new window.kakao.maps.LatLng(location.lat, location.lng)
        : new window.kakao.maps.LatLng(35.1014, 128.977), // 초기 위치 설정
      level: zoomLevel,
    };
    map = new window.kakao.maps.Map(container, options);

    if (location) {
      console.log('location : ' + location.lat + ',' + location.lng);
      updateMapLocation(location);
      fetchStoresAndUpdateMarkers(location.lat, location.lng);
    }

    addMapEventListeners();
  };

  const addMapEventListeners = () => {
    window.kakao.maps.event.addListener(map, 'click', handleMapClick);
    window.kakao.maps.event.addListener(map, 'dragend', handleMapDragEnd);
    window.kakao.maps.event.addListener(map, 'zoom_changed', handleZoomChange);
  };
  const handleMapClick = (mouseEvent) => {
    const lat = mouseEvent.latLng.getLat();
    const lng = mouseEvent.latLng.getLng();
    setMarkerPosition({ lat, lng });

    // 이전 마커 제거
    if (marker) {
      marker.setMap(null);
    }

    // 새로운 마커 생성
    const newMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
    });

    // 지도에 마커 추가
    newMarker.setMap(map);
    marker = newMarker; // 현재 마커를 저장
    map.setCenter(new window.kakao.maps.LatLng(lat, lng));

    // 마커 위치 로그 출력
    console.log(`마커 위치: 위도 ${lat}, 경도 ${lng}`);

    // 스토어 정보 가져오기
    fetchStoresAndUpdateMarkers(lat, lng);
  };

  const handleMapDragEnd = () => {
    const center = map.getCenter();
    const lat = center.getLat();
    const lng = center.getLng();
    setMarkerPosition({ lat, lng });

    if (marker) {
      marker.setMap(null); // 이전 마커 제거
    }

    const newMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(lat, lng),
    });
    newMarker.setMap(map);
    marker = newMarker;

    const currentZoomLevel = map.getLevel();
    setZoomLevel(currentZoomLevel);
    fetchStoresAndUpdateMarkers(lat, lng);
  };

  const handleZoomChange = () => {
    const currentZoomLevel = map.getLevel();
    setZoomLevel(currentZoomLevel);
    addStoreMarkers(stores);
  };

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
      const userLat = markerPosition.lat;
      const userLng = markerPosition.lng;

      const distances = stores.map((store) => {
        const storeLat = store.latitude;
        const storeLng = store.longitude;
        const distance = getDistance(userLat, userLng, storeLat, storeLng);
        return { store, distance };
      });

      distances.sort((a, b) => a.distance - b.distance);
      setSortedStores(distances);
      addStoreMarkers(stores);
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
    storeMarkers.forEach((marker) => marker.setMap(null)); // 이전 마커 제거

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

  // 주소 정보로 이동 후 마커 추가
  const updateMapWithAddress = (latitude, longitude) => {
    if (map) {
      const position = new window.kakao.maps.LatLng(latitude, longitude);
      map.setCenter(position); // 맵을 주소 위치로 이동

      // 이전 마커 제거
      if (marker) {
        marker.setMap(null);
      }

      // 주소 위치에 마커 추가
      const newMarker = new window.kakao.maps.Marker({
        position: position,
      });
      newMarker.setMap(map); // 주소 위치에 마커 추가
      marker = newMarker; // 새로 생성된 마커를 저장

      // 마커 위치 로그 출력
      console.log(`마커 위치: 위도 ${latitude}, 경도 ${longitude}`);

      console.log('map이있음');
    } else {
      console.log('map이없음');
    }
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
