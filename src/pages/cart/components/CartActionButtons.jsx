import { useNavigate } from "react-router"

export default function CartActionButtons({setShowConfirmClear}) {
    const navigate =useNavigate();
    return (
        <div className='flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4'>
            <Button
                variant='outline'
                className='w-full sm:w-auto border-red-300 text-red-600 hover:bg-red-50'
                onClick={() => setShowConfirmClear(true)}
            >
                <Trash2 className='h-4 w-4 mr-2' />
                장바구니 비우기
            </Button>

            <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
                <Button
                    variant='outline'
                    className='w-full sm:w-auto border-gray-300 text-gray-700'
                    onClick={() => navigate('/')}
                >
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    쇼핑 계속하기
                </Button>
                <Button
                    className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white'
                    onClick={() => navigate('/paymentpage')}
                >
                    <CreditCard className='h-4 w-4 mr-2' />
                    결제하기
                </Button>
            </div>
        </div>
    )
}