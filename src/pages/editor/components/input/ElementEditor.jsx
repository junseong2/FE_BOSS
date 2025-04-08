import { useState, useEffect, useRef } from 'react';
import Label from '../../../../components/Label';
import Input from '../../../../components/Input';
import { fetchSellerSettings } from '../../../../utils/usercustomui';
import { SingleImageUploader } from '../../../../components/ImageUploader';
import { updateSellerSettings } from '../../../../utils/usercustomui'; // ✅ API 호출 함수 추가
import { updateSellerMobileSettings } from '../../../../utils/usercustomui'; // ✅ API 호출 함수 추가
import { fetchSellerMobileSettings } from '../../../../utils/usercustomui';


export default function ElementEditor({ element, onUpdate, sellerId, categories, elements, setElements , onSizeChange}) {
  const [headerLogoUrl, setHeaderLogoUrl] = useState(`http://localhost:5000/uploads/${sellerId}_headerlogo.png`);
  const [headerLogoFile, setHeaderLogoFile] = useState(null);
  const isFirstLoad = useRef(true);
  //const [logoUrl, setLogoUrl] = useState(`http://localhost:5000/uploads/${sellerId}_headerlogo.png`);
  const [bannerUrl, setBannerUrl] = useState(`http://localhost:5000/uploads/${sellerId}_banner.png`);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const currentDevice = element.type.startsWith('mobile') ? 'mobile' : 'web';
  const currentSize = element.properties.size?.[currentDevice] || {};

  if (!sellerId) {
    console.error("❌ `sellerId`가 정의되지 않았습니다.");
    return <div>오류: 판매자 정보를 불러올 수 없습니다.</div>;
  }

  console.log("✅ `sellerId`가 정의되었습니다.");
  
  console.log("element", element); 
  // ✅ 헤더와 배너의 배경색 상태를 분리
  const [headerBackgroundColor, setHeaderBackgroundColor] = useState(
    element.type === "header" ? element.properties.backgroundColor || "#ffffff" : "#ffffff"
  );

  const [bannerBackgroundColor, setBannerBackgroundColor] = useState(
    element.type === "banner" ? element.properties.backgroundColor || "#ffffff" : "#ffffff"
  );

  const [MobileheaderBackgroundColor, setMobileHeaderBackgroundColor] = useState(
    element.type === "mobileheader" ? element.properties.backgroundColor || "#ffffff" : "#ffffff"
  );

  const [MobilebannerBackgroundColor, setMobileBannerBackgroundColor] = useState(
    element.type === "mobilebanner" ? element.properties.backgroundColor || "#ffffff" : "#ffffff"
  );


  // ✅ `useEffect`에서 헤더와 배너의 색상을 분리해서 로드
  console.log("📥 test elementaleditor:");



  useEffect(() => {
    if (!isFirstLoad.current){ 
      console.log("📥 !isFirstLoad.current:", data);

      return;


    }

    const loadSettings = async () => {
      try {
        const data = await fetchSellerSettings(sellerId);
        console.log("📥 불러온 설정 데이터:", data);

        if (data) {
          if (data.header && element.type === "header") {
            setHeaderBackgroundColor(data.header.backgroundColor);
            console.log("ElementEditor-headerData=",data);
           setHeaderLogoUrl(data.header.logoUrl || `/uploads/${sellerId}_headerlogo.png`); // ✅ headerLogoUrl 설정

          }
          if (data.banner && element.type === "banner") {
            setBannerBackgroundColor(data.banner.backgroundColor);
            console.log("ElementEditor-bannerData=",data);
          }
        }

        isFirstLoad.current = false;
      } catch (error) {
        console.error("❌ 설정 불러오기 실패:", error);
      }
    };

    loadSettings();
  }, [sellerId]);


  useEffect(() => {
    if (!isFirstLoad.current){ 
      console.log("📥 !isFirstLoad(mobile).current:", data);

      return;


    }

    const loadMobileSettings = async () => {
      try {
        const data = await fetchSellerMobileSettings(sellerId);
        console.log("📥 불러온 모바일 설정 데이터 by ElementEditor:", data);

        if (data) {
          if (data.header && element.type === "mobileheader") {
            setMobileHeaderBackgroundColor(data.header.backgroundColor);
            console.log("ElementEditor-headerData=",data);
           setHeaderLogoUrl(data.mobileheader.logoUrl || `/uploads/${sellerId}_mobileheaderlogo.png`); // ✅ headerLogoUrl 설정

          }
          if (data.banner && element.type === "mobilebanner") {
            setMobileBannerBackgroundColor(data.mobilebanner.backgroundColor);
            console.log("ElementEditor-mobilebannerData=",data);
          }
        }

        isFirstLoad.current = false;
      } catch (error) {
        console.error("❌ 설정 불러오기 실패:", error);
      }
    };

    loadMobileSettings();
  }, [sellerId]);

  // ✅ 헤더 배경색 변경 핸들러
  const handleHeaderColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`;
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return;

    setHeaderBackgroundColor(value);

    if (element.type === "header") {
      console.log("Header change")
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      };

      onUpdate(updatedElement);
    }
  };

    // ✅ 헤더 배경색 변경 핸들러
    const handleMobileHeaderColorChange = (value) => {
      if (!value.startsWith("#")) value = `#${value}`;
      if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return;
  
      setMobileHeaderBackgroundColor(value);
  
      if (element.type === "mobileheader") {
        const updatedElement = {
          ...element,
          properties: {
            ...element.properties,
            backgroundColor: value,
          },
        };
  
        onUpdate(updatedElement);
      }
    };

  // ✅ 배너 배경색 변경 핸들러
  const handleBannerColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`;
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return;

    setBannerBackgroundColor(value);


    if (element.type === "banner") {
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      };

      onUpdate(updatedElement);
    }
  };



  // ✅ 배너 배경색 변경 핸들러
  const handleMobileBannerColorChange = (value) => {
    if (!value.startsWith("#")) value = `#${value}`;
    if (!/^#([0-9A-F]{3}){1,2}$/i.test(value)) return;

    setBannerBackgroundColor(value);

    if (element.type === "mobilebanner") {
      console.log("bannerchange")
      const updatedElement = {
        ...element,
        properties: {
          ...element.properties,
          backgroundColor: value,
        },
      };

      onUpdate(updatedElement);
    }
  };



  const handleSizeChange = (key, value) => {
    const newSize = {
      ...(element.properties.size || {}),
      [currentDevice]: {
        ...(element.properties.size?.[currentDevice] || {}),
        [key]: value,
      },
    };
  
    onSizeChange({
      ...element,
      properties: {
        ...element.properties,
        size: newSize,
      },
    });
  };


  const handleBannerUpload = async (uploadedUrl) => {
    console.log("🚀 배너 이미지 업로드 완료:", uploadedUrl);

    setBannerUrl(uploadedUrl);

    const updatedElements = elements.map((el) =>
        el.type === "banner"
            ? { ...el, properties: { ...el.properties, imageUrl: uploadedUrl } }
            : el
    );
    setElements(updatedElements);

    onUpdate({
        ...element,
        properties: {
            ...element.properties,
            imageUrl: uploadedUrl,
        },
    });

    // ✅ 배너 이미지 URL 저장
    handleSave(null, uploadedUrl);
};



