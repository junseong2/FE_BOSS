import { useState, useRef } from 'react';
import axios from 'axios';
import { useUser } from '../../../context/UserContext'; // ✅ Context에서 로그인 정보 가져오기
import BusinessRegistrationForm from './BusinessRegistrationForm';
import OnlineSalesForm from './OnlineSalesForm';

const SellerRegistrationForm = () => {
  const { userId } = useUser(); // ✅ 로그인한 유저 ID
  const [isBusinessVerified, setIsBusinessVerified] = useState(false);
  const [isSalesVerified, setIsSalesVerified] = useState(false);

  const [representativeName, setRepresentativeName] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');
  const [onlineSalesNumber, setOnlineSalesNumber] = useState('');
  const onlineSalesNumberRef = useRef('');
  
  const [storename, setStorename] = useState('');
  const [description, setDescription] = useState('');

  const handleRegisterSeller = async () => {
    if (!userId) {
      alert('로그인 후 등록이 가능합니다.');
      return;
    }

    const sellerData = {
      userId,
      representativeName,
      storename,
      description,
      businessRegistrationNumber,
      onlineSalesNumber: onlineSalesNumberRef.current,
    };
    console.log('📤 보낼 데이터:', sellerData);

    try {
      const response = await axios.post(
        'http://localhost:5000/seller/register',
        sellerData
      );

      console.log('📦 등록 성공:', response.data);
      alert('판매자 등록 신청이 완료되었습니다.');
    } catch (error) {
      console.error('🚨 등록 실패:', error);
      alert('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 bg-white shadow-xl rounded-xl p-8 space-y-6 border border-gray-200">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        판매자 등록 신청
      </h2>

      {/* 사업자 등록 */}
      <BusinessRegistrationForm
        onVerify={(number) => {
          setBusinessRegistrationNumber(number);
          setIsBusinessVerified(true);
        }}
      />

      {/* 통신판매업 신고 */}
      {isBusinessVerified && (
        <OnlineSalesForm
          onVerify={(number) => {
            setOnlineSalesNumber(number);
            onlineSalesNumberRef.current = number;
            setIsSalesVerified(true);
            console.log('✅ 통신판매업 번호 전달됨:', number);
          }}
        />
      )}

      {/* 입력 폼 */}
      {isSalesVerified && (
        <div className="space-y-5 pt-4 border-t border-gray-300">
          <div>
            <label className="block text-gray-700 font-medium mb-1">대표자 이름</label>
            <input
              type="text"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              placeholder="대표자 이름 입력"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">스토어 이름</label>
            <input
              type="text"
              value={storename}
              onChange={(e) => setStorename(e.target.value)}
              placeholder="스토어 이름 입력"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">스토어 설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="스토어 설명 입력"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400 focus:outline-none resize-none min-h-[100px]"
            />
          </div>

          <button
            onClick={handleRegisterSeller}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-md transition duration-300"
          >
            판매업 등록 신청하기
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerRegistrationForm;
