
// components/Tabs.jsx
import React from "react"

const Tabs = ({ activeTab, setActiveTab, children }) => {
  return (
    <div>
      {React.Children.map(children, (child) => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab })
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-1 rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          active: activeTab === child.props.value,
          onClick: () => setActiveTab(child.props.value),
        })
      })}
    </div>
  )
}

const TabsTrigger = ({ children, value, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? "bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm"
          : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
      }`}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, activeTab }) => {
  if (value !== activeTab) return null
  return <div className="mt-4">{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