const handleMobileBannerUpload = async (uploadedUrl) => {
  console.log("🚀 배너 이미지 업로드 완료:", uploadedUrl);

  setBannerUrl(uploadedUrl);

  const updatedElements = elements.map((el) =>
      el.type === "banner"
          ? { ...el, properties: { ...el.properties, imageUrl: uploadedUrl } }
          : el
  );
  setElements(updatedElements);

  onUpdate({
      ...element,
      properties: {
          ...element.properties,
          imageUrl: uploadedUrl,
      },
  });

  // ✅ 배너 이미지 URL 저장
  handleSave(null, uploadedUrl);
};


// 이미지 URL을 절대 경로로 설정하는 함수
const handleLogoUpload = (uploadedUrl) => {
  console.log("🚀 로고 이미지 업로드 완료:", uploadedUrl);

  

  setHeaderLogoUrl(uploadedUrl); // 상태 업데이트

  const updatedElements = elements.map((el) =>
    el.type === "header"
        ? { ...el, properties: { ...el.properties, logoUrl: uploadedUrl } }
        : el
);
setElements(updatedElements);


  onUpdate({
    ...element,
    properties: {
      ...element.properties,
      logoUrl: uploadedUrl, // 절대 경로로 업데이트
    },
  });

  handleSave(uploadedUrl); // 저장 함수 호출
};

