import { IoSaveOutline } from 'react-icons/io5';

export default function EditorHeader({ onSave }) {
  return (
    <div className='w-full flex justify-between items-center p-2 md:p-4 bg-blue-500 text-white border-b border-gray-200'>
      <h2 className='text-lg font-semibold'>Editor</h2>
      <button
        onClick={onSave}
        className='bg-white px-4 h-[35px] rounded-[3px] flex items-center gap-2 text-[12.5px] font-medium shadow z-10 cursor-pointer'
      >
        <IoSaveOutline color='#4294F2' />
        <span className='text-[#4294F2]'>변경사항 저장</span>
      </button>
    </div>
  );
}
