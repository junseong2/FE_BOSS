import { CreditCard, Home, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router"
import Button from './ui/Button'

export default function CartHeader({cartItems}) {
    const navigate = useNavigate();
    return (
        <div className='max-w-6xl mx-auto mb-8'>
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                <div>
                    <h1 className='text-3xl font-bold text-gray-900 flex items-center gap-2'>
                        <ShoppingCart className='h-8 w-8 text-blue-600' />
                        장바구니
                    </h1>
                    <p className='text-gray-500 mt-1'>
                        {cartItems?.length > 0
                            ? `${cartItems.length}개의 상품이 장바구니에 있습니다`
                            : '장바구니가 비어 있습니다'}
                    </p>
                </div>
                <div className='flex items-center gap-3'>
                    <Button
                        variant='outline'
                        className='border-gray-300 text-gray-700 hover:bg-gray-50'
                        onClick={() => navigate('/')}
                    >
                        <Home className='h-4 w-4 mr-2' />
                        쇼핑 계속하기
                    </Button>
                    {cartItems?.length > 0 && (
                        <Button
                            className='bg-blue-600 hover:bg-blue-700 text-white'
                            onClick={() => navigate('/paymentpage')}
                        >
                            <CreditCard className='h-4 w-4 mr-2' />
                            결제하기
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}