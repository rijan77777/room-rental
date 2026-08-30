const { sendMessage, getConversation, getMyConversations } = require('../services/message');

const send = async (req, res) => {
  try {
    const { roomId, text } = req.body;
    if (!roomId || !text) return res.status(400).json({ message: 'Room ID and text required' });
    const message = await sendMessage(req.userId, { roomId, text });
    res.status(201).json({ message });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getThread = async (req, res) => {
  try {
    const messages = await getConversation(req.userId, req.params.roomId, req.params.otherUserId);
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listConversations = async (req, res) => {
  try {
    const conversations = await getMyConversations(req.userId);
    res.status(200).json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { send, getThread, listConversations };