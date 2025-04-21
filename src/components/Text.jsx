import { useEffect, useRef, useState } from 'react';
export default function Text({
  content,
  fontFamily,
  fontSize,
  fontWeight,
  color,
  textAlign,
  animate,
}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
      threshold: 0.1,
    });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  // ✅ 폰트 매핑
  const fontMap = {
    'Nanum Brush Script': "'Nanum Brush Script', cursive",
    'Nanum Gothic': "'Nanum Gothic', sans-serif",
    'Noto Sans KR': "'Noto Sans KR', sans-serif",
    Pretendard: "'Pretendard', sans-serif",
    'Spoqa Han Sans Neo': "'Spoqa Han Sans Neo', sans-serif",
    SUIT: "'SUIT', sans-serif",
    'Gmarket Sans': "'Gmarket Sans', sans-serif",
    'Apple SD Gothic Neo': "'Apple SD Gothic Neo', sans-serif",
    'IBM Plex Sans KR': "'IBM Plex Sans KR', sans-serif",
    Arial: 'Arial, sans-serif',
    Roboto: 'Roboto, sans-serif',
    'Poor Story': "'Poor Story', cursive",
    'East Sea Dokdo': "'East Sea Dokdo', cursive",
    'Yeon Sung': "'Yeon Sung', cursive",
    'Dancing Script': "'Dancing Script', cursive",
    'Great Vibes': "'Great Vibes', cursive",
    Pacifico: "'Pacifico', cursive",
    Satisfy: "'Satisfy', cursive",
    Parisienne: "'Parisienne', cursive",
    'Playfair Display': "'Playfair Display', serif",
    'Libre Baskerville': "'Libre Baskerville', serif",
    'Cormorant Garamond': "'Cormorant Garamond', serif",
    'DM Serif Display': "'DM Serif Display', serif",
  };

  return (
    <div
      ref={ref}
      className={`w-full p-2 transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        fontSize: fontSize || '16px',
        fontWeight: fontWeight || 'normal',
        fontFamily: fontMap[fontFamily] || fontFamily || 'Nanum Gothic',
        color: color || '#000',
        textAlign: textAlign || 'left',
      }}
    >
      {content}
    </div>
  );
}
