"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  IoPersonOutline,
  IoLockClosedOutline,
  IoMailOutline,
  IoCallOutline,
  IoHomeOutline,
  IoTrashOutline,
  IoSaveOutline,
  IoArrowBackOutline,
  IoCheckmarkCircle,
  IoAlertCircleOutline,
  IoSettingsOutline,
  IoNotificationsOutline,
} from "react-icons/io5"

const UserProfile = () => {
  const [userId, setUserId] = useState(null)
  const [password, setPassword] = useState("")
  const [userName, setUserName] = useState("")
  const [emails, setEmails] = useState([""])
  const [phones, setPhones] = useState(["", "", ""])
  const [addresses, setAddresses] = useState([{ address1: "", address2: "", post: "", isDefault: false }])
  const [activeTab, setActiveTab] = useState("profile")
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    fetchUserInfo()
  }, [])

  const fetchUserInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:5000/auth/user-info", {
        method: "GET",
        credentials: "include",
      })

      if (response.status === 403) {
        navigate("/signin")
        return
      }

      if (!response.ok) throw new Error("로그인 정보 조회 실패")

      const data = await response.json()

      setUserId(data.userId)
      setUserName(data.userName)
      setPassword(data.userPassword)
      setEmails([data.userEmail])
      setPhones([data.userPhone1 ?? "", data.userPhone2 ?? "", data.userPhone3 ?? ""])

      const addressRes = await fetch(`http://localhost:5000/address/user/${data.userId}`, {
        method: "GET",
        credentials: "include",
      })

      if (addressRes.ok) {
        const addressData = await addressRes.json()
        setAddresses(addressData)
      } else {
        console.warn("주소 데이터를 불러오지 못했습니다.")
      }
    } catch (error) {
      console.error("❌ 사용자 정보 조회 오류:", error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setFormSubmitted(true)

    if (!userId) {
      alert("로그인 정보가 없습니다.")
      setIsLoading(false)
      return
    }

    const requestData = {
      userId: Number(userId),
      email: emails[0],
      password,
      phones: phones.filter(Boolean),
      addresses: addresses.map((addr) => ({ ...addr })),
    }

    try {
      const response = await fetch("http://localhost:5000/auth/update-userinfo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestData),
      })

      if (!response.ok) throw new Error(await response.text())

      setPasswordSuccess("회원 정보가 성공적으로 수정되었습니다.")
      setTimeout(() => {
        setPasswordSuccess("")
      }, 3000)
    } catch (error) {
      setPasswordError(`오류 발생: ${error.message}`)
      setTimeout(() => {
        setPasswordError("")
      }, 3000)
    } finally {
      setIsLoading(false)
      setFormSubmitted(false)
    }
  }

  const handleAddressSearch = (index) => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const newAddresses = [...addresses]
        newAddresses[index].address1 = data.roadAddress
        newAddresses[index].post = data.zonecode
        setAddresses(newAddresses)
      },
    }).open()
  }

  const handleDefaultAddress = (index) => {
    const newAddresses = addresses.map((addr, idx) => ({
      ...addr,
      isDefault: idx === index,
    }))
    setAddresses(newAddresses)
  }

  const handleAddAddress = () => {
    const newAddress = {
      address1: "",
      address2: "",
      post: "",
      isDefault: false,
    }

    // 기본 주소가 없다면 자동 설정
    const hasDefault = addresses.some((addr) => addr.isDefault)
    if (!hasDefault) {
      newAddress.isDefault = true
    }

    setAddresses([...addresses, newAddress])
  }

  const handleRemoveAddress = (index) => {
    const updated = [...addresses]
    updated.splice(index, 1)

    // 삭제 후 기본 주소가 없으면 첫 번째 주소를 기본 주소로 자동 설정
    if (!updated.some((addr) => addr.isDefault) && updated.length > 0) {
      updated[0].isDefault = true
    }

    setAddresses(updated)
  }

  const handleDeleteAccount = async () => {
    if (!userId) return alert("로그인 정보가 없습니다.")

    const confirm = window.confirm("정말 탈퇴하시겠습니까?")
    if (!confirm) return

    setIsLoading(true)
    try {
      const res = await fetch(`http://localhost:5000/auth/usersout/${userId}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (res.ok) {
        alert("회원 탈퇴가 완료되었습니다.")
        navigate("/")
        window.location.reload()
      } else {
        alert("탈퇴 처리 중 문제가 발생했습니다.")
      }
    } catch (err) {
      alert("서버 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCurrentPasswordSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (!currentPassword) {
      setPasswordError("현재 비밀번호를 입력하세요.")
      setIsLoading(false)
      return
    }

    try {
      // 현재 비밀번호를 서버로 보내서 확인
      const response = await fetch("http://localhost:5000/auth/check-current-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsCurrentPasswordValid(true)
        setPasswordError("")
      } else {
        setPasswordError(data.message || "현재 비밀번호가 올바르지 않습니다.")
        setIsCurrentPasswordValid(false)
      }
    } catch (error) {
      setPasswordError("서버 오류가 발생했습니다.")
      console.log("1", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    if (newPassword !== confirmNewPassword) {
      setPasswordError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.")
      setIsLoading(false)
      return
    }

    try {
      // 새 비밀번호 변경 요청
      const response = await fetch("http://localhost:5000/auth/update-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setPasswordSuccess("비밀번호가 성공적으로 변경되었습니다.")
        setPasswordError("")
        setTimeout(() => {
          navigate("/")
        }, 2000)
      } else {
        setPasswordError(data.message || "비밀번호 변경 실패")
      }
    } catch (error) {
      setPasswordError("서버 오류가 발생했습니다.")
      console.log("2", error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleUpdate} className="space-y-6">
            {/* 기본 정보 섹션 */}
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="text-blue-800 font-medium flex items-center gap-2 mb-2">
                <IoPersonOutline className="w-5 h-5" />
                기본 정보
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoPersonOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      type="text"
                      value={userName}
                      disabled
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoMailOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                      type="email"
                      value={emails[0]}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 연락처 섹션 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-gray-800 font-medium flex items-center gap-2 mb-4">
                <IoCallOutline className="w-5 h-5" />
                연락처 정보
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <div className="flex gap-2">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="relative flex-1">
                      <input
                        className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                        type="text"
                        maxLength={i === 0 ? 3 : 4}
                        value={phones[i] ?? ""}
                        placeholder={["010", "0000", "0000"][i]}
                        onChange={(e) => {
                          const newPhones = [...phones]
                          newPhones[i] = e.target.value
                          setPhones(newPhones)
                        }}
                      />
                      {i < 2 && (
                        <span className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 text-gray-400">
                          -
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 주소 섹션 */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-800 font-medium flex items-center gap-2">
                  <IoHomeOutline className="w-5 h-5" />
                  배송지 정보
                </h3>
                {addresses.length < 3 && (
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                  >
                    + 주소 추가
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 border border-gray-200 relative transition-all hover:border-blue-200"
                  >
                    {addr.isDefault && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        기본 배송지
                      </span>
                    )}

                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          className="flex-1 p-2.5 border border-gray-300 rounded-lg"
                          type="text"
                          placeholder="주소"
                          value={addr.address1}
                          readOnly
                        />
                        <button
                          type="button"
                          className="sm:w-auto w-full px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          onClick={() => handleAddressSearch(idx)}
                        >
                          주소 검색
                        </button>


                      </div>

                      <input
                        className="w-full p-2.5 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                        type="text"
                        placeholder="상세주소"
                        value={addr.address2}
                        onChange={(e) => {
                          const newAddresses = [...addresses]
                          newAddresses[idx].address2 = e.target.value
                          setAddresses(newAddresses)
                        }}
                      />

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="우편번호"
                            value={addr.post}
                            readOnly
                            className="w-32 p-2.5 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                          />
                          <label className="inline-flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="radio"
                              name="defaultAddress"
                              checked={addr.isDefault}
                              onChange={() => handleDefaultAddress(idx)}
                              className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">기본 배송지로 설정</span>
                          </label>
                        </div>

                        {addresses.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAddress(idx)}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <IoTrashOutline className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 알림 메시지 */}
            {passwordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <IoAlertCircleOutline className="w-5 h-5 text-red-500" />
                {passwordError}
              </div>
            )}

            {/* 버튼 영역 */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                type="submit"
                disabled={isLoading || formSubmitted}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${isLoading || formSubmitted
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>처리 중...</span>
                  </>
                ) : (
                  <>
                    <IoSaveOutline className="w-5 h-5" />
                    <span>정보 수정</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate("/")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
              >
                <IoArrowBackOutline className="w-5 h-5" />
                <span>홈으로</span>
              </button>

              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                <IoTrashOutline className="w-5 h-5" />
                <span>탈퇴하기</span>
              </button>
            </div>
          </form>
        )

      case "security":
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <IoLockClosedOutline className="w-6 h-6 text-blue-600" />
              비밀번호 변경
            </h3>

            {!isCurrentPasswordValid ? (
              <form onSubmit={handleCurrentPasswordSubmit} className="space-y-5">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    현재 비밀번호
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="current-password"
                      type="password"
                      placeholder="현재 비밀번호 입력"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <IoAlertCircleOutline className="w-5 h-5 text-red-500" />
                    {passwordError}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>확인 중...</span>
                      </>
                    ) : (
                      <>
                        <IoLockClosedOutline className="w-5 h-5" />
                        <span>현재 비밀번호 확인</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    새 비밀번호
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="새 비밀번호 입력"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLockClosedOutline className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="비밀번호 확인"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <IoAlertCircleOutline className="w-5 h-5 text-red-500" />
                    {passwordError}
                  </div>
                )}

                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <IoCheckmarkCircle className="w-5 h-5 text-green-500" />
                    {passwordSuccess}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium transition-colors ${isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                      }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>변경 중...</span>
                      </>
                    ) : (
                      <>
                        <IoLockClosedOutline className="w-5 h-5" />
                        <span>비밀번호 변경</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        )

      case "preferences":
        return (
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <IoSettingsOutline className="w-6 h-6 text-blue-600" />
              환경설정
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <IoMailOutline className="w-5 h-5 text-blue-600" />
                    마케팅 이메일
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">프로모션 및 업데이트 정보를 이메일로 받기</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="marketing-email" className="sr-only peer" />
                  <label
                    htmlFor="marketing-email"
                    className="block w-full h-full bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-500 transition-colors"
                  ></label>
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-blue-200 transition-all">
                <div>
                  <h4 className="font-medium text-gray-800 flex items-center gap-2">
                    <IoNotificationsOutline className="w-5 h-5 text-blue-600" />새 알림
                  </h4>
                  <p className="text-sm text-gray-500 mt-1">새로운 활동에 대한 알림 받기</p>
                </div>
                <div className="relative inline-block w-12 h-6">
                  <input type="checkbox" id="notifications" className="sr-only peer" defaultChecked />
                  <label
                    htmlFor="notifications"
                    className="block w-full h-full bg-gray-300 rounded-full cursor-pointer peer-checked:bg-blue-500 transition-colors"
                  ></label>
                  <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-6"></span>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm">
                  <IoSaveOutline className="w-5 h-5" />
                  <span>설정 저장</span>
                </button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8">
        <h2 className="text-2xl font-bold text-white text-center">마이페이지</h2>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-center gap-2 px-6 -mt-4">
        <div className="bg-white rounded-full shadow-md p-1 flex">
          {[
            { id: "profile", label: "기본 정보", icon: <IoPersonOutline className="w-4 h-4" /> },
            { id: "security", label: "보안 설정", icon: <IoLockClosedOutline className="w-4 h-4" /> },
            { id: "preferences", label: "환경설정", icon: <IoSettingsOutline className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5
                ${activeTab === tab.id ? "bg-blue-600 text-white shadow-sm" : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">{renderTabContent()}</div>
    </div>
  )
}

export default UserProfile

