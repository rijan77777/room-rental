const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');

const getAllUsers = async () => {
  return User.find().select('-password');
};

const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');
  await user.deleteOne();
  return { message: 'User deleted' };
};

const getStats = async () => {
  const totalUsers = await User.countDocuments();
  const totalOwners = await User.countDocuments({ role: 'owner' });
  const totalTenants = await User.countDocuments({ role: 'tenant' });
  const totalRooms = await Room.countDocuments();
  const totalBookings = await Booking.countDocuments();
  const totalRevenue = await Payment.aggregate([
    { $match: { status: 'completed' } },
    { $group: { _id: null, total: { $sum: '$platformFee' } } }
  ]);

  return {
    totalUsers,
    totalOwners,
    totalTenants,
    totalRooms,
    totalBookings,
    totalPlatformRevenue: totalRevenue[0]?.total || 0
  };
};


const getAllRoomsAdmin = async () => {
  return Room.find().populate('owner', 'name email');
};

const deleteRoomAdmin = async (roomId) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error('Room not found');
  await room.deleteOne();
  return { message: 'Room deleted by admin' };
};

const getAllBookingsAdmin = async () => {
  const bookings = await Booking.find()
    .populate('room', 'title')
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  const bookingsWithPayments = await Promise.all(
    bookings.map(async (booking) => {
      const payment = await Payment.findOne({ booking: booking._id });
      return { ...booking.toObject(), payment };
    })
  );

  return bookingsWithPayments;
};

const getRevenueChartData = async () => {
  const payments = await Payment.aggregate([
    { $match: { status: 'completed' } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
        revenue: { $sum: '$platformFee' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  return payments.map(p => ({ month: p._id, revenue: p.revenue }));
};

module.exports = { getAllUsers, deleteUser, getStats, getAllRoomsAdmin, deleteRoomAdmin, getAllBookingsAdmin, getRevenueChartData };