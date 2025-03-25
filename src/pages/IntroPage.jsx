import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './styles/intropage.css';

function IntroPage({ sellerId }) {
  const { storename } = useParams();
  const [userImg, setUserImg] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false); // 이미지 로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        if (!sellerId) return;

        const response = await axios.get(`http://localhost:5000/seller/${sellerId}/image`);
        setUserImg(response.data.image);  // 서버에서 받은 userImg를 상태에 저장
      } catch (error) {
        console.error('❌ 사용자 이미지 로드 실패:', error);
      }
    };

    fetchUserImage();
  }, [sellerId]);

  // 이미지 로딩 완료 시 호출되는 함수
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="intro-page">
      {/* 배경 이미지와 텍스트 */}
      <div 
        className="storename-container"
        style={{
          backgroundImage: userImg 
            ? `url(http://localhost:5000/uploads/${userImg})` 
            : 'url(http://localhost:5000/uploads/defaultintroimg.jpg)',
        }}
      ><h1>'{storename}'의 소개페이지입니다.</h1>
      </div>

      {/* 이미지가 로드되지 않으면 기본 이미지 사용 */}
     

       {/* ✅ 유튜브 영상 추가 (작은 크기로 표시) */}
       <div className="video-container">
        <iframe 
          width="300"  // ✅ 크기를 조정 (너비)
          height="200" // ✅ 크기를 조정 (높이)
          src="https://www.youtube.com/embed/zJ4Jmfl9Hgs"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}

export default IntroPage;
