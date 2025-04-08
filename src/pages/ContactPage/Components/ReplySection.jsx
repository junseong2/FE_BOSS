"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ReplyWrite from "./ReplyWrite"
import ReplyList from "./ReplyList"
import mainurl from "./mainurl"

function ReplySection({ articleId }) {
  const [replies, setReplies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    axios
      .get(mainurl() + `/articles/${articleId}/comments`)
      .then((response) => {
        setReplies(response.data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("댓글을 불러오는 중 오류 발생:", error)
        setError("댓글을 불러오는 중 오류가 발생했습니다.")
        setIsLoading(false)
      })
  }, [articleId])

  const handleReplyAdded = (newReply) => {
    setReplies((prevReplies) => [...prevReplies, newReply])
  }

  const handleDelete = (commentId) => {
    if (window.confirm("정말 이 댓글을 삭제하시겠습니까?")) {
      axios
        .delete(mainurl() + `/articles/${articleId}/comments/${commentId}`)
        .then(() => {
          setReplies((prevReplies) => prevReplies.filter((reply) => reply.replyId !== commentId))
        })
        .catch((error) => {
          console.error("댓글 삭제 중 오류 발생:", error)
          alert("댓글 삭제 중 오류가 발생했습니다.")
        })
    }
  }

  return (
    <div className="border-t border-gray-200">
      <div className="px-6 py-5">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          댓글 {replies.length > 0 && <span className="ml-1 text-blue-500">({replies.length})</span>}
        </h3>

        <ReplyWrite articleId={articleId} onReplyAdded={handleReplyAdded} />

        <div className="mt-6">
          <ReplyList replies={replies} onDelete={handleDelete} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  )
}

export default ReplySection
