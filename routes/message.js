const router = require("express").Router();
const Message = require("../models/Message");

router.post("/", async (request, response) => {
  const newMessage = new Message(request.body);

  try {
    const savedMessage = await newMessage.save();
    response.status(200).json(savedMessage);
  } catch (err) {
    response.status(500).json(err);
  }
});

//get

router.get("/:coversationId", async (request, response) => {
  try {
    const messages = await Message.find({
       coversationId: request.params.coversationId,
    });
    response.status(200).json(messages);
  } catch (err) {
    response.status(500).json(err);
  }
});

module.exports = router;
