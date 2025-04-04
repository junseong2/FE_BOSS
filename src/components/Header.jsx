import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Header({
  backgroundColor,
  logoUrl,
  menuItems = [],
  fontFamily = "inherit",
  fontSize = "16px",
  fontWeight = "normal",
  top = 100
}) {
  const navigate = useNavigate();
  const { storename } = useParams();
  const fullLogoUrl = logoUrl ? `http://localhost:5000${logoUrl}` : null;

  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > top);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [top]);

  const handleCategoryClick = (category) => {
    navigate(`/${category.toLowerCase()}`);
  };

  return (
    <div
      className={`w-full shadow-md z-50 transition-all duration-300 ${
        isSticky ? "fixed left-0 right-0 top-[80px]" : "relative"
      }`}
      style={{ backgroundColor }}
    >
      <div
        className="w-full flex items-center justify-between px-6 py-4 relative"
        style={{ minHeight: "100px" }} // 헤더 높이 확보
      >
        {/* 왼쪽 메뉴 */}
        <div className="flex gap-6">
        {menuItems.map((item, idx) => {
  const label = typeof item === "string" ? item : item.title;
  const url = typeof item === "string" ? `/${item.toLowerCase()}` : item.url;

            return (
              <button
              key={`${label}-${idx}`}
              onClick={() =>
                  url.startsWith("http")
                    ? (window.location.href = url)
                    : navigate(`/${storename}${url}`)
                }
                className="px-2 py-1 text-black hover:opacity-75 transition"
                style={{ fontSize, fontFamily, fontWeight }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* 중앙 로고 */}
        {fullLogoUrl && (
          <a
            href="/"
            className="absolute left-1/2 transform -translate-x-1/2"
            style={{ maxWidth: "250px" }}
          >
            <img
              src={fullLogoUrl}
              alt="로고"
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "70px", // 튀어나오지 않게 조절
              }}
            />
          </a>
        )}

        {/* 오른쪽 여백 (중앙 정렬 유지용) */}
        <div className="w-[250px]"></div>
      </div>
    </div>
  );
}

export default Header;
