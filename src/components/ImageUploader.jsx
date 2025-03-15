import { useEffect, useRef, useState } from 'react';
import { IoImageOutline } from 'react-icons/io5';

/** 단일 이미지 업로드 기능 */
export function SingleImageUploader() {
  const [preview, setPreview] = useState(null);
  const imageRef = useRef(null);

  function imageUpload(e) {
    if (!imageRef.current) return;

    const file = e.currentTarget.files[0];
    const isImage = file.type.startsWith('image/');

    if (!isImage) return alert('확장자가 .png, .jpeg, .svg 등의 이미지 형식만 가능합니다.');

    // 미리보기 이미지 생성
    const imgSrc = URL.createObjectURL(file);

    setPreview(imgSrc);
  }

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className='mt-5'>
      <strong>이미지 업로드</strong>
      <label
        ref={imageRef}
        htmlFor='uploader'
        className='cursor-pointer mt-2 w-24 h-24 border border-[#75b5ff] flex items-center justify-center rounded-2xl '
      >
        {preview ? (
          <img src={preview} alt='미리보기 이미지' className='w-full h-full' />
        ) : (
          <IoImageOutline className='w-12 h-12 text-[#4294F2]' />
        )}
      </label>
      <input
        onChange={imageUpload}
        id='uploader'
        type='file'
        className={'appearance-none hidden'}
        accept='image/*'
        required
      />
    </div>
  );
}

/** 다중 이미지 업로드 기능 */
export function MultipleImageUploader() {
  const [previews, setPreviews] = useState([]);

  const inputRef = useRef(null);

  /** 이미지 업로드 함수*/
  function imageUpload(e) {
    const files = e.currentTarget.files;

    // 이미지 형식 체크
    [...files].forEach((file) => {
      if (!file.type.match('image/.*')) {
        alert('이미지 파일만 업로드 가능합니다.');
        inputRef.current.value = null;

        return;
      }
    });

    // 이미지 개수 체크
    if ([...files].length > 10) {
      alert('이미지는 10개 이하만 업로드할 수 있습니다.');
      inputRef.current.value = null;

      return;
    }

    // 미리보기 이미지 저장
    const images = [];
    [...files].forEach((file) => {
      const imgSrc = URL.createObjectURL(file);

      if (!images.includes(imgSrc)) {
        images.push(imgSrc);
      }
      setPreviews(images);
    });
  }

  //  생성된 프리뷰 이미지를 컴포넌트가 제거될 떄 같이 삭제
  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className='mt-5'>
      <strong>이미지 업로드</strong>
      <label htmlFor='uploader'></label>
      <input
        ref={inputRef}
        id='uploader'
        onChange={imageUpload}
        type='file'
        className={''}
        accept='image/*'
        required
        multiple
      />
      {previews.length > 0 ? (
        <ul className='w-full max-w-[1024] flex flex-wrap gap-2'>
          {previews.map((preview) => {
            return (
              <li key={preview} className='w-24 h-24 border border-[#E4E4E7] rounded-xl '>
                <img src={`${preview}`} className='w-full h-full rounded-xl' />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
