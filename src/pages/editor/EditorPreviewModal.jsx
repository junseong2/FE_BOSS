// components/EditorPreviewModal.jsx
import React from 'react';
import Modal from 'react-modal';

import { IoCloseOutline } from 'react-icons/io5';

Modal.setAppElement('#root');

const EditorPreviewModal = ({ isOpen, onRequestClose, settings }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="미리보기"
      className="bg-white p-4 rounded shadow-lg max-w-[90%] max-h-[90%] overflow-auto mx-auto mt-10 relative"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50"
    >
      <button
        className="absolute top-2 right-2 text-2xl"
        onClick={onRequestClose}
      >
        <IoCloseOutline />
      </button>
      <div className="mt-6">
        {/* 실제 ShopPage 컴포넌트 대신 미리보기 전용으로 간소화해서 렌더링 */}
        {settings.map((component, index) => {
          const Component = componentsMap[component.type];
          if (!Component || !component.layout) return null;

          const height = component.properties?.size?.web?.height || 'auto';

          return (
            <div
              key={component.id || index}
              style={{
                position: 'absolute',
                top: `${component.layout.top}px`,
                left: `${((component.layout.column - 1) / 8) * 100}%`,
                width: `${(component.layout.columnSpan / 8) * 100}%`,
                height,
              }}
            >
              <Component {...component.properties} />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};

export default EditorPreviewModal;
