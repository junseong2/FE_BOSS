import {BASE_URL} from '../lib/api'

const saveHeaderColor = async (headerName, color) => {
  try {
    const response = await fetch(BASE_URL+`/api/headers/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: headerName, backgroundColor: color }),
    });

    const data = await response.json();
    console.log('저장된 헤더 색상:', data);
    return data; // 필요하면 저장된 데이터 반환
  } catch (error) {
    console.error('헤더 색상 저장 실패:', error);
    throw error;
  }
};




/*

export const fetchHeaderBackgroundColor = async (sellerId) => {
  try {
    const response = await fetch(BASE_URL+`/UI/sellers/${sellerId}/headers/getBackgroundColor`);
    const data = await response.json();
    return data.backgroundColor; 
  } catch (error) {
    console.error(`헤더 배경 색상 불러오기 실패 (Seller: ${sellerId}):`, error);
    return '#4294F2'; // 기본 색상
  }
};

*/
const updateHeaderColor = async (headerId, color) => {
  try {
    const response = await fetch(BASE_URL+`/api/headers/${headerId}/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ backgroundColor: color }),
    });

    const data = await response.json();
    console.log('업데이트된 헤더 색상:', data);
    return data;
  } catch (error) {
    console.error('헤더 색상 업데이트 실패:', error);
    throw error;
  }
};

import axios from 'axios';

export const fetchSellerSettings = async (sellerId) => {
  try {
    const response = await axios.get(BASE_URL+`/seller/seller-info/${sellerId}`);
    console.log("📥 불러온 seller settings:", response.data.settings);
    
    return response.data.settings || "N/A"; // ✅ 설정이 없으면 "N/A" 반환
  } catch (error) {
    console.error("❌ 설정 불러오기 실패:", error);
    return "N/A"; // ✅ 오류 발생 시 기본값 반환
  }
};
export const fetchSellerMobileSettings = async (sellerId) => {
  try {
    const response = await axios.get(BASE_URL+`/seller/seller-info/${sellerId}`);
    console.log("📥 불러온 seller settings:", response.data.settings);
    
    return response.data.mobilesettings || "N/A"; // ✅ 설정이 없으면 "N/A" 반환
  } catch (error) {
    console.error("❌ 설정 불러오기 실패:", error);
    return "N/A"; // ✅ 오류 발생 시 기본값 반환
  }
};






export async function updateSellerSettings(sellerId, settings) {
  try {
    console.log("📤 요청 데이터2 (settings):", settings);



















// 설정된 순서대로 배열을 직렬화하여 전송
console.log("📤 요청 데이터 (settings)(usercustomui.js):", settings);
console.log("📤 요청 데이터는 (settings)(usercustomui.js):", JSON.stringify(settings, null, 2));
const response = await fetch(BASE_URL+`/seller/${sellerId}/updateSettings`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settings),  // 동적 순서대로 전송
});












    const data = await response.json();
    console.log("✅ 설정 업데이트 성공:", data);
    return data;
  } catch (error) {
    console.error(`❌ 설정 업데이트 실패 (Seller: ${sellerId}):`, error);
    throw error;
  }
}

export async function updateSellerMobileSettings(sellerId, settings) {
  try {
    console.log("📤 요청 모바일 데이터2 (settings):", settings);



















// 설정된 순서대로 배열을 직렬화하여 전송
console.log("📤 요청 모바일데이터 (settings)(usercustomui.js):", settings);
console.log("📤 요청 모바일 데이터는 (settings)(usercustomui.js):", JSON.stringify(settings, null, 2));
const response = await fetch(BASE_URL+`/seller/${sellerId}/updateMobileSettings`, {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(settings),  // 동적 순서대로 전송
});












    const data = await response.json();
    console.log("✅ 설정 업데이트 성공:", data);
    return data;
  } catch (error) {
    console.error(`❌ 설정 업데이트 실패 (Seller: ${sellerId}):`, error);
    throw error;
  }
}


/*
export const updateHeaderBackgroundColor = async (sellerId, headerId, color) => {
  try {
    const response = await fetch(BASE_URL+`/seller/${sellerId}/updateBackgroundColor`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ backgroundColor: color }),
    });

    const data = await response.json();
    console.log(`업데이트된 헤더 배경 색상 (Seller: ${sellerId}):`, data);
    return data;
  } catch (error) {
    console.error(`헤더 배경 색상 업데이트 실패 (Seller: ${sellerId}):`, error);
    throw error;
  }
};

*/


// `updateHeaderColor`를 기본으로 export하고, `saveHeaderColor`는 개별 export
export { saveHeaderColor };
export default updateHeaderColor;
