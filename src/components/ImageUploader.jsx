import { useEffect, useRef, useState } from 'react';
import { IoImageOutline, IoTrash } from 'react-icons/io5';

/** 단일 이미지 업로드 기능 */
export function SingleImageUploader({  elementType,onUpdateImage, sellerId, onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const imageRef = useRef(null);

  // 이미지 업로드 (미리보기)
  function imageUpload(e) {
    if (!imageRef.current) return;

    const file = e.currentTarget.files[0];
    if (!file || !file.type.startsWith('image/')) {
      return alert('확장자가 .png, .jpeg, .svg 등의 이미지 형식만 가능합니다.');
    }

    // 미리보기 이미지 생성
    const imgSrc = URL.createObjectURL(file);
    setPreview(imgSrc);
    setSelectedFile(file);
    setFileName(`${sellerId}_headerlogo.png`); // 파일명 설정

    onUpdateImage(imgSrc);
  }

  // 서버 업로드
  const handleUpload = async () => {
    if (!selectedFile || !sellerId || !elementType) {
        alert("이미지 또는 판매자 ID가 없습니다.");
        return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sellerId", sellerId);
    formData.append("type", elementType); // ✅ header 또는 banner 구분

    try {
        const response = await fetch("http://localhost:5000/seller/upload", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Upload failed:", data);
            alert(`업로드 실패: ${data.error}`);
            return;
        }

        // ✅ 업로드된 파일 URL 설정
        const uploadedUrl = `/uploads/${sellerId}_${elementType === "header" ? "headerlogo" : "banner"}.png`;

        console.log("🚀 서버 업로드 성공:", uploadedUrl);

        onUpload(uploadedUrl, data.fileName); // ✅ `handleLogoUpload()` 또는 `handleBannerUpload()` 호출

    } catch (error) {
        console.error("Upload failed:", error);
        alert("이미지 업로드 실패. 다시 시도해주세요.");
    }
};

  // 이미지 제거
  function handleDeleteImage() {
    onUpdateImage(null);
    setPreview(null);
    setSelectedFile(null);
    setFileName('');
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className='relative space-y-2'>
      {/* 업로드 인풋 */}
      <label
        ref={imageRef}
        htmlFor='uploader-single'
        className='cursor-pointer mt-2 w-full h-[128px] border border-[#75b5ff] flex items-center justify-center rounded-2xl'
      >
        {preview ? (
          <img src={preview} alt='미리보기 이미지' className='w-full h-full' />
        ) : (
          <IoImageOutline className='w-12 h-12 text-[#4294F2]' />
        )}
      </label>
      <input
        onChange={imageUpload}
        id='uploader-single'
        type='file'
        className={'appearance-none hidden'}
        accept='image/*'
        required
      />

      {/* 파일명 표시 */}
      {fileName && <p className="text-sm text-gray-600">파일명: {fileName}</p>}

      {/* 업로드 버튼 */}
      {selectedFile && (
        <button
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          서버에 업로드
        </button>
      )}

      {/* 삭제 버튼 */}
      <button
        title='제거 버튼'
        className='absolute right-1 top-1 rounded-[3px] text-md p-1 flex gap-2 items-center justify-end hover:cursor-pointer text-[#4294F2]'
        onClick={handleDeleteImage}
      >
        <IoTrash />
      </button>
    </div>
  );
}/** 다중 이미지 업로드 기능 */
export function MultipleImageUploader({  elementType,sellerId, onUpload }) {
  const [selectedFiles, setSelectedFiles] = useState([]); // 선택된 파일 리스트
  const [previews, setPreviews] = useState([]); // 미리보기 URL 리스트
  const [fileNames, setFileNames] = useState([]); // 파일명 리스트
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const imageRef = useRef(null);

  // 이미지 업로드 (미리보기)
  function imageUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const newPreviews = [];
    const newFileNames = [];
    const newFiles = [];

    files.forEach((file, index) => {
      if (!file.type.startsWith('image/')) {
        alert('확장자가 .png, .jpeg, .svg 등의 이미지 형식만 가능합니다.');
        return;
      }

      const imgSrc = URL.createObjectURL(file);
      newPreviews.push(imgSrc);
      newFileNames.push(`${sellerId}_image${selectedFiles.length + index + 1}.png`);
      newFiles.push(file);
    });

    setPreviews([...previews, ...newPreviews]);
    setFileNames([...fileNames, ...newFileNames]);
    setSelectedFiles([...selectedFiles, ...newFiles]);
  }

  // 서버 업로드
  const handleUpload = async () => {
    if (!selectedFiles.length || !sellerId) return alert('이미지 또는 판매자 ID가 없습니다.');

    setIsUploading(true);
    try {
      const uploadedFiles = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('file', selectedFiles[i]);
        formData.append('sellerId', sellerId);

        const response = await fetch('http://localhost:5000/seller/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('업로드 실패');
        }

        const data = await response.json();
        uploadedFiles.push({ url: data.url, fileName: data.fileName });
      }

      onUpload(uploadedFiles);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('이미지 업로드 실패. 다시 시도해주세요.');
    } finally {
      setIsUploading(false);
    }
  };

  // 개별 이미지 삭제
  function handleDeleteImage(index) {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedFileNames = fileNames.filter((_, i) => i !== index);

    setPreviews(updatedPreviews);
    setSelectedFiles(updatedFiles);
    setFileNames(updatedFileNames);
  }

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, [previews]);

  return (
    <div className="relative space-y-2">
      {/* 업로드 인풋 */}
      <label
        ref={imageRef}
        htmlFor="uploader-multiple"
        className="cursor-pointer mt-2 w-full h-[128px] border border-[#75b5ff] flex items-center justify-center rounded-2xl"
      >
        <IoImageOutline className="w-12 h-12 text-[#4294F2]" />
      </label>
      <input
        onChange={imageUpload}
        id="uploader-multiple"
        type="file"
        className="appearance-none hidden"
        accept="image/*"
        multiple
      />

      {/* 미리보기 */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative w-24 h-24 border border-gray-300 rounded-lg overflow-hidden">
              <img src={preview} alt={`미리보기 ${index}`} className="w-full h-full object-cover" />
              <button
                title="이미지 제거"
                className="absolute right-1 top-1 bg-white rounded-full p-1 text-red-500"
                onClick={() => handleDeleteImage(index)}
              >
                <IoTrash />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 파일명 표시 */}
      {fileNames.length > 0 &&
        fileNames.map((name, index) => <p key={index} className="text-sm text-gray-600">파일명: {name}</p>)}

      {/* 업로드 버튼 */}
      {selectedFiles.length > 0 && (
        <button
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          disabled={isUploading}
        >
          {isUploading ? '업로드 중...' : '서버에 업로드'}
        </button>
      )}
    </div>
  );
}







