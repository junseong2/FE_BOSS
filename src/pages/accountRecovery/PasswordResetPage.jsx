import { useState } from "react";
import EmailSendForm from "./components/EmailSendForm";
import CodeVerifyForm from "./components/CodeVerifyForm";
import ResetPasswordForm from "./components/ResetPasswordForm";
import { motion } from "framer-motion";
import { passsendEmailAuthCode, verifyEmailAuthCode } from "../../services/auth.service"; // 수정된 import
import { BASE_URL } from "../../lib/api";

export default function PasswordResetPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSendCode, setIsSendCode] = useState(false);
  const [isAuthEmail, setIsAuthEmail] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 이메일 인증코드 전송
  const handlesendEmailAuthCode = async () => {
    setIsLoading(true);
    if (email === "") {
      alert("이메일을 입력하세요.");
      setIsLoading(false);
      return;
    }
    
    try {
      // 이메일 중복 검사 제외하고 인증 코드 전송만 실행
      const isSuccess = await passsendEmailAuthCode(email); // passsendEmailAuthCode로 변경
      
      if (isSuccess) {
        setIsSendCode(true);
        setStep(2); // 인증 번호 입력 단계로 이동
      } else {
        alert("인증번호 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("이메일 인증 코드 전송 오류:", error);
      alert("이메일 인증 코드 전송에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 이메일 인증 처리
// verifyEmailAuthCode 함수 호출 수정
const handleEmailVerify = async () => {
  setIsLoading(true);
  if (code === "") {
    alert("인증번호를 입력하세요.");
    setIsLoading(false);
    return;
  }

  try {
    // 요청 전에 파라미터 로깅
    console.log("인증 요청 파라미터:", { code, email });
    
    const isAuth = await verifyEmailAuthCode(email, code); // 순서 확인 필요
    // 또는 객체로 전달: const isAuth = await verifyEmailAuthCode({ email, code });
  
    console.log("인증 결과:", isAuth); // 서버에서 받은 인증 여부 확인 로그
  
    if (isAuth) {
      setIsAuthEmail(true);
      alert("이메일 인증이 완료되었습니다.");
      setStep(3);
    } else {
      alert("인증번호가 일치하지 않습니다. 다시 확인해주세요.");
    }
  } catch (error) {
    console.error("인증 확인 오류:", error);
    alert("인증 과정에서 문제가 발생했습니다. 다시 시도해주세요.");
  }
  setIsLoading(false);
};


  // 비밀번호 재설정 처리
  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    if (newPassword === "") {
      alert("새 비밀번호를 입력하세요.");
      return;
    }
  
    if (newPassword !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
  
    setIsLoading(true);
    try {
      const res = await fetch(BASE_URL+`/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: newPassword,
        }),
      });
  
      if (res.ok) {
        alert("비밀번호가 성공적으로 재설정되었습니다!");
        window.location.href = "/";
      } else {
        let errorMessage = "비밀번호 재설정 실패";
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {}
        alert(errorMessage);
      }
    } catch (error) {
      console.error("비밀번호 재설정 오류:", error);
      alert("서버 오류로 비밀번호 재설정에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };
  
  

  // 이전 단계로 돌아가기
  const handleGoBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">비밀번호 재설정</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 1 && "이메일을 입력하여 인증번호를 받으세요."}
            {step === 2 && "이메일로 전송된 인증번호를 입력하세요."}
            {step === 3 && "새로운 비밀번호를 설정하세요."}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8 px-2">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
                  step >= stepNumber ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              <div
                className={`text-xs mt-2 font-medium ${
                  step >= stepNumber ? "text-blue-500" : "text-gray-500"
                }`}
              >
                {stepNumber === 1 && "이메일"}
                {stepNumber === 2 && "인증"}
                {stepNumber === 3 && "재설정"}
              </div>
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg p-6 border border-gray-100"
        >
          {step === 1 && (
            <EmailSendForm 
              email={email} 
              setEmail={setEmail} 
              onRequestCode={handlesendEmailAuthCode} // 수정된 함수 이름
              isLoading={isLoading}
            />
          )}
          {step === 2 && (
            <CodeVerifyForm
              code={code}
              setCode={setCode}
              onVerifyCode={handleEmailVerify}
              onResendCode={handlesendEmailAuthCode} // 수정된 함수 이름
              email={email}
              isLoading={isLoading}
              setStep={setStep} 
            />
          )}
          {step === 3 && (
            <ResetPasswordForm
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onResetPassword={handleResetPassword}
              isLoading={isLoading}
            />
          )}
        </motion.div>

        <div className="mt-4 text-center space-x-4">
          {step > 1 && (
            <button
              onClick={handleGoBack}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              disabled={isLoading}
            >
              이전 단계
            </button>
          )}
          <button
            onClick={() => (window.location.href = "/signin")}
            className="text-sm text-blue-500 hover:text-blue-700 font-medium"
            disabled={isLoading}
          >
            로그인 페이지로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
