import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';

export default function EditorSettingModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-[700px] max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl"
        >
          <IoClose />
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}
