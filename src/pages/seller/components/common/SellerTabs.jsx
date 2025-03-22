export default function SellerTabs({ tabList, selectedTab, onTabChange }) {
  return (
    <div aria-label='tabs' className="bg-[#e3e4e9] p-1 mt-5 border border-gray-200">
      {tabList.map((tab) => {
        return (
          <button
            key={tab.key}
            data-tab-id={tab.key}
            onClick={onTabChange}
            className={`transition-colors cursor-pointer hover:shadow-[inset_0_-1px_0_white] hover:rounded-none text-sm py-2 px-4 rounded-[2px] ${selectedTab === tab.key ? 'bg-[#1A2B3E] text-white' : 'bg-transparent text-gray-500'}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
