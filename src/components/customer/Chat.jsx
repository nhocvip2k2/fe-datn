import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../services/Cookies";
import "../../chat.css"; // Import CSS

const Chat = () => {
  const [messages, setMessages] = useState([]); // Mảng chứa tất cả tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới nhập
  const customerId = 2; // ID khách hàng (giả lập)

  // Kết nối WebSocket
  useEffect(() => {
    const socket = new SockJS("https://backend-h1zl.onrender.com/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      // Lắng nghe tin nhắn từ admin
      stompClient.subscribe(`/send/customer/${customerId}`, (message) => {
        const msgContent = JSON.parse(message.body);
        // Cập nhật tin nhắn khi admin gửi tin nhắn mới
        setMessages((prev) => sortMessages([...prev, msgContent]));
      });

      // Lắng nghe thông báo mới từ admin
      stompClient.subscribe(`/notify/newOrderPaid`, (message) => {
        const msgContent = JSON.parse(message.body);
        // Cập nhật tin nhắn khi admin gửi tin nhắn mới
        setMessages((prev) => sortMessages([...prev, msgContent]));
      });
    });

    return () => stompClient.disconnect(); // Ngắt kết nối WebSocket khi component bị hủy
  }, [customerId]);

  // Lấy tin nhắn từ API khi load trang
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = getToken();
        const response = await fetch(
          `https://backend-h1zl.onrender.com/api/customer/chat?page=0&size=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch messages");

        const data = await response.json();
        const allMessages = data.content.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt), // Đảm bảo rằng createdAt là kiểu Date
        }));

        setMessages(sortMessages(allMessages)); // Sắp xếp tin nhắn
      } catch (error) {
        console.error("Lỗi khi lấy tin nhắn:", error);
      }
    };

    fetchMessages();
  }, []);

  // Hàm sắp xếp tin nhắn theo createdAt (xen kẽ giữa khách hàng và admin)
  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => a.createdAt - b.createdAt);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const token = getToken();
      const response = await fetch(
        `https://backend-h1zl.onrender.com/api/customer/chat`, // Đổi API đúng cho admin
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage, senderRole: "admin" }), // Gửi tin nhắn với senderRole là admin
        }
      );

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();
      // Sau khi gửi thành công, cập nhật lại tin nhắn
      setMessages((prev) => {
        const updatedMessages = [...prev, data]; // Thêm tin nhắn mới vào danh sách
        return sortMessages(updatedMessages); // Sắp xếp lại theo thời gian
      });

      setNewMessage(""); // Reset ô input sau khi gửi
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat với Admin</h2>
      <div className="chat-box">
        <div className="messages">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.senderRole === "customer" ? "customer" : "admin"}`}
              >
                <p>{msg.content}</p>
              </div>
            ))
          ) : (
            <p>Không có tin nhắn nào.</p>
          )}
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

export default Chat;
