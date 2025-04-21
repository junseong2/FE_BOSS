
import { useState } from "react"
import axios from "axios"
import mainurl from "./mainurl"

function ReplyWrite({ articleId, onReplyAdded }) {
  const [replyText, setReplyText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (replyText.trim() === "") return

    setIsSubmitting(true)
    axios
      .post(mainurl() + `/articles/${articleId}/comments`, {
        replyArticle: replyText,
        userId: null,
      })
      .then((response) => {
        onReplyAdded(response.data)
        setReplyText("")
        setIsSubmitting(false)
      })
      .catch((error) => {
        console.error("댓글 작성 중 오류 발생:", error)
        alert("댓글 작성 중 오류가 발생했습니다.")
        setIsSubmitting(false)
      })
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="relative">
        <textarea
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="댓글을 입력하세요"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-y min-h-[100px]"
          disabled={isSubmitting}
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-400">{replyText.length}자</div>
      </div>

      <div className="flex justify-end mt-3">
        <button
          type="submit"
          disabled={!replyText.trim() || isSubmitting}
          className={`px-4 py-2 rounded-lg flex items-center ${
            !replyText.trim() || isSubmitting
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          } transition-colors`}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              댓글 작성
            </>
          )}
        </button>
      </div>
    </form>
  )
}

export default ReplyWrite
