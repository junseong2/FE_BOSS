export default function ImageBox({ imageUrl, alt }) {
  const fullImgUrl = imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;

  return (
    <div className="w-full flex justify-center items-center p-2 overflow-hidden max-h-[500px]">
      <img
        src={fullImgUrl}
        alt={alt || '이미지'}
        className="w-full h-full object-contain rounded"
      />
    </div>
  );
}
