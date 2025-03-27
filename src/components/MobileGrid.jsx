import React from 'react';

function MobileGrid({ title, columns, sortList }) {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      <div className={`grid grid-cols-${columns} gap-2 mt-2`}>
        {sortList.map((sort) => (
          <button key={sort} className="bg-gray-200 p-2 rounded">{sort}</button>
        ))}
      </div>
    </div>
  );
}

export default MobileGrid;
