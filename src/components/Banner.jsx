import React from "react";

const Banner = ({ title, subtitle, backgroundColor, imageUrl }) => {


  const fullImgUrl = imageUrl ? `http://localhost:5000${imageUrl}` : null;

  return (
    <div style={{ backgroundColor, textAlign: "center", color: "white" }}>
<h2 style={{ fontSize: '28px', color: '#4294F2', fontWeight: 'bold' }}>{title}</h2>

      <p>{subtitle}</p>
      <img
        src={fullImgUrl}
        alt="배너 이미지"
        style={{ width: "100%", height: "auto", objectFit: "cover", marginTop: "10px" }}
        />
    </div>
  );
};

export default Banner;
