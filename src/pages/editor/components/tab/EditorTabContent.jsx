import { IoGridOutline, IoImageOutline, IoBagHandleOutline,IoPhonePortraitOutline ,IoSquareOutline} from 'react-icons/io5';


import { MultipleImageUploader } from '../../../../components/ImageUploader';

export default function EditorTabContent({ targetTabName, onSelectElement, elements }) {
  return (
    <div className='w-full px-2'>
      {targetTabName === '설정' ? (
        <EditorElementGrid onSelectElement={onSelectElement} elements={elements} />
      ) : (
        <MultipleImageUploader />
      )}
    </div>
  );
}

// 커스텀할 레이아웃 요소 그리드
function EditorElementGrid({ onSelectElement, elements }) {
  const items = [
    { icon: <IoGridOutline />, label: '헤더', type: 'header' },
    { icon: <IoImageOutline />, label: '배너', type: 'banner' },
    { icon: <IoBagHandleOutline />, label: '상품 그리드', type: 'grid' },    
    { icon: <IoPhonePortraitOutline/>, label: '바텀네비게이션바', type: 'bottomNavigationbar' },
    { icon: <IoSquareOutline/>, label: '여백', type: 'blank' },

  ];

  return (
    <div className='mt-6 flex flex-wrap gap-2 justify-center'>
      <p className='text-center w-full py-[1rem]'>요소를 클릭하여 쇼핑몰을 꾸며보세요!</p>
      {items.map(({ icon, label, type }, index) => (
        <div key={index} className='relative group'>
         <button
  onClick={() => {
    console.log("현재 type:", type);
    console.log("현재 elements[type]:", elements[type]);

    const selectedElement = elements[type]?.type === type ? elements[type] : null;
    console.log("선택된 요소:", selectedElement);

    onSelectElement(selectedElement);
  }}
  className='border border-gray-400 rounded-lg flex flex-col justify-center items-center gap-2 w-[115px] h-[100px] transition duration-300 hover:text-blue-500 hover:border-blue-500'
>
            <span className='text-2xl'>{icon}</span>
            <span className='text-[0.95rem]'>{label}</span>
          </button>
          {index === 0 && (
            <div className='absolute top-4 right-[-20rem] hidden group-hover:block border border-gray-500 px-4 py-1 rounded-md bg-white shadow-md'>
              총 4개의 헤더 중 하나를 선택해보세요!
            </div>
          )}
          {index === 1 && (
            <div className='absolute top-4 right-[-25.2rem] hidden group-hover:block border border-gray-500 px-4 py-1 rounded-md bg-white shadow-md'>
              배너를 추가하면 사용자의 눈길을 더 끌 수 있어요!
            </div>
          )}
          {index === 2 && (
            <div className='absolute top-4 right-[-22.5rem] hidden group-hover:block border border-gray-500 px-4 py-1 rounded-md bg-white shadow-md'>
              상품 그리드를 유동적으로 추가할 수 있어요!
            </div>
          )}    {index ===3  && (
            <div className='absolute top-4 right-[-25.2rem] hidden group-hover:block border border-gray-500 px-4 py-1 rounded-md bg-white shadow-md'>
              모바일 환경에서 사용할 UI를 추가할 수 있어요!
            </div>
          )
          
          
          
          }

{index ===5  && (
            <div className='absolute top-4 right-[-25.2rem] hidden group-hover:block border border-gray-500 px-4 py-1 rounded-md bg-white shadow-md'>
              여백을 추가해서 디자인을 꾸며보세요.
            </div>
          )
          
          
          
          }
        </div>
      ))}
    </div>
  );
}
