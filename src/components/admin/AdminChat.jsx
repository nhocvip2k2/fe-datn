import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../services/Cookies";
import Header from "../header/Header";
import "../../adminchat.css";

const AdminChat = () => {
  const [messages, setMessages] = useState([]); // Mảng chứa tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const [users, setUsers] = useState([]); // Danh sách người dùng
  const [selectedUser, setSelectedUser] = useState(null); // User đang được chọn
  const [conversationId, setConversationId] = useState(null); // ID cuộc trò chuyện
  const messagesEndRef = useRef(null); // Tham chiếu đến vị trí cuối tin nhắn
  const token = getToken();
  let stompClient = useRef(null); // Tham chiếu đến WebSocket client

  // Hàm tự động cuộn đến tin nhắn mới nhất
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Kết nối WebSocket
  const connectWebSocket = () => {
    const socket = new SockJS("https://datn.up.railway.app/ws");
    stompClient.current = Stomp.over(socket);

    stompClient.current.connect({}, () => {
      if (conversationId) {
        stompClient.current.subscribe(`/customer/send/admin/${conversationId}`, (message) => {
          const msgContent = JSON.parse(message.body);
          setMessages((prev) => sortMessages([...prev, msgContent]));
        });
      }
    });
  };

  // Ngắt kết nối WebSocket
  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  // Kết nối lại WebSocket khi conversationId thay đổi
  useEffect(() => {
    disconnectWebSocket();
    if (conversationId) {
      connectWebSocket();
      fetchMessages(); // Gọi API để lấy tin nhắn
    }

    return () => disconnectWebSocket(); // Ngắt kết nối khi unmount
  }, [conversationId]);

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://datn.up.railway.app/api/admin/chat/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Lỗi mạng");

        const data = await response.json();
        setUsers(data.content);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, [token]);

  // Hàm lấy tin nhắn từ API
  const fetchMessages = async () => {
    if (!conversationId) return; // Không tải nếu chưa chọn user

    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/chat/${conversationId}?page=0&size=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) throw new Error("Lỗi khi lấy tin nhắn");

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

  // Cuộn xuống cuối cùng mỗi khi tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hàm sắp xếp tin nhắn theo thời gian
  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => a.createdAt - b.createdAt);
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    try {
      const response = await fetch(
        `https://datn.up.railway.app/api/admin/chat/?customerId=${selectedUser.customerId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: newMessage, senderRole: "admin" }),
        }
      );

      if (!response.ok) throw new Error("Lỗi khi gửi tin nhắn");

      const data = await response.json();
      setMessages((prev) => sortMessages([...prev, data]));
      setNewMessage("");
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
    }
  };

  // Xử lý chọn user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setConversationId(user.id); // Cập nhật conversationId dựa trên user
    console.log(conversationId)
    setMessages([]); // Làm sạch tin nhắn trước khi tải lại
  };

  return (
    <>
    <Header/>
    <div className="admin">
      <div className="user-list-container">
        <h2 className="user-list-header">Danh sách người dùng</h2>
        <ul className="user-list">
          {users.map((user, index) => (
            <li
              key={index}
              className={`user-list-item ${selectedUser?.customerId === user.customerId ? "active" : ""}`}
              onClick={() => handleUserSelect(user)}
            >
              {user.email}
            </li>
          ))}
        </ul>
      </div>
      <div className="admin-chat-container">
      <h2>{selectedUser ? `Chat với ${selectedUser.name || `User ${selectedUser.customerId}`}` : "Chat"}</h2>
        <div className="admin-chat--box">
          <div className="admin-messages">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`admin-message ${msg.senderRole === "admin" ? "sent" : "received"}`}
                >
                  <p>{msg.content}</p>
                </div>
              ))
            ) : (
              <p>Không có tin nhắn nào.</p>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="admin-send-message">
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
    </div>
    </>
  );
};

export default AdminChat;
