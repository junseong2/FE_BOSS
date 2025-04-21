import React from 'react';
import { BASE_URL } from '../lib/api';

function MobileBanner({ title, subtitle, backgroundColor, imageUrl }) {

  const fullImgUrl = imageUrl?.startsWith("http") ? imageUrl : BASE_URL+`${imageUrl}`;
  return (
    <div style={{ backgroundColor }} className="p-4 text-center text-white">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="text-sm">{subtitle}</p>
      <img src={fullImgUrl} alt="banner" className="mt-2 w-full rounded-lg" />
    </div>
  );
}

export default MobileBanner;
