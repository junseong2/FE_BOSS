import { IoExitOutline } from "react-icons/io5";
import { useNavigate } from "react-router";

function SellerHeader({ title, children }) {
  const navigate = useNavigate();
  return (
    <header className='flex items-center justify-between w-full bg-white p-4 border-b border-gray-200 shadow-sm'>
      <h1 className='text-lg font-semibold md:text-xl'>{title}</h1>
      <div className='flex items-center gap-4'>{children}</div>
      <button onClick={()=> navigate("/")} title="대시보드 나가기" className="hover:text-gray-600 cursor-pointer flex items-center gap-2"><IoExitOutline/>나가기</button>
    </header>
  );
}
export default SellerHeader;
