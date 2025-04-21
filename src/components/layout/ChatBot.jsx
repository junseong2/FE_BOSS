
import { useState, useEffect, useRef } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import bossLogo from '../../assets/boss_logo.jpg';
import './ChatBot.css';
import { BASE_URL,DOM_URL } from '../../lib/api';


function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const divRef = useRef(null);
  const sendMessage = async () => {
    if (!input.trim()) return;

    setLoading(true);

    setMessages((prev) => [...prev, { class: 0, sender: 'user', text: input }]);
    setInput('');

    try {
      const res = await fetch(
        BASE_URL+`/vector/rag?query=${encodeURIComponent(input)}`,
        {
          method: 'GET',
          headers: { Accept: 'application/json' },
        },
      );

      const data = await res.json();

      if (data.class === 1 && Array.isArray(data.recommendation)) {
        setMessages((prev) => [
          ...prev,
          {
            class: 1,
            sender: 'bot',
            text: data.text || '이 상품들을 추천드려요!',
            recommendation: data.recommendation,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            class: 0,
            sender: 'bot',
            text: data.text || '답변을 찾을 수 없습니다.',
          },
        ]);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      setMessages((prev) => [
        ...prev,
        { class: 0, sender: 'bot', text: BASE_URL+`/vector/rag?query=${encodeURIComponent(input)}`+'서버 오류가 발생했습니다.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [loading]);

  return (
    <div>
      <div
        className='fixed bottom-4 right-4 w-16 h-16 z-[40] cursor-pointer shadow-xl rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-105 transition-all'
        onClick={toggleChat}
      >

        <img src={bossLogo}alt='Chat Icon' className='w-10 h-10' />

      </div>

      {isOpen && (
        <div className='fixed bottom-24 right-4 w-96 max-w-[95vw] h-[550px] bg-white shadow-2xl border border-gray-200 rounded-3xl flex flex-col z-[9999] overflow-hidden animate-fadeInUp'>
          <div className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white'>
            <h4 className='text-base font-bold flex items-center'>
              {' '}
              <img
                src={bossLogo}
                alt='Chat Background'
                className=' w-8 h-8  pointer-events-none select-none z-0'
              />{' '}
              BOSS 챗봇
            </h4>
            <button onClick={toggleChat} className='text-xl hover:text-blue-100'>
              ✖
            </button>
          </div>


          <div className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">
            <img
              src={bossLogo}

              alt='Chat Background'
              className='absolute top-1/2 left-1/2 w-32 h-32  -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0'

            />

            <div className='relative z-10'>
              {messages.map((msg, index) => (
                <div
                  key={index}

                  ref={divRef}



                  className={`rounded-xl px-3 py-2 my-4 text-sm max-w-[80%] break-words ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 ml-auto text-right'
                      : 'bg-white border border-gray-200'
                  }`}

                >
                  <p>{msg.text}</p>
                  {msg.class === 1 &&
                    Array.isArray(msg.recommendation) &&
                    msg.recommendation.map((item, idx) => (
                      <ProductRecommendationCard
                        key={idx}
                        productId={item.productId}
                        reason={item.reason}
                      />
                    ))}
                </div>
              ))}
              {/* 로딩 스피너 */}
              {loading ? <BounceLoader color='#1b94ff' className='mx-auto mt-8 w-5 h-5' /> : null}
            </div>
          </div>


          <div className='flex px-3 py-2 border-t bg-white border-gray-200'>

            <input
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className=' border-gray-200 flex-1 px-3 py-2 text-sm border rounded-l-xl focus:outline-none'
              placeholder='추천받고 싶은 상품을 입력하세요'
            />
            <button
              onClick={sendMessage}
              className='bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600 text-sm'
            >
              전송
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductRecommendationCard({ productId, reason }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {

        const res = await fetch(BASE_URL+`/products/${productId}`);
        const data = await res.json();

        setProduct(data);
      } catch (error) {
        console.error('상품 정보 실패:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return null;

  const imageUrl = product.gImage?.split(',')[0] || "/default-product.jpg";

  return (
    <div className='mt-2 border border-gray-200 rounded-xl overflow-hidden'>
      <a
        href={DOM_URL+`/product/${productId}`}
        target='_blank'
        rel='noopener noreferrer'
        className='block hover:bg-gray-50'
      >

        <img
          src={BASE_URL+`/uploads/${imageUrl}`}
          alt={product.name}
          className="w-full h-28 object-cover"
        />
        <div className="p-2">
          <p className="text-sm font-medium text-gray-700">{product.name}</p>
          <p className="text-xs text-gray-500 mt-1 italic">{reason}</p>
          <p className="text-sm font-bold text-blue-600 mt-1">{product.price?.toLocaleString()}원</p>

        </div>
      </a>
    </div>
  );
}

export default ChatBot;