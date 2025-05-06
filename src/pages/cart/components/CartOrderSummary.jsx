// interface PropsType { }

export default function CartOrderSummary({cartItemCount, calculateTotal}) {
    return (
        <div className='bg-white rounded-xl shadow-md p-6 border border-gray-200'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div>
                    <h3 className='text-lg font-medium text-gray-900 mb-1'>주문 요약</h3>
                    <p className='text-gray-500 text-sm'>총 {cartItemCount}개 상품</p>
                </div>

                <div className='flex flex-col items-end'>
                    <div className='flex items-center gap-2 mb-1'>
                        <span className='text-gray-600'>상품 금액:</span>
                        <span className='font-medium'>{calculateTotal().toLocaleString()}원</span>
                    </div>
                    <div className='flex items-center gap-2 mb-1'>
                        <span className='text-gray-600'>배송비:</span>
                        <span className='font-medium'>무료</span>
                    </div>
                    <div className='flex items-center gap-2 text-lg mt-2'>
                        <span className='font-medium text-gray-900'>총 결제 금액:</span>
                        <span className='font-bold text-blue-700'>
                            {calculateTotal().toLocaleString()}원
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}