export function SingleProductImageUploader({
  elementType,
  elementId,
  onUpdateImage = () => {},  // 기본값을 빈 함수로 설정
  sellerId,
  onUpload
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [fileName, setFileName] = useState('');
  const imageRef = useRef(null);

  // 이미지 업로드 (미리보기)
  function imageUpload(e) {
    const file = e.currentTarget.files[0];
    if (!file) return;
  
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    if (!isImage && !isVideo) {
      return alert('이미지 또는 mp4, webm, ogg 형식의 동영상만 업로드 가능합니다.');
    }
  
    const extension = file.name.split('.').pop();
    const customFileName = `${sellerId}_${elementId}.${extension}`;
    const renamedFile = new File([file], customFileName, { type: file.type });
  
    const src = URL.createObjectURL(renamedFile);
    setPreview(src);
    setSelectedFile(renamedFile);
    setFileName(customFileName);
  
    onUpdateImage(src);
  }
  

  // 서버 업로드
  const handleUpload = async () => {
    if (!selectedFile || !sellerId || !elementId) {
      alert("필수 항목이 누락되었습니다.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sellerId", sellerId);
    formData.append("elementId", elementId);  // elementId 전달
    formData.append("type", elementType);  // 기존 type은 전달하지 않아도 됨
  
    try {
      const response = await fetch("http://localhost:5000/seller/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error("Upload failed:", data);
        alert(`업로드 실패: ${data.error}`);
        return;
      }
  
      const uploadedUrl = `/uploads/${fileName}`;
      onUpload(uploadedUrl, fileName);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("이미지 업로드 실패. 다시 시도해주세요.");
    }
  };

  function handleDeleteImage() {
    onUpdateImage(null);
    setPreview(null);
    setSelectedFile(null);
    setFileName('');
  }

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="relative space-y-2">
      <label
        ref={imageRef}
        htmlFor="uploader-single"
        className="cursor-pointer mt-2 w-full h-[128px] border border-[#75b5ff] flex items-center justify-center rounded-2xl"
      >
{preview ? (
  preview.match(/\.(mp4|webm|ogg)$/i) ? (
    <video src={preview} className="w-full h-full object-cover" autoPlay muted loop />
  ) : (
    <img src={preview} alt="미리보기 이미지" className="w-full h-full object-cover" />
  )
) : (
  <IoImageOutline className="w-12 h-12 text-[#4294F2]" />
)}

      </label>
      <input
        onChange={imageUpload}
        id="uploader-single"
        type="file"
        className="appearance-none hidden"
        accept="image/*,video/mp4,video/webm,video/ogg"
        required
      />

      {fileName && <p className="text-sm text-gray-600">파일명: {fileName}</p>}

      {selectedFile && (
        <button
          onClick={handleUpload}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          서버에 업로드
        </button>
      )}

      <button
        title="제거 버튼"
        className="absolute right-1 top-1 rounded-[3px] text-md p-1 flex gap-2 items-center justify-end hover:cursor-pointer text-[#4294F2]"
        onClick={handleDeleteImage}
      >
        <IoTrash />
      </button>
    </div>
  );
}