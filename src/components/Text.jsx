import { useEffect, useRef, useState } from 'react';


export default function Text({ content, fontFamily, fontSize, fontWeight, color, textAlign, animate }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(!animate); // 애니메이션 안 쓸 경우 항상 보이게

  useEffect(() => {
    if (!animate) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={ref}
      className={`w-full p-2 transition-all duration-700 ease-in-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        fontSize: fontSize || '16px',
        fontWeight: fontWeight || 'normal',
        fontFamily: fontFamily || 'Nanum Gothic',
        color: color || '#000',
        textAlign: textAlign || 'left',
      }}
    >
      {content}
    </div>
  );
}
