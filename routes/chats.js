const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const axios = require("axios");

// GET всі чати
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST новий чат
router.post("/", async (req, res) => {
  const chat = new Chat({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    messages: [],
  });

  try {
    const newChat = await chat.save();
    res.status(201).json(newChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT оновити чат
router.put("/:id", async (req, res) => {
  try {
    const updatedChat = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE видалити чат
router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Chat deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST нове повідомлення
router.post("/:id/messages", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    const newMessage = {
      sender: "user",
      content: req.body.content,
      timestamp: new Date(),
    };
    chat.messages.push(newMessage);
    chat.lastMessage = req.body.content;
    chat.lastMessageTime = newMessage.timestamp;
    await chat.save();

    // Отримання випадкової цитати
    const quoteResponse = await axios.get("https://api.quotable.io/random");
    const quoteContent = quoteResponse.data.content;

    // Додавання відповіді бота
    setTimeout(async () => {
      const botMessage = {
        sender: "bot",
        content: quoteContent,
        timestamp: new Date(),
      };
      chat.messages.push(botMessage);
      chat.lastMessage = quoteContent;
      chat.lastMessageTime = botMessage.timestamp;
      await chat.save();
    }, 3000);

    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET окремий чат
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }
    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
