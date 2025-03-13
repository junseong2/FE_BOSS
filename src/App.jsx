import Form from 'react-bootstrap/Form';
import { CiHeart } from 'react-icons/ci';

function App() {
  return (
    <CartProvider>
      {' '}
      {/* CartContext로 감싸기 */}
      <div className='flex'>
        {/* 관리자 페이지가 아닐 때만 MenuBar와 Top을 렌더링 */}
        {!isAdminPage && <MenuBar />}
        <div className={`flex-1 ${!isAdminPage ? 'ml-60' : ''}`}>
          {!isAdminPage && <Top />}
          <main className='main page'>
            <Routes>
              {/* 일반 페이지 */}
              <Route path='/' element={<HomePage memberData={memberData} onAdd={handleAdd} />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/contact/*' element={<ContactPage />} />
              <Route path='/event' element={<EventPage />} />

              <Route path='/kakaomap' element={<KakaoMapPage />} />

              <Route path='/camera' element={<CameraCapturePage onAdd={handleAdd} />} />
              <Route path='/signin' element={<SignIn />} />
              <Route path='/mypage' element={<MyPage />} />
              <Route path='/signup' element={<SignUp />} />
              <Route path='/cart' element={<CartPage />} />
              <Route path='/category/:categoryId' element={<CategoryPage />} />
              <Route path='/search' element={<SearchPage />} />
              <Route path='/productlist' element={<ProductListPage />} />
              <Route path='/product/:productId' element={<ProductDetailPage />} />

              <Route path='/seller' element={<SellerPage />}>
                <Route index path='dashboard' element={<SellerDashboardPage />} />
                <Route path='product' element={<SellerProductPage />} />
                <Route path='order' element={<SellerOrderPage />} />
                <Route path='inventory' element={<SellerInventoryPage />} />
                <Route path='sales' element={<SellerSalesPage />} />
                <Route path='payment' element={<SellerPaymentPage />} />
              </Route>
            </Routes>
          </main>
        </div>
      </div>
    </CartProvider>
  );
}

export default App;
