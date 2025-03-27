import React from "react";

const ProductGrid = ({ title, columns, sortList }) => {
  return (
    <section style={{ padding: "20px" }}>
      <h2>{title}</h2>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: "10px", marginTop: "10px" }}>
        {/* 임시 상품 카드 */}
        <div style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>상품 1</div>
        <div style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>상품 2</div>
        <div style={{ border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>상품 3</div>
      </div>
    </section>
  );
};

export default ProductGrid;
