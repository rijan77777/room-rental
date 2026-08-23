const { getAllUsers, deleteUser, getStats, getAllRoomsAdmin, deleteRoomAdmin, getAllBookingsAdmin, getRevenueChartData } = require('../services/admin');

const listUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const stats = async (req, res) => {
  try {
    const data = await getStats();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const listRooms = async (req, res) => {
  try {
    const rooms = await getAllRoomsAdmin();
    res.status(200).json({ count: rooms.length, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeRoom = async (req, res) => {
  try {
    const result = await deleteRoomAdmin(req.params.id);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const listBookings = async (req, res) => {
  try {
    const bookings = await getAllBookingsAdmin();
    res.status(200).json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const revenueChart = async (req, res) => {
  try {
    const data = await getRevenueChartData();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { listUsers, removeUser, stats, listRooms, removeRoom, listBookings, revenueChart };