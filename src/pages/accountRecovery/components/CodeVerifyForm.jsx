"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { verifyEmailAuthCode, passsendEmailAuthCode } from "../../../services/auth.service"

export default function CodeVerifyForm({ code, setCode, email, setStep }) {
  const [timer, setTimer] = useState(300)
  const [isResending, setIsResending] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${s < 10 ? "0" : ""}${s}`
  }

  const handleResendCode = async () => {
    setIsResending(true)
    try {
      const isSuccess = await passsendEmailAuthCode(email)
      if (isSuccess) {
        setTimer(300)
      } else {
        alert("재전송 실패. 이메일을 확인해주세요.")
      }
    } catch {
      alert("재전송 중 오류 발생")
    } finally {
      setIsResending(false)
    }
  }

  const handleEmailVerify = async () => {
    setIsLoading(true)
    if (!code) {
      alert("인증번호를 입력하세요.")
      setIsLoading(false)
      return
    }

    const isAuth = await verifyEmailAuthCode(code, email) // 실패해도 예외 발생 X
    if (isAuth) {
      alert("이메일 인증이 완료되었습니다.")
      setStep(3)
    } else {
      alert("인증번호가 일치하지 않거나 만료되었습니다.")
    }

    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full flex items-center justify-center shadow-sm">
          <svg
            className="h-12 w-12 text-indigo-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">인증번호 확인</h3>
        <p className="text-sm text-gray-500 mt-1">{email}로 전송된 인증번호를 입력해주세요</p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">인증번호</label>
            <div className={`text-sm font-medium flex items-center ${timer <= 60 ? "text-red-500" : "text-gray-500"}`}>
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {formatTime(timer)}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm text-center font-medium tracking-wider"
              placeholder="인증번호 5자리"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
              maxLength={6}
              required
            />
          </div>

          <div className="mt-2 text-xs text-gray-500 flex items-start">
            <svg
              className="h-4 w-4 mr-1 flex-shrink-0 text-indigo-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>
              인증번호는 5분간 유효하며, 이메일로 전송된 5자리 숫자를 입력하세요.
              {timer <= 60 && <span className="text-red-500 font-medium"> 인증 시간이 곧 만료됩니다.</span>}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleEmailVerify}
            className={`w-full py-3.5 px-4 ${
              isLoading ? "bg-indigo-400" : "bg-indigo-600 hover:bg-indigo-700"
            } text-white font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm`}
            disabled={!code || code.length < 5 || timer === 0 || isLoading}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                확인 중...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                인증번호 확인
              </>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleResendCode}
            className={`w-full py-3 px-4 ${
              isResending ? "bg-gray-100 text-gray-400" : "bg-white hover:bg-gray-50 text-gray-700"
            } border border-gray-300 font-medium rounded-lg transition-colors flex items-center justify-center shadow-sm`}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                재전송 중...
              </>
            ) : (
              <>
                <svg
                  className="h-5 w-5 mr-2 text-gray-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                인증번호 재전송
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
