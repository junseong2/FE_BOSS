import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../lib/api";

function Header({
  backgroundColor,
  logoUrl,
  menuItems = [],
  fontFamily = "inherit",
  fontSize = "16px",
  fontWeight = "normal",
  top = 100,
  height = "100px", // ✅ height prop 추가
}) {
  const navigate = useNavigate();
  const { storename } = useParams();
  const fullLogoUrl = logoUrl ? BASE_URL+`${logoUrl}` : null;

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
      style={{ backgroundColor, height }} // ✅ height 적용
    >
      <div
        className="w-full flex items-center justify-between px-6 py-4 relative"
        style={{ height }} // ✅ 내부 컨테이너도 높이 통일
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
                maxHeight: "70px",
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
