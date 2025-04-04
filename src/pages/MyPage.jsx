import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { IoHeartOutline } from "react-icons/io5";

import '../App.css';
import './styles/mypage.css';
import { UsersRoundIcon } from 'lucide-react';
import Input from "../components/input";
import { IoPersonCircleSharp as User } from "react-icons/io5";
import { IoBagHandleOutline as ShoppingBag, IoCardOutline as CreditCard, IoNotificationsOutline as Bell, IoSettingsOutline as Settings, IoLogOutOutline as LogOut } from "react-icons/io5";

function MyPage() {
  const [orders, setOrders] = useState([]); // 주문 데이터를 저장할 state

  const [userId, setUserId] = useState(null);
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState("profile"); // ✅ 현재 활성화된 탭 상태 추가

  const [emails, setEmails] = useState(['']);
  const [phones, setPhones] = useState(['', '', '']);
  const [addresses, setAddresses] = useState([
    { address1: '', address2: '', post: '', isDefault: false },
  ]);
  const navigate = useNavigate();
  const Card = ({ children, className = "", ...props }) => {
    return (
      <div className={`bg-white rounded-lg border shadow-sm ${className}`} {...props}>
        {children}
      </div>
    )
  }

  
  const Button = ({ children, className = "", ...props }) => {
    return (
      <button className={`px-4 py-2 rounded-md font-medium text-white ${className}`} {...props}>
        {children}
      </button>
    )
  }
  
const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ children, className = "", ...props }) => {
  return (
    <h3 className={`text-xl font-semibold ${className}`} {...props}>
      {children}
    </h3>
  )
}

const CardContent = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 pt-0 ${className}`} {...props}>
      {children}
    </div>
  )
}

const Tabs = ({ children, defaultValue, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <div {...props}>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab, className = "", ...props }) => {
  return (
    <div className={`flex space-x-1 rounded-md bg-gray-100 p-1 ${className}`} {...props}>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          active: activeTab === child.props.value,
          onClick: () => setActiveTab(child.props.value),
        })
      })}
    </div>
  )
}

const TabsTrigger = ({ children, value, active, onClick, className = "", ...props }) => {
  return (
    <button
      className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${active ? "bg-white shadow" : "text-gray-600 hover:text-gray-900"} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeTab, className = "", ...props }) => {
  if (value !== activeTab) return null

  return (
    <div className={`mt-2 ${className}`} {...props}>
      {children}
    </div>
  )
}


  useEffect(() => {
    fetchUserInfo();
  }, []);
/*
  useEffect(() => {
    if (userId === null) {
      navigate('/signin');
    }
  }, [userId, navigate]);
*/


const fetchOrders = async () => {
  try {
    const response = await fetch(`http://localhost:5000/orders/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error("주문 내역 조회 실패");
    }
    const ordersData = await response.json();
    console.log("주문내역조회",ordersData);
    setOrders(ordersData);
  } catch (error) {
    console.error("❌ 주문 내역 조회 오류:", error.message);
  }
};

