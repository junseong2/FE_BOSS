import { useState } from 'react';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import EditorCategorySelector from '../../EditorCategorySelector';
import { SingleImageUploader } from '../../../../components/ImageUploader';

export default function ElementEditor({ element, onUpdate, categories }) {
  const [editedElement, setEditedElement] = useState(element); // 수정된 요소 관리

  const [isToggleCategoryEditor, setIsToggleCategoryEditor] = useState(false);

  // 카테고리 에디터 토글 핸들러
  const handleCategoryEditor = () => {
    setIsToggleCategoryEditor((prev) => !prev);
  };

  // 편집 요소 수정 핸들러
  const handleChange = (key, value) => {
    setEditedElement((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        [key]: value,
      },
    }));
  };

  // 편집 이미지 변경 핸들러
  const handleChangeImage = (previewImgUrl) => {
    setEditedElement((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        logoUrl: previewImgUrl,
      },
    }));
  };

  // 편집 요소 수정
  const handleSave = () => {
    onUpdate(editedElement);
  };

  // 편집기 렌더링
  const renderEditor = () => {
    switch (element.type) {
      // 헤더
      case 'header':
        return (
          <>
            {/* 로고 설정 */}
            <div className='space-y-2'>
              <Label label={'로고 설정'} />

              <SingleImageUploader onUpdateImage={handleChangeImage} />
            </div>

            {/* 메뉴 항목 */}
            <div className='space-y-2'>
              <Label label={'메뉴 설정'} />

              {/* 임시 토글 버튼 */}
              <button
                className='mt-3 border rounded-[3px] text-sm p-1 flex gap-2 items-center justify-end hover:cursor-pointer border-[#4294F2] text-[#4294F2]'
                onClick={handleCategoryEditor}
              >
                편집창 오픈
              </button>
            </div>
          </>
        );

      // 배너
      case 'banner':
        return (
          <>
            {/* 배너 제목 */}
            <div className='space-y-2 mb-4'>
              <Label htmlFor={'title'} label={'제목'} />
              <Input
                id={'title'}
                value={editedElement.properties.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>

            {/* 배너 부제목 */}
            <div className='space-y-2 mb-4'>
              <Label htmlFor={'subtitle'} label={'부제목'} />
              <Input
                id={'subtitle'}
                value={editedElement.properties.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>

            {/* 배너 이미지 */}
            <div className='space-y-2 mb-4'>
              <Label htmlFor={'imageUrl'} label={'이미지 URL'} />
              <Input
                id={'imageUrl'}
                value={editedElement.properties.imageUrl}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
              />
            </div>
            <div className='space-y-2 mb-4'>
              <Label htmlFor={'backgroundColor'} label={'배경 색상'} />
              <div className='flex gap-2'>
                <Input
                  id='backgroundColor'
                  type='color'
                  className='w-12 h-10 p-1'
                  value={editedElement.properties.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
                <Input
                  value={editedElement.properties.backgroundColor}
                  onChange={(e) => handleChange('backgroundColor', e.target.value)}
                />
              </div>
            </div>
          </>
        );

      // 상품 그리드
      case 'productGrid':
        return (
          <>
            <div className='space-y-2 mb-4 flex flex-col items-start w-full'>
              <Label htmlFor={'title'} label={'제목'} />
              <Input
                id='title'
                value={editedElement.properties.title}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className='space-y-2 mb-4 flex flex-col items-start w-full'>
              <Label htmlFor='columns' label={'열 수'} />
              <Input
                className='w-full border border-[#E4E4E7]'
                id='columns'
                type='number'
                min={1}
                max={10}
                value={editedElement.properties.columns}
                onChange={(e) => handleChange('columns', Number(e.target.value))}
              />
            </div>
          </>
        );

      default:
        return <div>이 요소 유형에 대한 편집기는 준비중입니다. </div>;
    }
  };

  return (
    <>
      <div className='space-y-6'>
        {renderEditor()}
        <button
          onClick={handleSave}
          className='w-full rounded-sm p-2 bg-[#4294F2] text-white md:text-[14px] text-sm'
        >
          적용
        </button>
      </div>

      {/* 카테고리 편집기 */}
      {isToggleCategoryEditor ? (
        <EditorCategorySelector onCancel={handleCategoryEditor} categories={categories} />
      ) : null}
    </>
  );
}
