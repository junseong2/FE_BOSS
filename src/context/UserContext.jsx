import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // ✅ 로그인 모달 상태 추가
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/user-info", { credentials: "include" });
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
    <UserContext.Provider value={{ userId, setUserId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
