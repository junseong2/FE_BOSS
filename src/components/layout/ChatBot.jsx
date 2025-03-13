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
  
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages); // 사용자 입력을 먼저 업데이트
    setInput(""); // 입력창 초기화
  
    try {
      const res = await fetch("http://localhost:5000/products/recommend-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
  
      const textResponse = await res.text();
      console.log("Received response:", textResponse);
  
      let recommendations = [];
  
      // JSON인지 확인 후 처리
      try {
        const data = JSON.parse(textResponse); // JSON 변환 시도
        recommendations = data.products || []; // 추천 상품 리스트 추출
      } catch (err) {
        console.warn("⚠ JSON이 아닌 응답을 수동으로 처리합니다.");
  
        // **수동 파싱 개선 코드**
        if (textResponse.includes("상품명:")) {
          // 상품명, 가격, 설명이 있는 경우 (이전 방식)
          const matches = textResponse.matchAll(/상품명:\s*(.+?)\s*- 가격:\s*(\d+)원\s*- 설명:\s*(.+)/g);
          recommendations = [...matches].map(match => ({
            name: match[1],
            price: parseInt(match[2], 10),
            description: match[3],
          }));
        } else {
          // 단순한 상품 목록인 경우 (예: "음료로는 콜라, 게토레이, 생수... 있습니다.")
          const splitText = textResponse.split(":"); // "음료로는 콜라, 게토레이, 생수..."
          if (splitText.length > 1) {
            const items = splitText[1].split(",").map(item => item.trim());
            recommendations = items.map(name => ({ name }));
          }
        }
      }
  
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "이런 상품을 추천해요!", recommendations },
      ]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "서버 연결 오류가 발생했습니다." },
      ]);
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
                    {/* <a href={item.link} target="_blank" rel="noopener noreferrer"> */}
                      {/* <img src={item.image} alt={item.name} /> */}
                      <p>{item.name}</p>
                      <p>{item.price}</p>
                    {/* </a> */}
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
