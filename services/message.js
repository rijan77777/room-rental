const Message = require('../models/Message');
const Room = require('../models/Room');

const sendMessage = async (senderId, { roomId, text }) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error('Room not found');

  const recipientId = room.owner.toString() === senderId ? null : room.owner;
  if (!recipientId) throw new Error('Cannot message your own room');

  const message = await Message.create({
    room: roomId,
    sender: senderId,
    recipient: recipientId,
    text
  });

  return message;
};

const getConversation = async (userId, roomId, otherUserId) => {
  const messages = await Message.find({
    room: roomId,
    $or: [
      { sender: userId, recipient: otherUserId },
      { sender: otherUserId, recipient: userId }
    ]
  }).sort({ createdAt: 1 });

  return messages;
};

const getMyConversations = async (userId) => {
  const messages = await Message.find({
    $or: [{ sender: userId }, { recipient: userId }]
  })
    .populate('room', 'title')
    .populate('sender', 'name')
    .populate('recipient', 'name')
    .sort({ createdAt: -1 });

  const seen = new Set();
  const conversations = [];
  for (const m of messages) {
    const otherUser = m.sender._id.toString() === userId ? m.recipient : m.sender;
    const key = `${m.room._id}-${otherUser._id}`;
    if (!seen.has(key)) {
      seen.add(key);
      conversations.push({
        room: m.room,
        otherUser,
        lastMessage: m.text,
        lastMessageAt: m.createdAt
      });
    }
  }
  return conversations;
};

module.exports = { sendMessage, getConversation, getMyConversations };