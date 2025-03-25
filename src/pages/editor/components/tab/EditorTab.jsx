export default function EditorTab({ tabList, onTabChange, targetTabName }) {
  return (
    <div className='m-1 w-full max-w-[230px] h-[35px] bg-white flex gap-1 justify-center'>
      {tabList?.map((tabName) => (
        <button
          key={tabName}
          onClick={() => onTabChange(tabName)}
          className={`hover:cursor-pointer rounded text-sm w-full transition duration-500 ${
            targetTabName === tabName || tabName === '미리보기'
              ? 'bg-[#4294F2] text-white'
              : 'bg-transparent'
          }`}
        >
          {tabName}
        </button>
      ))}
    </div>
  );
}
