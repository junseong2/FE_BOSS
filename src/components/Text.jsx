export default function Text({ content,  fontFamily,  fontSize, fontWeight, color, textAlign }) {
    return (
      <div
        className="w-full p-2"
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
  