// components/Tabs.jsx
import React from 'react';

const Tabs = ({ activeTab, setActiveTab, children }) => {
  return (
    <div>
      {React.Children.map(children, child => {
        if (child.type === TabsList) {
          return React.cloneElement(child, { activeTab, setActiveTab });
        }
        if (child.type === TabsContent) {
          return React.cloneElement(child, { activeTab });
        }
        return child;
      })}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex space-x-1 rounded-md bg-gray-100 p-1">
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          active: activeTab === child.props.value,
          onClick: () => setActiveTab(child.props.value),
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ children, value, active, onClick }) => {
  return (
    <button onClick={onClick} className={`flex-1 px-3 py-1.5 text-sm font-medium rounded-md ${active ? "bg-white shadow" : "text-gray-600 hover:text-gray-900"}`}>
      {children}
    </button>
  );
};

const TabsContent = ({ children, value, activeTab }) => {
  if (value !== activeTab) return null;
  return <div className="mt-2">{children}</div>;
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
