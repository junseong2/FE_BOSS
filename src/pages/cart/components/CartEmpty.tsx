import { ShoppingCart } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router'

export default function CartEmpty() {
    const navigate = useNavigate();
    return (
        <div className='bg-white rounded-2xl p-10 text-center'>
            <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                <ShoppingCart className='h-12 w-12 text-gray-400' />
            </div>
            <h2 className='text-2xl font-bold text-gray-900 mb-2'>장바구니가 비어 있습니다</h2>
            <p className='text-gray-500 mb-8 max-w-md mx-auto'>
                원하는 상품을 장바구니에 담고 편리하게 쇼핑을 즐겨보세요.
            </p>
            <button
                className='bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 text-lg rounded-2xl'
                onClick={() => navigate('/')}
            >
                쇼핑하러 가기
            </button>
        </div>
    )
}