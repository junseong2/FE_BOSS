import { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import axios from 'axios';

function CameraCapturePage() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const webcamRef = useRef(null);

  // useEffect를 사용하여 쿼리 파라미터에서 username을 가져오거나 세션에서 가져오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const userNameFromUrl = urlParams.get('userName');

    if (userNameFromUrl) {
      setName(userNameFromUrl); // 쿼리 파라미터에서 가져온 username 설정
    } else {
      const storedUserName = sessionStorage.getItem('username'); // 세션에서 username 가져오기
      if (storedUserName) {
        setName(storedUserName); // 세션에서 가져온 username 설정
      }
    }
  }, []); // 컴포넌트 로드 시 한 번만 실행

  // 3초마다 자동으로 캡처
  useEffect(() => {
    const interval = setInterval(() => {
      captureImage();
    }, 3000); // 3초마다 실행

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 해제
  }, []);

  // 얼굴 캡처 (자동 실행)
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImage(imageSrc);
    }
  };

  // 얼굴 등록 (버튼 클릭 시 실행)
  const handleAddFace = async () => {
    if (!image || !name) {
      alert('이름과 이미지를 입력하세요!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/add-face', {
        base64Image: image,
        name,
        user_id: name,
      });

      console.log('✅ 얼굴 등록 성공:', response.data);
      alert('얼굴이 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('❌ 얼굴 등록 실패:', error);
      alert('얼굴 등록에 실패했습니다.');
    }
  };

  // 얼굴 검색 (버튼 클릭 시 실행)
  const handleSearchFace = async () => {
    if (!image) {
      alert('먼저 얼굴을 캡처하세요!');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/face-recognition', {
        base64Image: image,
      });

      console.log('✅ 얼굴 검색 결과:', response.data);
      alert(response.data.message || '인식된 사람을 찾을 수 없습니다.');
    } catch (error) {
      console.error('❌ 얼굴 검색 실패:', error);
      alert('얼굴 검색에 실패했습니다.');
    }
  };

  return (
    <div>
      <h1>📸 자동 캡처 & 얼굴 검색</h1>
      <Webcam ref={webcamRef} screenshotFormat='image/jpeg' />

      {image && <img src={image} alt='Captured' width='200' />}

      <input
        type='text'
        value={name} // 여기서 name 상태 값이 기본값으로 입력됨
        onChange={(e) => setName(e.target.value)} // 이름을 변경할 수 있게 설정
        placeholder='이름 입력'
      />

      <button onClick={handleAddFace}>💾 얼굴 등록</button>
      <button onClick={handleSearchFace}>🔍 얼굴 검색</button>
    </div>
  );
}

export default CameraCapturePage;
