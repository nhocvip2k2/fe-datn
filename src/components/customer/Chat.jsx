import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../services/Cookies";
import Cookies from "js-cookie";
import "../../Chat.css";
const Chat = () => {
  const [messages, setMessages] = useState([]); // Mảng chứa tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const [error, setError] = useState(null); // Trạng thái lỗi
  const messagesEndRef = useRef(null); // Tham chiếu đến vị trí cuối tin nhắn

  // Lấy token
  const token = getToken();
  let customerId = null;

  if (token) {
    try {
      const parts = token.split(".");
      if (parts.length === 3) {
        const decodedToken = JSON.parse(atob(parts[1]));
        customerId = decodedToken?.userId || null;
      }
    } catch (error) {
      Cookies.remove("accessToken");
    }
  } else {
    Cookies.remove("accessToken");
  }

  // Hàm tự động cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Kết nối WebSocket
  useEffect(() => {
    if (!customerId || error) return;

    const socket = new SockJS("https://datn.up.railway.app/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe(`/admin/send/customer/${customerId}`, (message) => {
        const msgContent = JSON.parse(message.body);
        setMessages((prev) => sortMessages([...prev, msgContent]));
      });
    });

    return () => stompClient.disconnect();
  }, [customerId, error]);

  // Lấy tin nhắn từ API khi load trang
  useEffect(() => {
    if (!token || error) return;

    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `https://datn.up.railway.app/api/customer/chat?page=0&size=20`,
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
      } catch (fetchError) {
        console.error("Lỗi khi lấy tin nhắn:", fetchError.message);
      }
    };

    fetchMessages();
  }, [token, error]);

  // Cuộn xuống cuối cùng mỗi khi tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/customer/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage, senderRole: "customer" }),
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      setMessages((prev) => sortMessages([...prev, data]));
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error.message);
    }
  };

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Admin</h2>
      </div>
      <div className="chat-box">
        <div className="messages" style={{ height: "400px", overflowY: "auto" }}>
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${
                  msg.senderRole === "customer" ? "sent" : "received"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))
          ) : (
            <p>Không có tin nhắn nào.</p>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="send-message input-group">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="form-control"
          />
          <button onClick={handleSendMessage} className="btn btn-primary">
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
