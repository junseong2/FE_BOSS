import { useState } from 'react';
import {
  IoGridOutline,
  IoImageOutline,
  IoBagHandleOutline,
  IoPhonePortraitOutline,
  IoSquareOutline,
  IoTextOutline,
} from 'react-icons/io5';

import EditorTemplateGrid from '../EditorTemplateGrid';
import { MultipleImageUploader } from '../../../../components/ImageUploader';
import EditorSettingModal from '../EditorSettingModal';

export default function EditorTabContent({ targetTabName, onSelectElement, elements }) {
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  return (
    <div className='w-full px-2'>
      {targetTabName === '설정' ? (
        <>
          <button
            onClick={() => setIsSettingModalOpen(true)}
            className="mt-4 w-full text-center text-blue-600 border border-blue-500 rounded-md py-2 hover:bg-blue-50"
          >
            더보기 (설정 요소 열기)
          </button>

          <EditorSettingModal
            isOpen={isSettingModalOpen}
            onClose={() => setIsSettingModalOpen(false)}
          >
            <EditorElementGrid
              onSelectElement={(element) => {
                onSelectElement(element);
                setIsSettingModalOpen(false);
              }}
              elements={elements}
            />
          </EditorSettingModal>
        </>
      ) : targetTabName === '탬플릿' ? (
        <EditorTemplateGrid
          isOpen={isTemplateModalOpen}
          onClose={() => setIsTemplateModalOpen(false)}
          onSelectTemplate={(template) => {
            onSelectElement(template);
            setIsTemplateModalOpen(false);
          }}
        />
      ) : (
        <MultipleImageUploader />
      )}
    </div>
  );
}
function EditorElementGrid({ onSelectElement, elements }) {
  const items = [
    { icon: <IoGridOutline />, label: '헤더', type: 'header' },
    { icon: <IoGridOutline />, label: '헤더2', type: 'header2' },
    { icon: <IoImageOutline />, label: '배너', type: 'banner' },
    { icon: <IoBagHandleOutline />, label: '상품 그리드', type: 'grid' },
    { icon: <IoBagHandleOutline />, label: '상품 그리드2', type: 'grid2' },
    { icon: <IoPhonePortraitOutline />, label: '바텀네비게이션바', type: 'bottomNavigationbar' },
    { icon: <IoSquareOutline />, label: '여백', type: 'blank' },
    { icon: <IoTextOutline />, label: '텍스트', type: 'text' },
    { icon: <IoImageOutline />, label: '이미지', type: 'image' },
    { icon: <IoSquareOutline />, label: '컬러 박스', type: 'colorbox' },
  ];

  return (
    <div className='mt-6 flex flex-wrap gap-2 justify-center'>
      <p className='text-center w-full py-[1rem]'>요소를 클릭하여 쇼핑몰을 꾸며보세요!</p>
      {items.map(({ icon, label, type }, index) => (
        <div key={index} className='relative group'>
          <button
            onClick={() => {
              const selectedElement = elements[type]?.type === type ? elements[type] : null;
              onSelectElement(selectedElement);
            }}
            className='border border-gray-400 rounded-lg flex flex-col justify-center items-center gap-2 w-[115px] h-[100px] transition duration-300 hover:text-blue-500 hover:border-blue-500'
          >
            <span className='text-2xl'>{icon}</span>
            <span className='text-[0.95rem]'>{label}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
