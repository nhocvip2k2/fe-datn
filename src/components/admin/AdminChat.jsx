import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../services/Cookies";

const AdminChat = () => {
  const [messages, setMessages] = useState([]); // Mảng chứa tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const token = getToken();
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const customerId = 2; // Lấy ID khách hàng từ token
  const messagesEndRef = useRef(null); // Tham chiếu đến vị trí cuối tin nhắn
  const conversationId=1;
  // Hàm tự động cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Kết nối WebSocket
  useEffect(() => {
    const socket = new SockJS("https://backend-h1zl.onrender.com/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/send/admin`, (message) => {
        const msgContent = JSON.parse(message.body);
        setMessages((prev) => sortMessages([...prev, msgContent]));
      });
    });

    return () => stompClient.disconnect();
  }, [customerId]);

  // Lấy tin nhắn từ API khi load trang
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://backend-h1zl.onrender.com/api/admin/chat/${conversationId}?page=0&size=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        const allMessages = data.content.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt),
        }));

        setMessages(sortMessages(allMessages));
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };

    fetchMessages();
  }, [token]);

  // Cuộn xuống cuối cùng mỗi khi tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => a.createdAt - b.createdAt);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `https://backend-h1zl.onrender.com/api/admin/chat/?customerId=${customerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage, senderRole: "admin" }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages((prev) => sortMessages([...prev, data]));
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <div className="chat-box">
        <div className="messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.senderRole === "admin" ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))
          ) : (
            <p>Không có tin nhắn nào.</p>
          )}
          {/* Thẻ tham chiếu đến vị trí cuối */}
          <div ref={messagesEndRef} />
        </div>
        <div className="send-message">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
          <button onClick={handleSendMessage}>Gửi</button>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
