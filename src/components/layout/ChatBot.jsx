import { useState, useEffect, useRef } from 'react';
import BounceLoader from 'react-spinners/BounceLoader';
import bossLogo from '../../assets/boss_logo.jpg';
import noImage from '../../assets/noImage.jpg';
import './ChatBot.css';
import { IoRefresh, IoRefreshCircle } from 'react-icons/io5';
import { recommendKeywordSets } from '../../data/recommendText';
import { BASE_URL } from '../../lib/api';
import { Link } from 'react-router-dom';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [keywordSet, setKeywordSet] = useState(0);


  const toggleChat = () => {
    setIsOpen(!isOpen);

    // 첫 열기일 때 인사 메시지 표시
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          class: 0,
          sender: 'bot',
          text: '안녕하세요! BOSS 챗봇입니다. 어떤 상품을 찾으시나요?',
          isNewMessage: true,
        },
      ]);

      // 잠시 후 메시지 애니메이션 효과 제거
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isNewMessage: false })));
      }, 500);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        class: 0,
        sender: 'bot',
        text: '대화가 초기화되었습니다. 어떤 상품을 찾으시나요?',
        isNewMessage: true,
      },
    ]);
    setShowIntro(true);
    setKeywordSet(0);

    // 잠시 후 메시지 애니메이션 효과 제거
    setTimeout(() => {
      setMessages((prev) => prev.map((msg) => ({ ...msg, isNewMessage: false })));
    }, 500);
  };

  const rotateKeywordSet = () => {
    setKeywordSet((prev) => (prev + 1) % recommendKeywordSets.length);
  };

  const divRef = useRef(null);
  const sendMessage = async (text = input) => {
    if (!text.trim()) return;

    setLoading(true);
    setShowIntro(false);

    // 새 메시지에 애니메이션 효과 추가
    setMessages((prev) => [
      ...prev.map((msg) => ({ ...msg, isNewMessage: false })),
      { class: 0, sender: 'user', text, isNewMessage: true },
    ]);
    setInput('');

    try {
      const res = await fetch(BASE_URL + `/vector/rag?query=${encodeURIComponent(input)}`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
      });


      const data = await res.json();

      if (data.class === 1 && Array.isArray(data.recommendation)) {
        setMessages((prev) => [
          ...prev.map((msg) => ({ ...msg, isNewMessage: false })),
          {
            class: 1,
            sender: 'bot',
            text: data.text || '이 상품들을 추천드려요!',
            recommendation: data.recommendation,
            isNewMessage: true,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev.map((msg) => ({ ...msg, isNewMessage: false })),
          {
            class: 0,
            sender: 'bot',
            text: data.text || '답변을 찾을 수 없습니다.',
            isNewMessage: true,
          },
        ]);
      }
    } catch (error) {
      console.error('서버 오류:', error);
      setMessages((prev) => [
        ...prev,
        {
          class: 0,
          sender: 'bot',
          text: BASE_URL + `/vector/rag?query=${encodeURIComponent(input)}` + ' 서버 오류가 발생했습니다.',
        },
      ]);
    } finally {
      setLoading(false);

      // 애니메이션 효과 제거
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => ({ ...msg, isNewMessage: false })));
      }, 500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  const handleKeywordClick = (keyword) => {
    sendMessage(keyword);
  };

  useEffect(() => {
    let timeId = null;
    if (divRef.current) {
      timeId = setTimeout(() => {
        divRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    return () => {
      clearTimeout(timeId);
    };
  }, [loading, messages]);

  return (
    <div>
      <div
        className='fixed bottom-4 right-4 w-16 h-16 z-[40] cursor-pointer shadow-xl rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-105 transition-all'
        onClick={toggleChat}
      >
        <img src={bossLogo} alt='Chat Icon' className='w-10 h-10' />
      </div>

      {isOpen && (
        <div className='fixed bottom-24 right-4 w-96 max-w-[95vw] h-[550px] bg-white shadow-2xl border border-gray-200 rounded-3xl flex flex-col z-[9999] overflow-hidden animate-fadeInUp'>
          <div className='flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white'>
            <h4 className='text-xl font-bold flex items-center'>
              {' '}
              <img
                src={bossLogo}
                alt='Chat Background'
                className='w-9 h-9 pointer-events-none select-none z-0 mr-2 rounded-full'
              />{' '}
              BOSS 챗봇
            </h4>
            <div className='flex items-center space-x-2'>
              <button
                onClick={() => {
                  const isDelete = confirm(
                    '확인 시 지금까지의 대화 내역이 삭제 됩니다. 그래도 초기화 하시겠습니까?',
                  );
                  isDelete && resetChat();
                }}
                className='px-2 py-1 rounded flex gap-1 items-center hover:text-blue-100 text-xl cursor-pointer'
                title='대화 초기화'
              >
                <IoRefreshCircle />
              </button>
              <button onClick={toggleChat} className='text-xl hover:text-blue-100'>
                ✖
              </button>
            </div>
          </div>

          <div className='relative flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white'>
            <img
              src={bossLogo}
              alt='Chat Background'
              className='absolute top-1/2 left-1/2 w-32 h-32 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0 opacity-10'
            />
            <div className='relative z-10'>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  ref={index === messages.length - 1 ? divRef : null}
                  className={`rounded-xl px-3 py-2 my-4 text-sm max-w-[80%] break-words ${
                    msg.sender === 'user'
                      ? 'bg-blue-100 ml-auto text-right'
                      : 'bg-white border border-gray-200'
                  } ${msg.isNewMessage ? 'animate-messageIn opacity-100' : 'opacity-90'}`}
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

              {/* 처음 채팅 시작할 때 추천 키워드 버튼들 */}
              {showIntro && messages.length > 0 && (
                <div className='mt-4 bg-blue-50 opacity-70 p-3 rounded-xl border border-blue-100 animate-fadeIn'>
                  <div className='flex justify-between items-center mb-2'>
                    <p className='text-sm text-blue-700'>추천 키워드를 선택해보세요:</p>
                    <button
                      onClick={rotateKeywordSet}
                      className='text-xs text-blue-700 hover:text-blue-900 flex items-center'
                    >
                      <span>다른 키워드 보기</span>
                      <span className='ml-1'>
                        <IoRefresh />{' '}
                      </span>
                    </button>
                  </div>

                  <div className='flex flex-wrap gap-2 animate-fadeIn' key={keywordSet}>
                    {recommendKeywordSets[keywordSet].map((keyword, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleKeywordClick(keyword+" 추천 해줘")}
                        className='bg-white text-blue-600 text-xs px-2 py-1 rounded-full border border-blue-200 hover:bg-blue-500 hover:text-white transition-colors duration-200'
                      >
                        {keyword}
                      </button>
                    ))}
                  </div>
                </div>
              )}

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
              className='border-gray-200 flex-1 px-3 py-2 text-sm border rounded-l-xl focus:outline-none'
              placeholder='추천받고 싶은 상품을 입력하세요'
            />
            <button
              onClick={() => sendMessage()}
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
        const res = await fetch(BASE_URL + `/products/${productId}`);
        const data = await res.json();
        setProduct(data);
      } catch (error) {
        console.error('상품 정보 실패:', error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return null;

  console.log(product);
  const imageUrl = product?.gimage[0] || '/default-product.jpg';

  return (
    <div className='mt-2 border border-gray-200 rounded-xl overflow-hidden'>
      <Link to={`/product/${productId}`} className='block hover:bg-gray-50'>
        <img
          src={imageUrl}
          alt={product.name}
          className='w-full h-28 object-cover'
          onError={(e) => {
            e.currentTarget.src = noImage;
          }}
        />
        <div className="p-2">
          <p className="text-sm font-medium text-gray-700">{product.name}</p>
          <p className="text-xs text-gray-500 mt-1 italic">{reason}</p>
          <p className="text-sm font-bold text-blue-600 mt-1">{product.price?.toLocaleString()}원</p>
        </div>
      </Link>
    </div>
  );
}

export default ChatBot;
