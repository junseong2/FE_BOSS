export default function ImageBox({ imageUrl, alt, borderRadius = '0px' }) {
  const fullUrl = imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  const isVideo = fullUrl?.match(/\.(mp4|webm|ogg)$/i); // 동영상 확장자 체크

  return (
    <div className="w-full h-full overflow-hidden">
      {isVideo ? (
        <video
          src={fullUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            borderRadius: borderRadius,
          }}
          autoPlay
          muted
          loop
        />
      ) : (
        <img
          src={fullUrl}
          alt={alt || '이미지'}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            borderRadius: borderRadius,
          }}
        />
      )}
    </div>
  );
}
