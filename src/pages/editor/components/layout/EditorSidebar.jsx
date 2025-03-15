export default function EditorSidebar({ children }) {
  return (
    <div className='max-w-[250px] w-full border-r border-gray-200 sticky top-0 h-screen overflow-y-auto'>
      {children}
    </div>
  );
}
