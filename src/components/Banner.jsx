import React from "react";

const Banner = ({ title, subtitle, backgroundColor = "#000", imageUrl }) => {
  const fullImgUrl = imageUrl ? `http://localhost:5000${imageUrl}` : null;

  return (
    <div
      style={{
        backgroundColor,
        color: "white",
        textAlign: "center",
        overflow: "hidden",       
        width: "100%",     
        maxWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <div style={{ padding: "20px" }}>
        <h2 style={{ fontSize: "28px", color: "#4294F2", fontWeight: "bold" }}>
          {title}
        </h2>
        <p>{subtitle}</p>
      </div>

      {fullImgUrl && (
        <img
          src={fullImgUrl}
          alt="배너 이미지"
          style={{
            width: "100%",
            height: "auto",
            objectFit: "cover",
            display: "block",    
            maxHeight: "500px",
          }}
        />
      )}
    </div>
  );
};

export default Banner;
