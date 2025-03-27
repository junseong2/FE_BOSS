import React from "react";

const Banner = ({ title, subtitle, backgroundColor, imageUrl }) => {
  return (
    <div style={{ backgroundColor, padding: "20px", textAlign: "center", color: "white" }}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      <img
        src={imageUrl}
        alt="배너 이미지"
        style={{ width: "100%", height: "50vh", objectFit: "cover", marginTop: "10px" }}
      />
    </div>
  );
};

export default Banner;
