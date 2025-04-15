import { useState, useEffect } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { class: 0, sender: "user", text: input }]);
    setInput("");

    try {
      const res = await fetch(
        `http://localhost:5000/vector/rag?query=${encodeURIComponent(input)}`,
        {
          method: "GET",
          headers: { Accept: "application/json" },
        }
      );

      const data = await res.json();

      if (data.class === 1 && Array.isArray(data.recommendation)) {
        setMessages((prev) => [
          ...prev,
          {
            class: 1,
            sender: "bot",
            text: data.text || "이 상품들을 추천드려요!",
            recommendation: data.recommendation,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            class: 0,
            sender: "bot",
            text: data.text || "답변을 찾을 수 없습니다.",
          },
        ]);
      }
    } catch (error) {
      console.error("서버 오류:", error);
      setMessages((prev) => [
        ...prev,
        { class: 0, sender: "bot", text: "서버 오류가 발생했습니다." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <div
        className="fixed bottom-4 right-4 w-16 h-16 z-[40] cursor-pointer shadow-xl rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-105 transition-all"
        onClick={toggleChat}
      >
        <img src="http://localhost:5000/uploads/image.jpg" alt="Chat Icon" className="w-10 h-10" />
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-4 w-96 max-w-[95vw] h-[550px] bg-white shadow-2xl border rounded-3xl flex flex-col z-[9999] overflow-hidden animate-fadeInUp">
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-sky-400 text-white">
            <h4 className="text-base font-bold">🛍️ BOSS 챗봇</h4>
            <button onClick={toggleChat} className="text-xl hover:text-blue-100">✖</button>
          </div>

          <div className="relative flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white">

            <img
              src="http://localhost:5000/uploads/image.jpg"
              alt="Chat Background"
              className="absolute top-1/2 left-1/2 w-32 h-32  -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
            />

            <div className="relative z-10">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`rounded-xl px-3 py-2 text-sm max-w-[80%] break-words ${msg.sender === "user"
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-white border border-gray-200"
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
            </div>
          </div>


          <div className="flex px-3 py-2 border-t bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-3 py-2 text-sm border rounded-l-xl focus:outline-none"
              placeholder="추천받고 싶은 상품을 입력하세요"
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded-r-xl hover:bg-blue-600 text-sm"
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
        const data = {
          productId,
          name: "더미 상품",
          description: "설명입니다.",
          gImage: ["http://localhost:5000/uploads/sample.jpg"],
        };
        setProduct(data);
      } catch (error) {
        console.error("상품 정보 실패:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) return null;

  return (
    <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
      <a
        href={`http://localhost:5173/product/${productId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block hover:bg-gray-50"
      >
        <img
          src={product.gImage[0]}
          alt={product.name}
          className="w-full h-28 object-cover"
        />
        <div className="p-2">
          <p className="text-sm font-medium text-gray-700">{product.name}</p>
          <p className="text-xs text-gray-500 mt-1 italic">{reason}</p>
        </div>
      </a>
    </div>
  );
}

export default ChatBot;
