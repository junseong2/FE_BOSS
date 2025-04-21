import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../lib/api";

function Header2({
  title,
  backgroundColor,
  logoUrl,
  menuItems = [],
  fontFamily = "inherit",
  fontSize = "16px",
  fontWeight = "normal",  top = 100,
}) {
  const navigate = useNavigate();
  const { storename } = useParams();
  const fullLogoUrl = logoUrl ? BASE_URL+`${logoUrl}` : null;

  const [isSticky, setIsSticky] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > top) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    handleScroll(); // 초기에도 반영
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [top]); // top이 바뀔 경우도 대비


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
      <div className="w-full flex items-center justify-between px-4 py-2">
        {/* 로고 */}
        {fullLogoUrl && (
          <a
            href="/"
            className="block"
            style={{ width: "auto", maxWidth: "250px" }}
          >
            <img
              src={fullLogoUrl}
              alt="로고"
              style={{
                display: "block",
                width: "100%",
                height: "auto",
                maxHeight: "80px",
              }}
            />
          </a>
        )}

        {/* 메뉴 */}
        <div className="flex gap-4">
  {menuItems.map((item, idx) => {
    const label = typeof item === "string" ? item : item.title;
    const url = typeof item === "string" ? `/${item.toLowerCase()}` : item.url;

    return (
      <button
        key={`${label}-${idx}`} // ✅ 중복 방지
        onClick={() => {
          if (url.startsWith("http")) {
            window.location.href = url;
          } else {
            navigate(`/${storename}${url}`);
          }
        }}
        className="px-4 py-2 text-black hover:opacity-75 transition"
        style={{ fontSize, fontFamily, fontWeight }}
      >
        {label}
      </button>
    );
  })}
</div>

      </div>
    </div>
  );
}

export default Header2;
