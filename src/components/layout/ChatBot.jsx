import { useState, useEffect } from "react";
import "./ChatBot.css";

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { class: 0, sender: "user", text: input }
    ]);
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
        const botMessage = {
          class: 1,
          sender: "bot",
          text: data.text || "이 상품들을 추천드려요!",
          recommendation: data.recommendation // 배열 그대로 저장
        };

        setMessages((prev) => [...prev, botMessage]);
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
        {
          class: 0,
          sender: "bot",
          text: "서버 오류가 발생했습니다.",
        },
      ]);
    }
  };

  return (
    <div>
      <div className="chatbot-button" onClick={toggleChat}>
        💬
      </div>

      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>🎉 상품 추천 챗봇</h4>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                <p>{msg.text}</p>

                {/* 추천 메시지일 경우 */}
                {msg.class === 1 && Array.isArray(msg.recommendation) && (
                  msg.recommendation.map((item, idx) => (
                    <ProductRecommendationCard
                      key={idx}
                      productId={item.productId}
                      reason={item.reason}
                    />
                  ))
                )}
              </div>
            ))}
          </div>

          <div className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="추천받고 싶은 상품을 입력하세요!"
            />
            <button onClick={sendMessage}>전송</button>
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
        // 실제 API 연결 시 아래 주석 해제
        // const res = await fetch(`http://localhost:5000/products/${productId}`);
        // const data = await res.json();

        // 임시 더미 데이터 (응답 형식 예측 기반)
        const data = {
          productId,
          name: "더미 사진",
          description: "사진입니다.",
          gImage: ["http://localhost:5000/uploads/sample.jpg"]
        };

        setProduct(data);
      } catch (error) {
        console.error("상품 정보 가져오기 실패:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  if (!product) return null;

  return (
    <div className="chatbot-product" style={{ marginBottom: "1rem" }}>
      <a
        href={`http://localhost:5173/product/${productId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <p><strong>{product.name}</strong></p>
        {product.gImage?.[0] && (
          <img
            src={product.gImage[0]}
            alt={product.name}
            style={{ width: "100%", maxWidth: "200px", borderRadius: "8px" }}
          />
        )}
        <p style={{ marginTop: "0.5rem", fontStyle: "italic" }}>{reason}</p>
      </a>
    </div>
  );
}

export default ChatBot;