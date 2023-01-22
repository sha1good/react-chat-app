import "./messager.css";
import Topbar from "../../components/topbar/Topbar";
import Converation from "../../components/conversation/Conversation";
import Message from "../../components/message/Message";
import ChatOnline from "../../components/chatOnline/ChatOnline";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { io } from "socket.io-client";

const Messager = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const scrollRef = useRef();

  //Conect ot the server and get the message sent back to you
  useEffect(() => {
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  //Adding from client and getting users from server
  useEffect(() => {
    socket.current.emit("addUser", user._id);
    socket.current.on("getUsers", (users) => {
      //console.log(users);
      setOnlineUsers(
        user.followings.filter((followingUserId) =>
          users.some((user) => user.userId === followingUserId)
        )
      );
    });
  }, [user]);

   console.log(onlineUsers);

  //Display Arrival Message sent from the receiver
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        const response = await axios.get("/conversations/" + user._id);

        setConversations(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getConversation();
  }, [user]);

  useEffect(() => {
    const getMessage = async () => {
      try {
        const response = await axios.get("/messages/" + currentChat?._id);
        setMessages(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const message = {
      coversationId: currentChat._id,
      sender: user._id,
      text: newMessage,
    };

    const receiverId = currentChat?.members.find(
      (member) => member !== user._id
    );

    socket.current.emit("sendMessage", {
      senderId: user._id,
      receiverId,
      text: newMessage,
    });

    try {
      const response = await axios.post("/messages", message);
      setMessages([...messages, response.data]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <div className="container">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <input placeholder="search for friends" className="chatMenuInput" />
            {conversations.map((conversation) => (
              <div onClick={() => setCurrentChat(conversation)} key={conversation._id}>
                <Converation
                  conversation={conversation}
                  currentUser={user}
                
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef}  key={m._id}>
                      <Message
                        message={m}
                        own={m.sender === user._id}
                       
                      />
                    </div>
                  ))}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatBottomTextArea"
                    placeholder="write something"
                    onChange={(event) => setNewMessage(event.target.value)}
                    value={newMessage}
                  />
                  <button className="chatBottomButtom" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noCurrentChat">
                {" "}
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chatOnline">
          <div className="chatOnlineWrapper">
            <ChatOnline onlineUsers={onlineUsers} currentUserId={user._id} setCurrentChat={setCurrentChat}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messager;
