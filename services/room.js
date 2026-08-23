const Room = require('../models/Room');

const createRoom = async (ownerId, roomData) => {
  const room = await Room.create({ ...roomData, owner: ownerId });
  return room;
};

const getAllRooms = async (filters = {}) => {
  const query = { isAvailable: true };

  if (filters.city) {
    query['location.city'] = new RegExp(filters.city, 'i');
  }
  if (filters.type) {
    query.type = filters.type;
  }
  if (filters.maxPrice) {
    query.pricePerMonth = { $lte: filters.maxPrice };
  }
  if (filters.q) {
    const searchRegex = new RegExp(filters.q, 'i');
    query.$or = [
      { title: searchRegex },
      { description: searchRegex },
      { 'location.address': searchRegex },
      { 'location.district': searchRegex },
      { 'location.city': searchRegex }
    ];
  }

  const rooms = await Room.find(query).populate('owner', 'name email phone');
  return rooms;
};

const getRoomById = async (roomId) => {
  const room = await Room.findById(roomId).populate('owner', 'name email phone');
  if (!room) {
    throw new Error('Room not found');
  }
  return room;
};
const updateRoom = async (roomId, userId, updates, userRole) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  if (room.owner.toString() !== userId && userRole !== 'admin') {
    throw new Error('You can only update your own room');
  }

  Object.assign(room, updates);
  await room.save();

  return room;
};

const deleteRoom = async (roomId, ownerId) => {
  const room = await Room.findById(roomId);
  if (!room) {
    throw new Error('Room not found');
  }

  if (room.owner.toString() !== ownerId) {
    throw new Error('You can only delete your own room');
  }

  await room.deleteOne();
  return { message: 'Room deleted' };
};

const getRoomsByOwner = async (ownerId) => {
  const rooms = await Room.find({ owner: ownerId });
  return rooms;
};
const removeRoomImage = async (roomId, ownerId, imageUrl) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error('Room not found');
  if (room.owner.toString() !== ownerId) throw new Error('You can only edit your own room');

  room.images = room.images.filter(img => img !== imageUrl);
  await room.save();
  return room;
};

module.exports = { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getRoomsByOwner, removeRoomImage };