import { useState } from 'react';
import { useInView } from 'react-intersection-observer';

export default function ImageBox({ imageUrl, alt, borderRadius = '0px' }) {
  const fullUrl = imageUrl?.startsWith('http') ? imageUrl : `http://localhost:5000${imageUrl}`;
  const isVideo = fullUrl?.match(/\.(mp4|webm|ogg)$/i);

  const [hasLoaded, setHasLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2, // 20% 보이면 inView true
  });

  return (
    <div ref={ref} className="w-full h-full overflow-hidden">
      {isVideo ? (
        <video
          src={fullUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            borderRadius,
            opacity: inView ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
          onLoadedData={() => setHasLoaded(true)}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
      ) : (
        <img
          src={fullUrl}
          alt={alt || '이미지'}
          onLoad={() => setHasLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'fill',
            display: 'block',
            borderRadius,
            opacity: inView ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        />
      )}
    </div>
  );
}
