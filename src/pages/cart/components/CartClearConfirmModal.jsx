import Button from './ui/Button'
export default function CartClearConfirmModal({setShowConfirmClear, showConfirmClear, clearCart}) {
    return (
        <div
            aria-hidden={showConfirmClear ? 'false' : 'true'}
            className={`${showConfirmClear ? 'visible opacity-100' : 'invisible opacity-0'} fixed inset-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-50 transition`}
        >
            <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl animate-scale-in'>
                <h3 className='text-xl font-bold mb-3 text-gray-900'>장바구니 비우기</h3>
                <p className='text-gray-600 mb-6'>장바구니의 모든 상품이 삭제됩니다. 계속하시겠습니까?</p>
                <div className='flex justify-end gap-3'>
                    <Button
                        variant='outline'
                        className='border-gray-300 text-gray-700 hover:bg-gray-50'
                        onClick={() => setShowConfirmClear(false)}
                    >
                        취소
                    </Button>
                    <Button className='bg-red-500 hover:bg-red-600 text-white' onClick={clearCart}>
                        비우기
                    </Button>
                </div>
            </div>
        </div>
    )
}