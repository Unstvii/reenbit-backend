const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  messages: [messageSchema],
  lastMessage: { type: String, default: "" },
  lastMessageTime: { type: Date },
});

module.exports = mongoose.model("Chat", chatSchema);
