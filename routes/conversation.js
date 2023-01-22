const router = require("express").Router();
const Conversation = require("../models/Conversation");

router.post("/", async (request, response) => {
  const newConversation = new Conversation({
    members: [request.body.senderId, request.body.receiveId],
  });

  try {
    const savedConversation = await newConversation.save();
    response.status(200).json(savedConversation);
  } catch (error) {
    response.status(500).json(error);
  }
});

//get conv of a user
router.get("/:memberId", async (request, response) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [request.params.memberId] },
    });

    response.status(200).json(conversation);
  } catch (error) {
    response.status(500).json(error);
  }
});

//get convo of two users
router.get("/find/:firstUserId/:secondUserId", async (request, response) => {
  try {
    const conversation = await Conversation.find({
      members: {
        $all: [request.params.firstUserId, request.params.secondUserId],
      },
    });
    response.status(200).json(conversation);
  } catch (error) {
    response.status(500).json(error);
  }
});

module.exports = router;