useEffect(() => {
  if (activeTab === "orders" && userId) {
    fetchOrders();
  }
}, [activeTab, userId]);
  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/user-info', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.status === 403) {
        console.warn('❌ 로그인 정보 없음. 로그인 페이지로 이동.');
        navigate('/signin');
        return;
      }

      if (!response.ok) {
        throw new Error('로그인 정보 조회 실패');
      }

      const data = await response.json();
      setUserId(data.userId);
      setUserName(data.userName);

    } catch (error) {
      console.error('❌ 사용자 정보 조회 오류:', error.message);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userId) {
      alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    const requestData = {
      userId: Number(userId),
      email: emails[0],
      password,
      phones: phones.filter(Boolean),
      addresses: addresses.map((addr) => ({
        address1: addr.address1,
        address2: addr.address2,
        post: addr.post,
        isDefault: addr.isDefault,
      })),
    };

    try {
      const response = await fetch('http://localhost:5000/auth/update-userinfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`회원 정보 수정 실패: ${errorText}`);
      }

      alert('회원 정보가 수정되었습니다!');
      navigate('/home');
    } catch (error) {
      console.error('❌ 회원 정보 수정 오류:', error);
      alert(`오류 발생: ${error.message}`);
    }
  };

  const handleAddressSearch = (index) => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        const newAddresses = [...addresses];
        newAddresses[index].address1 = data.roadAddress;
        newAddresses[index].post = data.zonecode;
        setAddresses(newAddresses);
      },
    }).open();
  };
  return (
    <div className="min-h-screen bg-[#e6f0ff]">






      {/* 사용자 정보 */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 사이드바 */}





          <div className="w-full md:w-64">
  <Card>
    <CardHeader className="pb-4">
      <CardTitle className="text-lg font-medium">사용자 정보</CardTitle>
    </CardHeader>
    <CardContent className="block">
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-2">
          <User className="h-10 w-10 text-blue-500" />
        </div>
        <h3 className="font-medium">{userName}</h3> {/* name → userName으로 수정 */}
        <p className="text-sm text-muted-foreground">
          사용자 ID: {userId ? userId : "로그인 필요"}
        </p>
      </div>










      {/* 네비게이션 수정 부분 */}
      <div className="flex flex-col space-y-2"> 



      <button
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium 
                  ${activeTab === "profile" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                  onClick={() => setActiveTab("profile")}
                >
          <User className="h-5 w-5" />
          <span>프로필 정보</span>
          </button>





          <button
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium 
                  ${activeTab === "orders" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                  onClick={() => setActiveTab("orders")}
                >
                  <ShoppingBag className="h-5 w-5" />
                  <span>주문 내역</span>
                </button>

                <button
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-md font-medium 
                  ${activeTab === "followedStores" ? "bg-blue-50 text-blue-700" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                  onClick={() => setActiveTab("followedStores")}
                >
              
              <IoHeartOutline className="h-5 w-5" />
                  <span>팔로우 상점 정보</span>
                </button>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Bell className="h-4 w-4" />
                    <span>알림 설정</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <Settings className="h-4 w-4" />
                    <span>계정 설정</span>
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>로그아웃</span>
                  </a>
                </div>





              </CardContent>
            </Card>
          </div>
  
  
  
  
  
  
          {/* 메인 콘텐츠 */}
          <div className="flex-1">
            <Card>
              <CardHeader>
                <CardTitle>마이페이지</CardTitle>




              </CardHeader>
              <CardContent>

              {activeTab === "profile" && (
                <Tabs defaultValue="profile">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="profile">기본 정보</TabsTrigger>
                    <TabsTrigger value="security">보안</TabsTrigger>
                    <TabsTrigger value="preferences">환경설정</TabsTrigger>
                  </TabsList>
  
  
  
  
  
  
  
  
                  <TabsContent value="profile" className="space-y-4 mt-4">
                    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">마이페이지</h2>
      <form onSubmit={handleUpdate} className="space-y-4">
        <label className="block text-gray-700">이름</label>
        <input className="w-full p-2 border rounded" type="text" value={userName} disabled />

        <label className="block text-gray-700">비밀번호</label>
        <input className="w-full p-2 border rounded" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label className="block text-gray-700">이메일</label>
        {emails.map((email, index) => (
          <input key={index} className="w-full p-2 border rounded" type="email" value={email} onChange={(e) => {
            const newEmails = [...emails];
            newEmails[index] = e.target.value;
            setEmails(newEmails);
          }} required />
        ))}
        <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setEmails([...emails, ''])}>이메일 추가</button>

        <label className="block text-gray-700">전화번호</label>
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              className="w-full p-2 border rounded"
              type="text"
              maxLength={i === 0 ? 3 : 4}
              placeholder={["010", "0000", "0000"][i]}
              value={phones[i] || ""}
              onChange={(e) => {
                const newPhones = [...phones];
                newPhones[i] = e.target.value;
                setPhones(newPhones);
              }}
            />
          ))}
        </div>

        <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setPhones([...phones, ''])}>전화번호 추가</button>

        <label className="block text-gray-700">주소</label>
        {addresses.map((address, index) => (
          <div key={index}>
            <input className="w-full p-2 border rounded" type="text" placeholder="주소1" value={address.address1} readOnly />
            <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => handleAddressSearch(index)}>주소 검색</button>

            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="주소2 (상세주소)"
              value={address.address2}
              onChange={(e) => {
                const newAddresses = [...addresses];
                newAddresses[index].address2 = e.target.value;
                setAddresses(newAddresses);
              }}
            />
            <input className="w-full p-2 border rounded" type="text" placeholder="우편번호" value={address.post} readOnly />
            <label className="block">
              <input
                type="checkbox"
                checked={address.isDefault}
                onChange={() => {
                  const newAddresses = [...addresses];
                  newAddresses[index].isDefault = !newAddresses[index].isDefault;
                  setAddresses(newAddresses);
                }}
              />
              기본 주소
            </label>
          </div>
        ))}
        {addresses.length < 3 && (
          <button type="button" className="bg-blue-500 text-white p-2 rounded" onClick={() => setAddresses([...addresses, { address1: '', address2: '', post: '', isDefault: false }])}>
            주소 추가
          </button>
        )}
  
        <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">정보 수정</button>
      </form>
  
      <button className="mt-4 w-full bg-gray-500 text-white p-2 rounded" onClick={() => navigate('/')}>홈으로 돌아가기</button>
    </div>
                  </TabsContent>
  
  
  
  
  
  
  
  
  
                  <TabsContent value="security" className="space-y-4 mt-4">
                    <div>
                      <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                        현재 비밀번호
                      </label>
                      <Input id="current-password" type="password" placeholder="••••••••" className="w-full" autoComplete="current-password" />
                      </div>
  
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호
                      </label>
                      <Input id="new-password" type="password" placeholder="••••••••" className="w-full" />
                    </div>
  
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                        비밀번호 확인
                      </label>
                      <Input id="confirm-password" type="password" placeholder="••••••••" className="w-full" />
                    </div>
  
                    <div className="pt-4">
                      <Button className="bg-blue-500 hover:bg-blue-600">비밀번호 변경</Button>
                    </div>
                  </TabsContent>
  
                  <TabsContent value="preferences" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">마케팅 이메일</h4>
                          <p className="text-sm text-muted-foreground">프로모션 및 업데이트 정보를 이메일로 받기</p>
                        </div>
                        <div className="h-6 w-11 bg-gray-200 rounded-full relative">
                          <div className="h-5 w-5 rounded-full bg-white absolute left-1 top-0.5"></div>
                        </div>
                      </div>
  
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">새 알림</h4>
                          <p className="text-sm text-muted-foreground">새로운 활동에 대한 알림 받기</p>
                        </div>
                        <div className="h-6 w-11 bg-blue-500 rounded-full relative">
                          <div className="h-5 w-5 rounded-full bg-white absolute right-1 top-0.5"></div>
                        </div>
                      </div>
  
                      <div className="pt-4">
                        <Button className="bg-blue-500 hover:bg-blue-600">설정 저장</Button>
                      </div>
                    </div>
                  </TabsContent>











                </Tabs>

)}



