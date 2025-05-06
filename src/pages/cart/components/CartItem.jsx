export default function CartItem({
    item,
    cartItems,
    setCartItems,
    removeItemFromCart,
    updateQuantity,
}) {
    return (
        <div
            key={item.cartId}
            className='bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl shadow-sm overflow-hidden border border-blue-100 hover:shadow-md transition-shadow'
        >
            <div className='flex flex-col md:flex-row p-4'>
                {/* 상품 정보 */}
                <div className='md:w-1/2 flex gap-4 mb-4 md:mb-0'>
                    <div className='w-20 h-20 bg-white rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-200'>
                        {item.productThumbnail ? (
                            <img
                                src={item.productThumbnail}
                                alt={item.productName}
                                className='w-full h-full object-cover'
                                onError={(e) => (e.currentTarget.src = noImage)}
                            />
                        ) : (
                            <Package className='h-8 w-8 text-gray-300' />
                        )}
                    </div>
                    <div>
                        <h3 className='font-medium text-gray-900'>{item.productName}</h3>
                        <p className='text-sm text-gray-500 mt-1'>상품 ID: {item.productId}</p>
                        <button
                            className='text-red-500 hover:text-red-700 text-sm flex items-center mt-2 md:hidden'
                            onClick={() => removeItemFromCart(item.productId)}
                        >
                            <Trash2 className='h-3 w-3 mr-1' />
                            삭제
                        </button>
                    </div>
                </div>

                {/* 단가 */}
                <div className='md:w-1/6 flex justify-between md:justify-center items-center mb-3 md:mb-0'>
                    <span className='text-sm text-gray-500 md:hidden'>단가:</span>
                    <span className='font-medium text-gray-900'>
                        {item.productPrice.toLocaleString()}원
                    </span>
                </div>

                {/* 수량 */}
                <div className='md:w-1/6 flex justify-between md:justify-center items-center mb-3 md:mb-0'>
                    <span className='text-sm text-gray-500 md:hidden'>수량:</span>
                    <div className='flex items-center'>
                        <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-l-md border-gray-300'
                            onClick={() =>
                                updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                            }
                        >
                            <Minus className='h-3 w-3' />
                        </Button>
                        <Input
                            type='number'
                            value={item.quantity}
                            onChange={(e) => {
                                const newQuantity = Number.parseInt(e.target.value) || 1;
                                const updatedCart = cartItems.map((cartItem) =>
                                    cartItem.productId === item.productId
                                        ? { ...cartItem, quantity: newQuantity }
                                        : cartItem
                                );
                                setCartItems(updatedCart);
                            }}
                            onBlur={(e) =>
                                updateQuantity(item.productId, Number.parseInt(e.target.value) || 1)
                            }
                            min='1'
                            className='h-8 w-12 rounded-none text-center border-x-0 border-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                        />
                        <Button
                            variant='outline'
                            size='icon'
                            className='h-8 w-8 rounded-r-md border-gray-300'
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                            <Plus className='h-3 w-3' />
                        </Button>
                    </div>
                </div>

                {/* 합계 */}
                <div className='md:w-1/6 flex justify-between md:justify-center items-center'>
                    <span className='text-sm text-gray-500 md:hidden'>합계:</span>
                    <span className='font-bold text-blue-700'>
                        {(item.productPrice * item.quantity).toLocaleString()}원
                    </span>
                </div>

                {/* 삭제 버튼 (데스크톱) */}
                <div className='hidden md:flex md:items-center md:justify-center'>
                    <button
                        className='text-gray-400 hover:text-red-500 transition-colors'
                        onClick={() => removeItemFromCart(item.productId)}
                        aria-label='상품 삭제'
                    >
                        <Trash2 className='h-5 w-5' />
                    </button>
                </div>
            </div>
        </div>
    );
}