import React from 'react';

function MobileBottomNavigationBar({ backgroundColor, items }) {
  return (
    <nav style={{ backgroundColor }} className="fixed bottom-0 w-full flex justify-around py-2">
      {items.map(({ id, label, icon }) => (
        <button key={id} className="flex flex-col items-center text-white">
          <span className="material-icons">{icon}</span>
          <span className="text-xs">{label}</span>
        </button>
      ))}
    </nav>
  );
}

export default MobileBottomNavigationBar;
