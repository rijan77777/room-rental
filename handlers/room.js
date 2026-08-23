const { createRoom, getAllRooms, getRoomById, updateRoom, deleteRoom, getRoomsByOwner, removeRoomImage } = require('../services/room');
const { validateRoom } = require('../validators/room');
const Room = require('../models/Room');
const create = async (req, res) => {
  try {
    const { isValid, errors } = validateRoom(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const room = await createRoom(req.userId, req.body);
    res.status(201).json({ message: 'Room created successfully', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const rooms = await getAllRooms(req.query);
    res.status(200).json({ count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOne = async (req, res) => {
  try {
    const room = await getRoomById(req.params.id);
    res.status(200).json({ room });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const update = async (req, res) => {
  try {
    const room = await updateRoom(req.params.id, req.userId, req.body, req.userRole);
    res.status(200).json({ message: 'Room updated successfully', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const remove = async (req, res) => {
  try {
    const result = await deleteRoom(req.params.id, req.userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await getRoomsByOwner(req.userId);
    res.status(200).json({ count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const uploadImage = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images uploaded' });
    }

    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'You can only upload images to your own room' });
    }

    const newImageUrls = req.files.map(file => file.path);
    room.images.push(...newImageUrls);
    await room.save();

    res.status(200).json({ message: 'Images uploaded successfully', imageUrls: newImageUrls, room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const deleteImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    const room = await removeRoomImage(req.params.id, req.userId, imageUrl);
    res.status(200).json({ message: 'Image removed', room });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports = { create, getAll, getOne, update, remove, getMyRooms, uploadImage, deleteImage };