// 이미지 렌더링 시 절대 경로 사용


const handleSaveInOrder = async () => {
  console.log("💾 저장 실행: 현재 elements 상태", elements);

  // UI에서 보이는 순서대로 요소들을 저장하려면 먼저 정렬해야 함
  const sortedElements = [...elements];

  // UI에서 보이는 순서대로 정렬 (순서 변경된 배열을 반영)
  sortedElements.sort((a, b) => a.index - b.index);  // `index`가 없다면, 요소가 가진 순서대로 정의

  let updatedSettings = {};

  // 순서대로 elements 배열을 처리
  for (let el of sortedElements) {
    if (el.type === "header") {
      // 여러 개의 헤더 처리
      updatedSettings.header = {
        ...el.properties,
        logoUrl: el.properties.logoUrl || `http://localhost:5000/uploads/${sellerId}_headerlogo.png`,
        backgroundColor: el.properties.backgroundColor || "#ffffff",
      };
    } else if (el.type === "banner") {
      // 여러 개의 배너 처리
      updatedSettings.banner = {
        ...el.properties,
        imageUrl: el.properties.imageUrl || `http://localhost:5000/uploads/${sellerId}_banner.png`,
        backgroundColor: el.properties.backgroundColor || "#ffffff",
      };
    } else {
      // 다른 요소들 처리
      updatedSettings[el.type] = {
        ...el.properties
      };
    }
  }

  try {
    await updateSellerSettings(sellerId, updatedSettings);    
    alert("🎉 설정이 성공적으로 저장되었습니다!");

    // 저장 후 최신 데이터 다시 불러오기
    const newSettings = await fetchSellerSettings(sellerId);
    if (newSettings) {
      // 각 요소의 최신 데이터 업데이트
      if (newSettings.header) {
        setHeaderBackgroundColor(newSettings.header.backgroundColor);
        setHeaderLogoUrl(newSettings.header.logoUrl);
      }
      if (newSettings.banner) {
        setBannerBackgroundColor(newSettings.banner.backgroundColor);
        setBannerUrl(newSettings.banner.imageUrl);
      }
      // 다른 요소들에 대해서도 처리할 수 있음
    }
  } catch (error) {
    alert("❌ 설정 저장 실패! 다시 시도해주세요.");
    console.error("❌ 설정 저장 오류:", error);
  }
};

  // ✅ 저장 핸들러 (헤더 & 배너 분리 저장)
  const handleSave = async (uploadedLogoUrl = null, uploadedBannerUrl = null) => {
    console.log("💾 저장 실행: 현재 elements 상태", elements);
  
    // ✅ elements가 배열인지 확인 후 변환
    const elementsArray = Array.isArray(elements) ? elements : Object.values(elements);
    console.log("🔍 elements 데이터 유형:", typeof elements);
    console.log("🔍 elements는 배열인가?", Array.isArray(elements));
  
    // ✅ header와 banner 데이터 찾기
    const headerElement = elementsArray.find((el) => el.type === "header");
    const bannerElement = elementsArray.find((el) => el.type === "banner");
    const gridElement = elementsArray.find((el) => el.type === "grid");

    console.log("🔍 찾은 headerElement:", headerElement);
    console.log("🔍 찾은 bannerElement:", bannerElement);
    console.log("🔍 찾은 gridElement:", gridElement);


    
    // ✅ 데이터가 없으면 빈 객체가 아니라 `null` 할당
    let updatedSettings = {};



    if (headerElement) {
      updatedSettings.header = {
        ...headerElement.properties,
        logoUrl: `http://localhost:5000/uploads/${sellerId}_headerlogo.png`, // ✅ 로고 URL 설정
      };
    } else {
      updatedSettings.header = null;
    }
    
    if (bannerElement) {
      updatedSettings.banner = {
        ...bannerElement.properties,
        logoUrl: `http://localhost:5000/uploads/${sellerId}_banner.png`, // ✅ 배너 이미지 저장
      };
    } else {
      updatedSettings.banner = null;
    }

    if (gridElement) {
      updatedSettings.grid = {
        ...gridElement.properties,

        columns: gridElement.properties.columns || 3, // 기본값은 3으로 설정
        sortList: gridElement.properties.sortList || [], // sortList 기본값은 빈 배열
        title: gridElement.properties.title || "추천 상품", // 기본값은 "추천 상품"
      };
    }else {
      updatedSettings.grid = null;
    }
    
  
    console.log("📤 최종 요청 데이터 by ElementEditor.jsx (settings):", JSON.stringify(updatedSettings, null, 2));
  
    if (!updatedSettings ) {
      console.error("❌ 저장할 설정 데이터가 없습니다.");
      return;
    }
  


    try {
      const elements = []; 
      await updateSellerSettings(sellerId, settings); // ✅ elements 전달    
       alert("🎉 설정이 성공적으로 저장되었습니다!");
  
      // ✅ 저장 후 최신 데이터를 다시 불러와 UI 업데이트
      const newSettings = await fetchSellerSettings(sellerId);
   if (newSettings) {
      if (newSettings.header) {
        setHeaderBackgroundColor(newSettings.header.backgroundColor);
        setHeaderLogoUrl(newSettings.header.logoUrl); // ✅ 저장 후 UI 업데이트
      }
      if (newSettings.banner) {
        setBannerBackgroundColor(newSettings.banner.backgroundColor);
        setBannerUrl(newSettings.banner.imageUrl); // ✅ 배너 이미지 업데이트
    }   
    if (newSettings.grid) {
  }   
  
  
  }
    } catch (error) {
      alert("❌ 설정 저장 실패! 다시 시도해주세요.");
      console.error("❌ 설정 저장 오류:", error);
    }
  };
  




  const handleChangeFont = (value) => {
    const updatedElement = {
      ...element,
      properties: {
        ...element.properties,
        fontFamily: value,
      },
    };
  
    onUpdate(updatedElement);
  };
  
  
  const handleChangeImage = (previewImgUrl) => {
    setEditedElement((prev) => ({
      ...prev,
      properties: {
        ...prev.properties,
        logoUrl: previewImgUrl, // ✅ 헤더 로고 저장
      },
    }));
  
    onUpdate({
      ...editedElement,
      properties: {
        ...editedElement.properties,
        logoUrl: previewImgUrl, // ✅ UI에서도 즉시 반영
      },
    });
  };
  // ✅ 편집기 렌더링
  const renderEditor = () => {
    switch (element.type) {





      case 'header':
        return (
          <>
            <div className='space-y-2'>
              <Label label={'로고 설정'} />
              <SingleImageUploader 
                elementType="header"  // ✅ 헤더 업로드일 경우

    sellerId={sellerId} 
    onUpdateImage={(imgUrl) => console.log("미리보기:", imgUrl)}
    onUpload={handleLogoUpload}  // ✅ 로고 업로드
    />            </div>

            <div className='space-y-2 mb-4'>
              <Label htmlFor={'headerBackgroundColor'} label={'헤더 배경 색상'} />
              <div className='flex gap-2 items-center'>
                <Input
                  id='headerBackgroundColor'
                  type='color'
                  className='w-12 h-10 p-1'
                  value={headerBackgroundColor}
                  onChange={(e) => handleHeaderColorChange(e.target.value)}
                />
                <Input
                  type="text"
                  value={headerBackgroundColor}
                  onChange={(e) => handleHeaderColorChange(e.target.value)}
                />
              </div>
            </div>


            <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">넓이 (width)</label>
  <input
    type="text"
    value={currentSize.width || ''}
    onChange={(e) => handleSizeChange('width', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: 100%, 300px"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">높이 (height)</label>
  <input
    type="text"
    value={currentSize.height || ''}
    onChange={(e) => handleSizeChange('height', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: auto, 200px"
  />
</div>
<select value={element.properties.fontFamily} 
    onChange={(e) => handleChangeFont(e.target.value)}
>
  <option value="Nanum Gothic">나눔고딕</option>
  <option value="Arial">Arial</option>
  <option value="Noto Sans KR">Noto Sans KR</option>
  ...
</select>
          </>
        );























        case 'banner':
          return (
            <>
              {/* 배너 이미지 설정 */}
              <div className='space-y-2'>
                <Label label={'배너 이미지 설정'} />
                <SingleImageUploader 
                  sellerId={sellerId} 
                  elementType="banner"  // ✅ 배너 업로드일 경우

                  onUpload={handleBannerUpload}  // ✅ 배너 이미지 업로드
                />
                {bannerUrl && (
                  <img src={bannerUrl} alt="배너 이미지 미리보기" className="w-full h-32 object-cover rounded-lg mt-2" />
                )}
              </div>
        
              {/* 배너 배경 색상 설정 */}
              <div className='space-y-2 mb-4'>
                <Label htmlFor={'bannerBackgroundColor'} label={'배너 배경 색상'} />
                <div className='flex gap-2 items-center'>
                  <Input
                    id='bannerBackgroundColor'
                    type='color'
                    className='w-12 h-10 p-1'
                    value={bannerBackgroundColor}
                    onChange={(e) => handleBannerColorChange(e.target.value)}
                  />
                  <Input
                    type="text"
                    value={bannerBackgroundColor}
                    onChange={(e) => handleBannerColorChange(e.target.value)}
                  />
                </div>
              </div>


              <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">넓이 (width)</label>
  <input
    type="text"
    value={currentSize.width || ''}
    onChange={(e) => handleSizeChange('width', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: 100%, 300px"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">높이 (height)</label>
  <input
    type="text"
    value={currentSize.height || ''}
    onChange={(e) => handleSizeChange('height', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: auto, 200px"
  />
</div>
<div className="mb-2">
      <label className="block text-sm font-semibold mb-1">타이틀</label>
      <input
        type="text"
        value={element.properties.title || ''}
        onChange={(e) =>
          onUpdate({ ...element, properties: { ...element.properties, title: e.target.value } })
        }
        className="w-full border rounded px-2 py-1"
        placeholder="배너 제목을 입력하세요"
      />
    </div>

    <div className="mb-2">
      <label className="block text-sm font-semibold mb-1">서브타이틀</label>
      <input
        type="text"
        value={element.properties.subtitle || ''}
        onChange={(e) =>
          onUpdate({ ...element, properties: { ...element.properties, subtitle: e.target.value } })
        }
        className="w-full border rounded px-2 py-1"
        placeholder="배너 부제목을 입력하세요"
      />
    </div>
            </>
          );


          case 'text':
            case 'mobiletext':
              return (
                <>
                  <div className="mb-4">
                    <Label label="내용" />
                    <textarea
                      value={element.properties.content || ''}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, content: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      rows={4}
                    />
                  </div>
                  <select
  value={element.properties.fontFamily}
  onChange={(e) => handleChangeFont(e.target.value)}
>

  <option value="Spoqa Han Sans Neo">Spoqa Han Sans Neo</option>
  <option value="SUIT">SUIT</option>
  <option value="Gmarket Sans">Gmarket Sans</option>
  <option value="Apple SD Gothic Neo">Apple SD Gothic Neo</option>
  <option value="IBM Plex Sans KR">IBM Plex Sans KR</option>
  <option value="Nanum Gothic">나눔고딕</option>
  <option value="Noto Sans KR">Noto Sans KR</option>
  <option value="Arial">Arial</option>
  <option value="Roboto">Roboto</option>
  <option value="Pretendard">Pretendard</option>
  
</select>
                  <div className="mb-4">
                    <Label label="폰트 크기" />
                    <input
                      type="text"
                      value={element.properties.fontSize || ''}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, fontSize: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
            
                  <div className="mb-4">
                    <Label label="폰트 굵기" />
                    <input
                      type="text"
                      value={element.properties.fontWeight || ''}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, fontWeight: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
            
                  <div className="mb-4">
                    <Label label="글자 색상" />
                    <input
                      type="color"
                      value={element.properties.color || '#000000'}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, color: e.target.value },
                        })
                      }
                      className="w-12 h-10 p-1"
                    />
                  </div>
            
                  <div className="mb-4">
                    <Label label="정렬" />
                    <select
                      value={element.properties.textAlign || 'left'}
                      onChange={(e) =>
                        onUpdate({
                          ...element,
                          properties: { ...element.properties, textAlign: e.target.value },
                        })
                      }
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="left">왼쪽 정렬</option>
                      <option value="center">가운데 정렬</option>
                      <option value="right">오른쪽 정렬</option>
                    </select>
                  </div>
                </>
              );
              case 'image':
                case 'mobileimage':
                  return (
                    <>
                      <div className='mb-4'>
                        <Label label="이미지 업로드" />
                        <SingleImageUploader
                          elementType={element.type}
                          sellerId={sellerId}
                          onUpload={(url) =>
                            onUpdate({
                              ...element,
                              properties: {
                                ...element.properties,
                                imageUrl: url,
                              },
                            })
                          }
                        />
                      </div>
                
                      <div className="mb-4">
                        <Label label="대체 텍스트 (alt)" />
                        <input
                          type="text"
                          value={element.properties.alt || ''}
                          onChange={(e) =>
                            onUpdate({
                              ...element,
                              properties: { ...element.properties, alt: e.target.value },
                            })
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </div>

                      
                    </>
                  );
                            


          case 'mobileheader':
            return (
              <>
                <div className='space-y-2'>
                  <Label label={'로고 설정'} />
                  <SingleImageUploader 
                    elementType="mobileheader"  // ✅ 헤더 업로드일 경우
    
        sellerId={sellerId} 
        onUpdateImage={(imgUrl) => console.log("미리보기:", imgUrl)}
        onUpload={handleLogoUpload}  // ✅ 로고 업로드
        />            </div>
    
                <div className='space-y-2 mb-4'>
                  <Label htmlFor={'mobileheaderBackgroundColor'} label={'모바일 헤더 배경 색상'} />
                  <div className='flex gap-2 items-center'>
                    <Input
                      id='mobileheaderBackgroundColor'
                      type='color'
                      className='w-12 h-10 p-1'
                      value={MobileheaderBackgroundColor}
                      onChange={(e) => handleMobileHeaderColorChange(e.target.value)}
                    />
                    <Input
                      type="text"
                      value={MobileheaderBackgroundColor}
                      onChange={(e) => handleMobileHeaderColorChange(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">넓이 (width)</label>
  <input
    type="text"
    value={currentSize.width || ''}
    onChange={(e) => handleSizeChange('width', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: 100%, 300px"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">높이 (height)</label>
  <input
    type="text"
    value={currentSize.height || ''}
    onChange={(e) => handleSizeChange('height', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: auto, 200px"
  />
</div>

              </>
            );
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
            case 'mobilebanner':
              return (
                <>
                  {/* 배너 이미지 설정 */}
                  <div className='space-y-2'>
                    <Label label={'배너 이미지 설정'} />
                    <SingleImageUploader 
                      sellerId={sellerId} 
                      elementType="mobilebanner"  // ✅ 배너 업로드일 경우
    
                      onUpload={handleBannerUpload}  // ✅ 배너 이미지 업로드
                    />
                    {bannerUrl && (
                      <img src={bannerUrl} alt="배너 이미지 미리보기" className="w-full h-32 object-cover rounded-lg mt-2" />
                    )}
                  </div>
            
                  {/* 모바일 배너 배경 색상 설정 */}
                  <div className='space-y-2 mb-4'>
                    <Label htmlFor={'MobilebannerBackgroundColor'} label={'모바일 배너 배경 색상'} />
                    <div className='flex gap-2 items-center'>
                      <Input
                        id='MobilebannerBackgroundColor'
                        type='color'
                        className='w-12 h-10 p-1'
                        value={MobilebannerBackgroundColor}
                        onChange={(e) => handleMobileBannerColorChange(e.target.value)}
                      />
                      <Input
                        type="text"
                        value={MobilebannerBackgroundColor}
                        onChange={(e) => handleMobileBannerColorChange(e.target.value)}
                      />
                    </div>
                  </div>



                  <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">넓이 (width)</label>
  <input
    type="text"
    value={currentSize.width || ''}
    onChange={(e) => handleSizeChange('width', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: 100%, 300px"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">높이 (height)</label>
  <input
    type="text"
    value={currentSize.height || ''}
    onChange={(e) => handleSizeChange('height', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: auto, 200px"
  />
</div>

                </>
              );
    
    



              case 'mobileBottomNavigationBar':
                return (
                  <>
                    {/* 네비게이션 항목 설정 */}
                    <div className='space-y-2'>
                      <Label label={'네비게이션 항목 설정'} />
                      <div className='grid grid-cols-5 gap-4 p-2 border rounded-lg'>
                        {element.properties.items.map((item, index) => (
                          <div key={item.id} className='flex flex-col items-center'>
                            <i className={`material-icons text-2xl`}>{item.icon}</i>
                            <Input
                              type="text"
                              value={item.label}
                              onChange={(e) => handleNavLabelChange(index, e.target.value)}
                              className="text-center w-full mt-1"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
              
                    {/* 배경 색상 설정 */}
                    <div className='space-y-2 mt-4'>
                      <Label htmlFor='BottomNavBackgroundColor' label={'바텀 네비게이션 배경 색상'} />
                      <div className='flex gap-2 items-center'>
                        <Input
                          id='BottomNavBackgroundColor'
                          type='color'
                          className='w-12 h-10 p-1'
                          value={element.properties.backgroundColor}
                          onChange={(e) => handleBottomNavColorChange(e.target.value)}
                        />
                        <Input
                          type="text"
                          value={element.properties.backgroundColor}
                          onChange={(e) => handleBottomNavColorChange(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">넓이 (width)</label>
  <input
    type="text"
    value={currentSize.width || ''}
    onChange={(e) => handleSizeChange('width', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: 100%, 300px"
  />
</div>

<div className="mb-4">
  <label className="block text-sm font-medium text-gray-700">높이 (height)</label>
  <input
    type="text"
    value={currentSize.height || ''}
    onChange={(e) => handleSizeChange('height', e.target.value)}
    className="w-full border border-gray-300 rounded px-2 py-1"
    placeholder="예: auto, 200px"
  />
</div>

                  </>
                );
              

      default:
        return <div>이 요소 유형에 대한 편집기는 준비중입니다.</div>;
    }
  };

  return (
    <>
      <div className='space-y-6'>
        {renderEditor()}
        <button onClick={handleSave} className='w-full p-2 bg-[#4294F2] text-white'>
          저장
        </button>
      </div>
    </>
  );
}
