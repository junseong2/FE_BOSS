"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import PostNameWrite from "./PostNameWrite"
import PostArticleWrite from "./PostArticleWrite"
import mainurl from "./mainurl"

function PostWriting() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await axios.post(
        mainurl() + "/articles",
        {
          articleName: title,
          article: content,
        },
        {
          withCredentials: true, // 쿠키 전송을 위해 필요
        },
      )

      console.log("게시글이 성공적으로 등록됨:", response.data)
      alert("게시글이 작성되었습니다.")
      navigate("/contact")
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error)
      alert("게시글 작성 중 오류가 발생했습니다.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/contact")}
          className="mr-4 text-gray-600 hover:text-blue-600 transition-colors"
          aria-label="뒤로 가기"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">게시글 작성</h2>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 p-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span className="text-lg font-medium text-gray-800">새 게시글 작성하기</span>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            질문이나 의견을 자유롭게 작성해주세요. 명확한 제목과 상세한 내용은 더 많은 관심과 답변을 받을 수 있습니다.
          </p>
        </div>

        <PostNameWrite title={title} setTitle={setTitle} />
        <PostArticleWrite content={content} setContent={setContent} />

        <div className="flex space-x-3 justify-end mt-8">
          <button
            onClick={() => navigate("/contact")}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            취소
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className={`px-6 py-3 ${
              isSubmitting || !title.trim() || !content.trim()
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white font-medium rounded-lg transition-colors flex items-center justify-center`}
          >
            {isSubmitting ? (
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
                작성 중...
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                작성 완료
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PostWriting
