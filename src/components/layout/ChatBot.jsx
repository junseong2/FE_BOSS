import { useState } from "react";
import "./ChatBot.css"; // 스타일 파일 추가

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false); // 챗봇 열림/닫힘 상태
  const [messages, setMessages] = useState([]); // 대화 저장
  const [input, setInput] = useState(""); // 사용자 입력

  // 챗봇 열기/닫기
  const toggleChat = () => setIsOpen(!isOpen);

  // AI에게 메시지 보내고 응답 받기
  const sendMessage = async () => {
    if (!input.trim()) return;

    // 사용자가 보낸 메시지를 대화 목록에 추가
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput(""); // 입력창 초기화

    try {
      // AI에게 메시지 전송
      const res = await fetch("http://localhost:5000/products/recommend-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      // AI 응답을 대화 목록에 추가 (추천 상품 포함)
      const aiResponse = {
        sender: "bot",
        text: "이런 상품을 추천해요!",
        recommendations: data, // 상품 추천 리스트
      };
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  return (
    <div>
      {/* 챗봇 버튼 */}
      <div className="chatbot-button" onClick={toggleChat}>
        💬
      </div>

      {/* 챗봇 대화창 */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <h4>🎉 상품 추천 챗봇</h4>
            <button onClick={toggleChat}>✖</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
                {/* 상품 추천 메시지일 경우 */}
                {msg.recommendations && msg.recommendations.map((item, idx) => (
                  <div key={idx} className="chatbot-product">
                    <a href={item.link} target="_blank" rel="noopener noreferrer">
                      <img src={item.image} alt={item.name} />
                      <p>{item.name}</p>
                    </a>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* 입력창 */}
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

export default ChatBot;
