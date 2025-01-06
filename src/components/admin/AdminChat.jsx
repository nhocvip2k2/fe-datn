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
  const [userId, setUserId] = useState(null); // ID người dùng
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
      users.forEach((user) => {
        stompClient.current.subscribe(`/customer/send/admin/${user.customerId}`, (message) => {
          const msgContent = JSON.parse(message.body);
          setUsers((prevUsers) =>
            prevUsers.map((u) =>
              u.customerId === user.customerId
                ? { ...u, unreadMessages: (u.unreadMessages || 0) + 1 }
                : u
            )
          );

          if (selectedUser?.customerId === user.customerId) {
            setMessages((prev) => sortMessages([...prev, msgContent]));
          }
        });
      });
    });
  };

  // Ngắt kết nối WebSocket
  const disconnectWebSocket = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };

  // Lấy danh sách người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://datn.up.railway.app/api/admin/chat/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Lỗi mạng");

        const data = await response.json();
        const usersWithUnread = data.content.map((user) => ({
          ...user,
          unreadMessages: 0, // Mặc định số lượng tin nhắn chưa đọc là 0
        }));
        setUsers(usersWithUnread);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người dùng:", error);
      }
    };

    fetchUsers();
  }, [token]);

  // Lấy tin nhắn từ API
  const fetchMessages = async () => {
    if (!conversationId) return;

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

  // Xử lý chọn user
  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setConversationId(user.id);
    setUserId(user.customerId);

    // Reset số lượng tin nhắn chưa đọc của user này
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.customerId === user.customerId ? { ...u, unreadMessages: 0 } : u
      )
    );

    setMessages([]); // Làm sạch tin nhắn trước khi tải lại
  };

  // Cuộn xuống cuối cùng mỗi khi tin nhắn thay đổi
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Kết nối WebSocket khi danh sách người dùng thay đổi
  useEffect(() => {
    if (users.length > 0) {
      disconnectWebSocket(); // Ngắt kết nối cũ
      connectWebSocket(); // Kết nối lại
    }
    return () => disconnectWebSocket();
  }, [users]);

  // Lấy tin nhắn mỗi khi `selectedUser` hoặc `conversationId` thay đổi
  useEffect(() => {
    if (selectedUser && conversationId) {
      fetchMessages();
    }
  }, [selectedUser, conversationId]);

  // Hàm sắp xếp tin nhắn theo thời gian
  const sortMessages = (msgs) => {
    return msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
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

  return (
    <>
      <Header />
      <div className="container-fluid d-flex flex-column flex-md-row mt-6">
        <div className="col-12 col-md-3 p-3 mb-3 mb-md-0">
          <div className="card shadow-lg border-light rounded">
            <h2 className="card-header bg-primary text-white">Danh sách người dùng</h2>
            <ul className="list-group list-group-flush">
              {users.map((user) => (
                <li
                  key={user.customerId}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    selectedUser?.customerId === user.customerId ? "active" : ""
                  }`}
                  onClick={() => handleUserSelect(user)}
                >
                  {user.email}
                  <span className="badge bg-secondary">
                    {user.unreadMessages > 0 ? user.unreadMessages : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-12 col-md-9 p-3">
          <div className="card shadow-lg border-light rounded">
            <h2 className="card-header bg-success text-white">
              {selectedUser
                ? `Chat với ${selectedUser.name || `User ${selectedUser.customerId}`}`
                : "Chọn người dùng để trò chuyện"}
            </h2>
            <div className="card-body">
              <div className="messages" style={{ maxHeight: "400px", overflowY: "scroll" }}>
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message p-2 mb-2 rounded-3 ${
                        msg.senderRole === "admin" ? "bg-info text-white" : "bg-light text-dark"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <small className="text-muted">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </small>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted">Không có tin nhắn nào.</p>
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="input-group mt-3">
                <input
                  type="text"
                  className="form-control"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                />
                <button className="btn btn-primary" onClick={handleSendMessage}>
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminChat;
