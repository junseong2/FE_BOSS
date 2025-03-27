import { useNavigate } from "react-router-dom";

function Header({ title, backgroundColor, logoUrl, menuItems = [] }) {
  const navigate = useNavigate();
  console.log("📌 Header - menuItems 값:", menuItems);

  const fullLogoUrl = logoUrl ? `http://localhost:5000${logoUrl}` : null;

  const handleCategoryClick = (category) => {
    console.log(`📌 ${category} 버튼 클릭됨!`);
    navigate(`/${category.toLowerCase()}`);
  };

  return (
    <div className="w-full shadow-md" style={{ backgroundColor }}>
      {/* ✅ 헤더 컨테이너 (로고 왼쪽 + 네비 우측 정렬) */}
      <div className="w-full flex items-center justify-between px-6 py-3">
        
        {/* ✅ 왼쪽: 로고 */}
        {fullLogoUrl && (
          <a href="/" className="block" style={{ width: "auto", maxWidth: "250px" }}>
            <img
              src={fullLogoUrl}
              alt="로고"
              style={{ display: "block", width: "100%", height: "auto", maxHeight: "80px" }}
            />
          </a>
        )}

        {/* ✅ 오른쪽: 네비게이션 버튼 */}
        <div className="flex gap-4">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleCategoryClick(item)}
              className="px-4 py-2 text-black hover:opacity-75 transition"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontSize: "16px",
              }}
            >
              {item}
            </button>
          ))}
        </div>
        
      </div>
    </div>
  );
}

export default Header;
