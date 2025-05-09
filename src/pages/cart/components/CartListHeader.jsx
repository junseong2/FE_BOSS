// interface PropsType { }

export default function CartListHeader() {
    return (
        <div className='hidden md:flex bg-gray-100 rounded-lg p-4 text-gray-600 font-medium'>
            <div className='w-1/2'>상품 정보</div>
            <div className='w-1/6 text-center'>단가</div>
            <div className='w-1/6 text-center'>수량</div>
            <div className='w-1/6 text-center'>합계</div>
        </div>
    )
}