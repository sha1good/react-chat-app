import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css";

const Converation = ({ conversation, currentUser }) => {
  const [users, setUsers] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find(
      (member) => member !== currentUser._id
    );

    const getUsers = async () => {
      try {
        const response = await axios.get("/users?userId=" + friendId);

        setUsers(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getUsers();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <img
        src={
          users.profilePicture
            ? users.profilePicture
            : PF + "person/noAvatar.png"
        }
        alt=""
        className="conversationImg"
      />
      <span className="conversationName">{users?.username}</span>
    </div>
  );
};

export default Converation;
