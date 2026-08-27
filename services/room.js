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
  let sortOption = { createdAt: -1 };
  if (filters.sort === 'price_asc') sortOption = { pricePerMonth: 1 };
  if (filters.sort === 'price_desc') sortOption = { pricePerMonth: -1 };

  const rooms = await Room.find(query).populate('owner', 'name email phone').sort(sortOption);
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
const getSimilarRooms = async (roomId, city, pricePerMonth) => {
  return Room.find({
    _id: { $ne: roomId },
    isAvailable: true,
    $or: [
      { 'location.city': city },
      { pricePerMonth: { $gte: pricePerMonth * 0.7, $lte: pricePerMonth * 1.3 } }
    ]
  }).limit(3).populate('owner', 'name');
};
const User = require('../models/User');

const toggleFavorite = async (userId, roomId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const index = user.favorites.findIndex(f => f.toString() === roomId);
  let isFavorited;

  if (index > -1) {
    user.favorites.splice(index, 1);
    isFavorited = false;
  } else {
    user.favorites.push(roomId);
    isFavorited = true;
  }

  await user.save();
  return { isFavorited };
};

const getFavoriteRooms = async (userId) => {
  const user = await User.findById(userId).populate({
    path: 'favorites',
    populate: { path: 'owner', select: 'name email phone' }
  });
  if (!user) throw new Error('User not found');
  return user.favorites;
};
const getFavoritesCount = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  return user.favorites.length;
};

module.exports = { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getRoomsByOwner, removeRoomImage, getSimilarRooms, toggleFavorite, getFavoriteRooms, getFavoritesCount };