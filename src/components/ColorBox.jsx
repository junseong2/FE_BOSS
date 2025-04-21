export default function ColorBox({
  backgroundColor = '#f0f0f0',
  size = { web: { width: '100%', height: '100px' } }, 
  borderRadius = '0px',
}) {
  const { width, height } = size.web || {};

  return (
    <div
      style={{
        width,
        height,
        backgroundColor,
        borderRadius,
      }}
    />
  );
}
