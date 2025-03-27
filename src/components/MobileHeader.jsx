import React from 'react';

function MobileHeader({ title, backgroundColor, logoUrl }) {
  return (
    <header style={{ backgroundColor }} className="flex items-center p-4">
      <img src={logoUrl} alt="logo" className="w-10 h-10 mr-3" />
      <h1 className="text-white text-lg font-bold">{title}</h1>
    </header>
  );
}

export default MobileHeader;