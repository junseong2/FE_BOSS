import { createContext, useContext, useState, useEffect } from "react";
import { BASE_URL } from "../lib/api";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);// ✅ 로그인 모달 상태 추가
  const [role, setRole] = useState(null); 
  const [storeName, setStoreName] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // ✅ 추천 상품 상태

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch(BASE_URL+`/auth/user-info`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("로그인 정보 없음");
        const data = await response.json();
        setUserId(data.userId);
        setUserName(data.userName);
      } catch (error) {
        setUserId(null);
        setUserName(null);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    //컨텍스트에 recommendedProducts 추가함.250403 - 서상훈
    <UserContext.Provider value={{ userId, setUserId, userName, setUserName, recommendedProducts,
      setRecommendedProducts,  role,  setRole , storeName,         
      setStoreName  }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
