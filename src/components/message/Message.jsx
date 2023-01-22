import "./message.css";
import { format } from "timeago.js";
const Message = ({ message, own }) => {
  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          src="https://imgd-ct.aeplcdn.com/1056x660/ec/79/85/9802/img/ol/Lamborghini-Aventador-Front-view-52649.jpg?v=201711021421&q=75"
          className="messageImg"
          alt=""
        />
        <p className="messageText">{message.text}</p>
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
};

export default Message;
