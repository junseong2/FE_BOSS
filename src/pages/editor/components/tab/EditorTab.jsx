import { motion } from "framer-motion"

export default function EditorTab({ tabList, onTabChange, targetTabName }) {
  return (
    <div className="m-1 w-full max-w-[230px] h-[40px] bg-white flex gap-1 justify-center rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {tabList?.map((tabName) => {
        const isActive = targetTabName === tabName || tabName === "미리보기"

        return (
          <motion.button
            key={tabName}
            onClick={() => onTabChange(tabName)}
            className={`relative hover:cursor-pointer text-sm w-full transition duration-300 font-medium flex items-center justify-center ${
              isActive ? "text-white" : "text-gray-600 hover:text-blue-600"
            }`}
            whileTap={{ scale: 0.97 }}
          >
            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-blue-500 rounded-md"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tabName}</span>
          </motion.button>
        )
      })}
    </div>
  )
}
