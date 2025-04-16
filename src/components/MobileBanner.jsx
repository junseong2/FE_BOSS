import React from 'react';

function MobileBanner({ title, subtitle, backgroundColor, imageUrl }) {

  const fullImgUrl = imageUrl?.startsWith("http") ? imageUrl : `http://localhost:5000${imageUrl}`;
  return (
    <div style={{ backgroundColor }} className="p-4 text-center text-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{subtitle}</p>
      <img src={fullImgUrl} alt="banner" className="mt-2 w-full rounded-lg" />
    </div>
  );
}

export default MobileBanner;
