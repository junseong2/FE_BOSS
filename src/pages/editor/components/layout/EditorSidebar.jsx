import { motion } from "framer-motion"

export default function EditorSidebar({ children }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-[250px] w-full border-r border-gray-200 sticky top-0 h-screen overflow-y-auto bg-white shadow-sm"
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-lg font-semibold text-blue-700 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            에디터 도구
          </h2>
        </div>
        <div className="flex-1 overflow-auto py-2">{children}</div>
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>© 2024 디자인 에디터</p>
            <p className="mt-1">모든 변경사항은 수동으로 저장됩니다</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
