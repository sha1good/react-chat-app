const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  //If userId is in the  users array before, we are not going to add new user, otherwise we will
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

 const removeUser = (socketId) =>{
   users = users.filter((user) => user.socketId !== socketId);
 }

  const getAUser = (userId) =>{
      return users.find((user) => user.userId === userId);
  }

io.on("connection", (socket) => {
  //when ceonnect
  console.log("A user has been connected!");

  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //Send from client and get message from this server
  socket.on("sendMessage", ({senderId, receiverId, text})=>{
      const user = getAUser(receiverId);
      //Now let us send a message to a single user
      io.to(user.socketId).emit("getMessage",{
        senderId,
        text
      })
  })

  //when disconnect
   socket.on("disconnect", ()=>{
     console.log("A user has been disconnected");
     removeUser(socket.id);
     io.emit("getUsers", users); //Returning  the remaing list of users after disconnection
   })
});
