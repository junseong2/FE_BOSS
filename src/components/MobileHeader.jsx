import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MobileHeader({
  title,
  backgroundColor = '#ffffff',
  logoUrl,
  fontSize = '16px',
  fontFamily = 'inherit',
  fontWeight = 'normal',
}) {
  const BASE_IMAGE_URL = 'http://localhost:5000';
  const { storename } = useParams();

  const fullLogoUrl = logoUrl?.startsWith('/uploads')
    ? `${BASE_IMAGE_URL}${logoUrl}`
    : logoUrl;

  return (
    <header
      style={{ backgroundColor }}
      className="w-full flex items-center justify-between px-4 py-3 shadow-md"
    >
      {/* 좌측 로고 */}
      {fullLogoUrl && (
        <img
          src={fullLogoUrl}
          alt="logo"
          className="w-10 h-10 object-contain"
        />
      )}

      {/* 중앙 텍스트 */}
      <h1
        className="flex-1 text-center truncate"
        style={{
          color: 'white',
          fontSize,
          fontFamily,
          fontWeight,
        }}
      >
        {title}
      </h1>

      {/* 우측 여백 */}
      <div className="w-10 h-10" />
    </header>
  );
}

export default MobileHeader;
