import { IoSaveOutline } from 'react-icons/io5';
import { updateSellerSettings ,updateSellerMobileSettings} from '../../../../utils/usercustomui'; 

export default function EditorHeader({ elements,  editedElement, sellerId , onUpdate , onSave}) {



// 변경사항 저장 함수
const handleSaveChanges = async () => {
  try {

    console.log("🔍 EditorHeader에서 받은 elements: by EditorHeader", elements);

    if (!sellerId) {
      console.error("❌ 판매자 ID를 찾을 수 없습니다.");
      alert("로그인이 필요합니다.");
      return;
    }

    if (!elements || elements.length === 0) {
      console.error("❌ 저장할 elements가 없습니다.");
      alert("저장할 데이터가 없습니다.");
      return;
    }


// 수정 코드
const settingsToSave = elements.map(element => {
  const baseProperties = {
    // 공통 필드
    id: element.id,
    title: element.properties.title,
    backgroundColor: element.properties.backgroundColor,
  };

  // 타입별 추가 필드 처리
  switch(element.type) {
    case 'header':
      return {
        type: 'header',
        properties: {
          ...baseProperties,
          logoUrl: element.properties.logoUrl,
          menuItems: element.properties.menuItems,
          categories: element.properties.categories,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
    case 'banner':
      return {
        type: 'banner',
        properties: {
          ...baseProperties,
          subtitle: element.properties.subtitle,
          imageUrl: element.properties.imageUrl,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
    case 'grid':
      return {
        type: 'grid',
        properties: {
          ...baseProperties,
          columns: element.properties.columns,
          sortList: element.properties.sortList,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
    default:
      return element;
  }
});











    console.log("📤 최종 요청 데이터 (settings) by EditorHeader:", {
      sellerId,
      settings: settingsToSave,
    });
    console.log("💾 저장 실행: 현재 elements 상태 by EditorHeader", settingsToSave);




   

    elements.forEach((el) => {
      if (el.type === "header") {
        console.log("✅ 헤더 이미지 URL (저장 전):", el.properties.logoUrl); // ✅ 확인용 로그

        settingsToSave.header = {
          title: el.properties.title || "",
          logoUrl: el.properties.logoUrl || "",
          menuItems: el.properties.menuItems || [],
          categories: el.properties.categories || [],
          backgroundColor: el.properties.backgroundColor || "#ffffff", 
        };
      }

      if (el.type === "banner") {
        console.log("✅ 배너 이미지 URL (저장 전):", el.properties.imageUrl); // ✅ 확인용 로그

        settingsToSave.banner = {
          title: el.properties.title || "",
          subtitle: el.properties.subtitle || "",
          imageUrl: el.properties.imageUrl || "",
          backgroundColor: el.properties.backgroundColor || "#ffffff",
        };
      }



      if (el.type === "grid") {
        console.log("✅ 그리드 정보 (저장 전):", el.properties); // ✅ 확인용 로그
      
        settingsToSave.grid = {
          title: el.properties.title || "추천 상품", // 기본값 "추천 상품"
          columns: el.properties.columns || 3, // 기본값 3
          sortList: el.properties.sortList || [], // 기본값 빈 배열
        };}

      
    });

    console.log("📤 최종 요청 데이터 (settings) by EditorHeader:", {
      sellerId,
      settings: settingsToSave,
    }
  
  );

    // ✅ API 호출
    const response = await updateSellerSettings(sellerId, settingsToSave);

    if (response && response.message) {
      console.log("✅ 설정이 성공적으로 저장되었습니다:", response);
      console.log("✅ 설정이 성공적으로 저장되었습니다2:", settingsToSave);
      alert("설정이 성공적으로 저장되었습니다!");
    } else {
      console.error("❌ 서버 응답 오류:", response);
      alert("설정 저장에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("❌ 설정 저장 실패:", error.message || error);
    alert("저장 중 오류가 발생했습니다.");
  }
};






// 변경사항 저장 함수
const handleMobileSaveChanges = async () => {
  try {

    console.log("🔍 EditorHeader에서 받은 elements: by EditorHeader", elements);

    if (!sellerId) {
      console.error("❌ 판매자 ID를 찾을 수 없습니다.");
      alert("로그인이 필요합니다.");
      return;
    }

    if (!elements || elements.length === 0) {
      console.error("❌ 저장할 elements가 없습니다.");
      alert("저장할 데이터가 없습니다.");
      return;
    }


// 수정 코드


























const mobilesettingsToSave = elements.map(element => {
  const baseProperties = {
    // 공통 필드
    id: element.id,
    title: element.properties.title,
    backgroundColor: element.properties.backgroundColor,
  };

  // 타입별 추가 필드 처리
  switch(element.type) {
    case 'mobileheader':
      return {
        type: 'mobileheader',
        properties: {
          ...baseProperties,
          logoUrl: element.properties.logoUrl,
          menuItems: element.properties.menuItems,
          categories: element.properties.categories,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
    case 'mobilebanner':
      return {
        type: 'mobilebanner',
        properties: {
          ...baseProperties,
          subtitle: element.properties.subtitle,
          imageUrl: element.properties.imageUrl,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
    case 'mobilegrid':
      return {
        type: 'mobilegrid',
        properties: {
          ...baseProperties,
          columns: element.properties.columns,
          sortList: element.properties.sortList,
          backgroundColor: element.properties.backgroundColor // 배경색 추가

        }
      };
      case 'mobileBottomNavigationBar':
        return {
          type: 'mobileBottomNavigationBar',
          properties: {
            ...baseProperties,
            backgroundColor: element.properties.backgroundColor, // 배경색 유지
            items: element.properties.items, // 네비게이션 항목 추가
          }
        };
      



    default:
      return element;
  }
});










    console.log("📤 최종 요청 데이터 (settings) by EditorHeader:", {
      sellerId,
      settings: mobilesettingsToSave,
    });
    console.log("💾 저장 실행: 현재 elements 상태 by EditorHeader", mobilesettingsToSave);




   

    elements.forEach((el) => {
      if (el.type === "mobileheader") {
        console.log("✅ 헤더 이미지 URL (저장 전):", el.properties.logoUrl); // ✅ 확인용 로그

        mobilesettingsToSave.mobileheader = {
          title: el.properties.title || "",
          logoUrl: el.properties.logoUrl || "",
          menuItems: el.properties.menuItems || [],
          categories: el.properties.categories || [],
          backgroundColor: el.properties.backgroundColor || "#ffffff", 
        };
      }

      if (el.type === "mobilebanner") {
        console.log("✅ 배너 이미지 URL (저장 전):", el.properties.imageUrl); // ✅ 확인용 로그

        mobilesettingsToSave.mobilebanner = {
          title: el.properties.title || "",
          subtitle: el.properties.subtitle || "",
          imageUrl: el.properties.imageUrl || "",
          backgroundColor: el.properties.backgroundColor || "#ffffff",
        };
      }



      if (el.type === "mobilegrid") {
        console.log("✅ 그리드 정보 (저장 전):", el.properties); // ✅ 확인용 로그
      
        mobilesettingsToSave.mobilegrid = {
          title: el.properties.title || "추천 상품", // 기본값 "추천 상품"
          columns: el.properties.columns || 3, // 기본값 3
          sortList: el.properties.sortList || [], // 기본값 빈 배열
        };}

        if (el.type === "mobileBottomNavigationBar") {
          console.log("✅ 바텀 네비게이션 정보 (저장 전):", el.properties); // ✅ 확인용 로그
        
          mobilesettingsToSave.mobilebottomNavigationBar = {
            items: el.properties.items || [
              { id: "nav-home", label: "홈", icon: "home" },
              { id: "nav-search", label: "검색", icon: "search" },
              { id: "nav-category", label: "카테고리", icon: "category" },
              { id: "nav-cart", label: "장바구니", icon: "shopping_cart" },
              { id: "nav-mypage", label: "마이페이지", icon: "person" },
            ], // 기본 네비게이션 항목 추가
            backgroundColor: el.properties.backgroundColor || "#ffffff", // 배경색 기본값 유지
          };
        }
        
      
    });

    console.log("📤 최종 요청 모바일 데이터 (settings) by EditorHeader:", {
      sellerId,
      mobilesettings: mobilesettingsToSave,
    }
  
  );

    // ✅ API 호출
    const response = await updateSellerMobileSettings(sellerId,mobilesettingsToSave);

    if (response && response.message) {
      console.log("✅ 설정이 성공적으로 저장되었습니다:", response);
      console.log("✅ 설정이 성공적으로 저장되었습니다2:", mobilesettingsToSave);
      alert("설정이 성공적으로 저장되었습니다!");
    } else {
      console.error("❌ 서버 응답 오류:", response);
      alert("설정 저장에 실패했습니다. 다시 시도해주세요.");
    }
  } catch (error) {
    console.error("❌ 설정 저장 실패:", error.message || error);
    alert("저장 중 오류가 발생했습니다.");
  }
};

  return (
<div className='w-full flex justify-between md:justify-end items-center p-2 md:p-4 bg-blue-500 text-white border-b border-gray-200'>
  <h2 className='text-lg font-semibold'>Editor</h2>

  <div className='flex gap-2 ml-auto'>
    <button
      onClick={handleSaveChanges} 
      className='bg-white px-4 h-[35px] rounded-[3px] flex items-center gap-2 text-[12.5px] font-medium shadow z-10 cursor-pointer'
    >
      <IoSaveOutline color='#4294F2' />
      <span className='text-[#4294F2]'>변경사항 저장</span>
    </button>

    <button
      onClick={handleMobileSaveChanges} 
      className='bg-white px-4 h-[35px] rounded-[3px] flex items-center gap-2 text-[12.5px] font-medium shadow z-10 cursor-pointer'
    >
      <IoSaveOutline color='#4294F2' />
      <span className='text-[#4294F2]'>모바일 변경사항 저장</span>
    </button>
  </div>
</div>

  );
}
