export default function SellerEditButton({
  isEditable,
  onToggle,
  onUpdate,
  productId,
  index,
  actionButtonName,
}) {
  return (
    <button
      className={`flex items-center gap-2 ${isEditable ? 'bg-[#1a416e] text-white hover:bg-[#357ab7]' : 'bg-white text-black border border-gray-300'} font-medium py-2 px-6 rounded-md justify-center w-full text-sm`}
      onClick={() => {
        if (!isEditable) {
          onToggle(index); // 수정 모드로 전환
        } else {
          onUpdate(productId); // 등록 또는 수정
        }
      }}
    >
      {isEditable ? '등록' : actionButtonName}
    </button>
  );
}
