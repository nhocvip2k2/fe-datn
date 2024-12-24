import React, { useEffect, useState, useRef } from "react";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { getToken } from "../../services/Cookies";
import '../../test.css'; // File CSS để tùy chỉnh giao diện

function ChatAdmin() {
   const [messages, setMessages] = useState([]); // Mảng chứa tin nhắn
    const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
    const token = getToken();
    const customerId = 2; // Lấy ID khách hàng từ token
    const messagesEndRef = useRef(null); // Tham chiếu đến vị trí cuối tin nhắn
    const conversationId=1;
  const [users, setUsers] = useState([
    { id: 1, name: 'User 1' },
    { id: 2, name: 'User 2' },
  ]);

  const [selectedUser, setSelectedUser] = useState(users[0]);

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
        stompClient.subscribe(`/customer/send/admin`, (message) => {
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

  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const newMessage = {
      id: messages[selectedUser.id].length + 1,
      sender: 'Admin',
      content: inputValue,
    };

    setMessages({
      ...messages,
      [selectedUser.id]: [...messages[selectedUser.id], newMessage],
    });

    setInputValue('');
  };

  return (
    <div className="chat-admin-container">
      <div className="chat-admin-sidebar">
        <h3>Danh sách người dùng</h3>
        {users.map((user) => (
          <div
            key={user.id}
            className={`chat-admin-user ${user.id === selectedUser.id ? 'selected' : ''}`}
            onClick={() => setSelectedUser(user)}
          >
            {user.name}
          </div>
        ))}
      </div>

      <div className="chat-admin-main">
        <div className="chat-admin-header">Chat với {selectedUser.name}</div>

        <div className="chat-admin-messages">
          {messages[selectedUser.id].map((msg) => (
            <div
              key={msg.id}
              className={`chat-admin-message ${msg.sender === 'Admin' ? 'admin' : 'user'}`}
            >
              <span className="chat-admin-sender">{msg.sender}:</span> {msg.content}
            </div>
          ))}
        </div>

        <div className="chat-admin-input">
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleSend}>Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default ChatAdmin;
