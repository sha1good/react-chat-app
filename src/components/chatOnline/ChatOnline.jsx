import "./chatOnline.css";
import { useState, useEffect } from "react";
import axios from "axios";

const ChatOnline = ({ onlineUsers, currentUserId, setCurrentChat }) => {
  const [allOurFriends, setAllOurFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);

  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const getAllFriends = async () => {
      try {
        const response = await axios.get("/users/friends/" + currentUserId);
        setAllOurFriends(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllFriends();
  }, [currentUserId]);

  console.log(allOurFriends);

  //Online user
  useEffect(() => {
    setOnlineFriends(
      allOurFriends.filter((friends) => onlineUsers.includes(friends._id))
    );
  }, [allOurFriends, onlineUsers]);

  console.log(onlineFriends);

  const handleOnlineClick = async (userOnline) => {
    try {
      const response = await axios.get(
        `/conversations/find/${currentUserId}/${userOnline._id}`
      );
    //console.log(response.data[0]); getting object here [0] if you use find() otherwise you can use findOne() at backend
      setCurrentChat(response.data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chatOnline">
      {onlineFriends.map((onlineFriend) => (
        <div
          className="chatOnlineFriend"
          onClick={() => handleOnlineClick(onlineFriend)}
          key={onlineFriend._id}
        >
          <div className="chatOnlineImgContainer">
            <img
              src={
                onlineFriend?.profilePicture
                  ? PF + onlineFriend.profilePicture
                  : "https://imgd-ct.aeplcdn.com/1056x660/ec/79/85/9802/img/ol/Lamborghini-Aventador-Front-view-52649.jpg?v=201711021421&q=75"
              }
              alt=""
              className="chatOnlineImg"
            />
            <div className="chatOnlineBadge"></div>
          </div>
          <span className="chatOnlineName">{onlineFriend.username}</span>
        </div>
      ))}
    </div>
  );
};

export default ChatOnline;
