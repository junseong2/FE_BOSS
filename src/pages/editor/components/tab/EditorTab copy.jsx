import { useNavigate } from 'react-router-dom';

export default function EditorTab({ tabList, onTabChange, targetTabName }) {
  const navigate = useNavigate();

  const handleTabChange = (tabName) => {
    onTabChange(tabName);

    if (tabName === '모바일미리보기') {
      navigate('/mobileeditor');
    } else if (tabName === '미리보기') {
      navigate('/editor');
    }
  };

  return (
    <div className='m-1 w-full max-w-[230px] h-[35px] bg-white flex gap-1 justify-center'>
      {tabList?.map((tabName) => (
        <button
          key={tabName}
          onClick={() => handleTabChange(tabName)}
          className={`hover:cursor-pointer rounded text-sm w-full transition duration-500 ${
            targetTabName === tabName
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
