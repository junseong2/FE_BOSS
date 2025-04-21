import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useUser } from "../../../context/UserContext"
import BusinessRegistrationForm from "./BusinessRegistrationForm"
import OnlineSalesForm from "./OnlineSalesForm"
import { CheckCircle, ArrowRight, Store, FileCheck, UserCheck } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BASE_URL } from "../../../lib/api"

const SellerRegistrationForm = ({ onClose }) => {
  const { userId } = useUser()
  const [step, setStep] = useState(1)
  const [isUserSeller, setIsUserSeller] = useState(false)

  const [representativeName, setRepresentativeName] = useState("")
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState("")
  const [onlineSalesNumber, setOnlineSalesNumber] = useState("")
  const onlineSalesNumberRef = useRef("")

  const [storename, setStorename] = useState("")
  const [description, setDescription] = useState("")

  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const checkIfUserIsSeller = async () => {
      try {
        const response = await axios.get(BASE_URL+`/seller/check/${userId}`)
        setIsUserSeller(response.data.isSeller)
      } catch (error) {
        console.error("판매자 등록 여부 확인 실패", error)
      }
    }
    if (userId) {
      checkIfUserIsSeller()
    }
  }, [userId])

  const handleRegisterSeller = async () => {
    if (!userId) {
      alert("로그인 후 등록이 가능합니다.")
      return
    }

    if (isUserSeller) {
      alert("이미 판매자 등록이 되어 있습니다.")
      return
    }

    const sellerData = {
      userId,
      representativeName,
      storename,
      description,
      businessRegistrationNumber,
      onlineSalesNumber: onlineSalesNumberRef.current,
    }

    try {
      const response = await axios.post(BASE_URL+"/seller/register", sellerData)
      setShowSuccess(true)
    } catch (error) {
      console.error("🚨 등록 실패:", error)
      alert("등록 중 오류가 발생했습니다.")
    }
  }

  const handleStepChange = (newStep) => {
    setStep(newStep)
  }

  const handleCloseSuccess = () => {
    setShowSuccess(false); // 성공 메시지 닫기
    if (onClose) {
      onClose(); // 부모 컴포넌트에서 전달받은 onClose 호출
    }
  };

  const stepIcons = [
    <FileCheck key="business" className="w-6 h-6" />,
    <UserCheck key="sales" className="w-6 h-6" />,
    <Store key="store" className="w-6 h-6" />
  ]

  const stepTitles = ["사업자 등록", "통신판매업 신고", "스토어 정보"]

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 bg-gradient-to-br from-white to-blue-50 shadow-2xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-500 py-8 px-8">
        <h2 className="text-3xl font-bold text-white text-center">판매자 등록 신청</h2>
        <p className="text-blue-100 text-center mt-2">쉽고 빠르게 판매자가 되어보세요</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute h-1 bg-gray-200 top-1/2 left-0 right-0 -translate-y-1/2 z-0">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-in-out"
              style={{ width: `${(step - 1) * 50}%` }}
            ></div>
          </div>
          {stepTitles.map((title, index) => (
            <div key={title} className="flex flex-col items-center z-10">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${step > index + 1
                    ? "bg-blue-500 text-white"
                    : step === index + 1
                      ? "bg-blue-500 text-white ring-4 ring-blue-200"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
              >
                {step > index + 1 ? <CheckCircle className="w-8 h-8" /> : stepIcons[index]}
              </div>
              <span
                className={`text-sm mt-3 font-medium text-center transition-colors duration-300 ${step > index ? "text-blue-600" : "text-gray-500"
                  }`}
              >
                {title}
              </span>
            </div>
          ))}
        </div>

        <div className="relative min-h-[400px]">
          {step === 1 && (
            <div className="absolute w-full top-0 left-0 right-0">
              <BusinessRegistrationForm
                onVerify={(number) => {
                  setBusinessRegistrationNumber(number)
                  handleStepChange(2)
                }}
              />
            </div>
          )}

          {step === 2 && (
            <div className="absolute w-full top-0 left-0 right-0">
              <OnlineSalesForm
                onVerify={(number) => {
                  setOnlineSalesNumber(number)
                  onlineSalesNumberRef.current = number
                  setTimeout(() => handleStepChange(3), 10)
                }}
              />
            </div>
          )}

          {step === 3 && (
            <div className="absolute w-full top-0 left-0 right-0 h-full overflow-auto">
              <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">스토어 정보 입력</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">대표자 이름</label>
                    <input
                      type="text"
                      value={representativeName}
                      onChange={(e) => setRepresentativeName(e.target.value)}
                      placeholder="대표자 이름 입력"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">스토어 이름</label>
                    <input
                      type="text"
                      value={storename}
                      onChange={(e) => setStorename(e.target.value)}
                      placeholder="스토어 이름 입력"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">스토어 설명</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="스토어 설명 입력"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:outline-none resize-none min-h-[120px]"
                    />
                  </div>

                  <button
                    onClick={handleRegisterSeller}
                    disabled={!representativeName || !storename}
                    className={`w-full py-4 rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${!representativeName || !storename
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                      }`}
                  >
                    판매업 등록 신청하기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center transform transition-all duration-300 scale-100 opacity-100">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-blue-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-blue-600">등록 완료!</h3>
            <p className="text-gray-700 mb-6">판매자 등록 신청이 정상적으로 완료되었습니다.</p>
            <button
              onClick={handleCloseSuccess}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all duration-300 hover:shadow-lg w-full flex items-center justify-center gap-2"
            >
              <span>창 닫기</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SellerRegistrationForm