{activeTab === "orders" && (
  <div className="p-6 bg-white shadow-lg rounded-lg mt-10 max-w-4xl mx-auto">
    {/* 헤더 영역 */}
    <h2 className="text-2xl font-bold mb-6">주문목록</h2>

    {/* 검색 영역 */}
    <div className="flex items-center mb-4 gap-2">
      <input
        type="text"
        placeholder="주문한 상품을 검색할 수 있어요!"
        className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-blue-500"
      />
      <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
        검색
      </button>
    </div>

    {/* 주문 목록 */}


    {(() => {// 목데이터 정의// 목데이터 (API 응답 형식과 동일)
const mockOrders = [
  {
    orderId: 1001,
    totalPrice: 25470,
    status: "배송완료",
    createdDate: "2025-03-14T00:00:00.000Z",
    user: {
      userId: 10,
      username: "정재훈",
      email: "ddd@gmail.com"
    },
    // 주문 상품 정보가 없는 경우, 임시로 items 배열을 넣거나 빈 배열로 처리할 수 있습니다.
    items: [
      {
        name: "샌디스크 크루저 울트라 플레어 3.0 USB SDCZ73-512G-G46",
        price: 25470,
        quantity: 1,
        imageUrl: "https://via.placeholder.com/80"
      }
    ]
  },
  // 추가 목데이터가 필요하면 동일 형식으로 추가
];

// orders 배열에 데이터가 있으면 orders, 없으면 mockOrders 사용
const displayOrders = orders.length > 0 ? orders : mockOrders;

return (
  <div>
    {/* 연도 필터/개수 표시 영역 */}
    <div className="flex items-center text-sm text-gray-600 gap-2 mb-8">
      <span className="text-blue-600 font-medium">전체 {displayOrders.length}개</span>
      <span>|</span>
      <button className="hover:underline">2023</button>
      <span>|</span>
      <button className="hover:underline">2024</button>
      <span>|</span>
      <button className="hover:underline">2025</button>
    </div>

    {/* 주문 목록 */}
    <div>
      {displayOrders.map((order) => (
        <div key={order.orderId} className="mb-8 border-b pb-6">
          {/* 주문 날짜 / 상세보기 링크 */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 text-base font-medium">
              {new Date(order.createdDate).toLocaleDateString()} 주문
            </span>
            <a href="#" className="text-sm text-blue-500 hover:underline">
              주문 상세보기
            </a>
          </div>

          {/* 주문 정보: 상태와 총 가격 */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
            <div className="text-sm">
              <span className="text-blue-600 font-semibold mr-2">
                {order.status}
              </span>
              <span className="text-gray-500">
                총 금액: {order.totalPrice.toLocaleString()} 원
              </span>
            </div>
            <div className="flex gap-2">
              <button className="border px-3 py-1 rounded hover:bg-gray-100 text-sm">
                교환, 반품 신청
              </button>
              <button className="border px-3 py-1 rounded hover:bg-gray-100 text-sm">
                리뷰 작성하기
              </button>
              <button className="border px-3 py-1 rounded hover:bg-gray-100 text-sm">
                판매자 문의
              </button>
            </div>
          </div>

          {/* 주문 상품 리스트 (items가 없을 수도 있으므로 기본값 사용) */}
          {(order.items || []).map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 mt-4">
              {/* 상품 이미지 */}
              <img
                src={item.imageUrl}
                alt="상품 이미지"
                className="w-20 h-20 object-cover rounded-md border"
              />
              {/* 상품 정보 */}
              <div className="flex-1">
                <p className="text-gray-700 font-medium">{item.name}</p>
                <p className="text-gray-500">
                  가격: {item.price.toLocaleString()} 원
                </p>
                <p className="text-gray-500">
                  수량: {item.quantity}개
                </p>
              </div>
              {/* 장바구니 버튼 */}
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm">
                장바구니 담기
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);






    })()}
  </div>
)}





  {activeTab === "followedStores" && (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">팔로우 상점 정보</h2>
      <p>여기에 팔로우한 상점 정보를 표시합니다.</p>
      {/* 팔로우 상점 목록 컴포넌트 */}
    </div>
  )}
              </CardContent>
            </Card>
          </div>







        </div>
      </div>
    </div>
  );
  




}

export default MyPage;