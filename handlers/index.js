const express = require('express');
const router = express.Router();
const { register, login, forgotPassword, resetPasswordHandler } = require('./auth');
const { create, getAll, getOne, update, remove, getMyRooms, uploadImage, deleteImage, getSimilar, toggleFav, getFavorites, getFavCount, checkFavorite} = require('./room');
const { create: createBooking, getMyBookings, cancel: cancelBooking, getForOwner: getBookingsForOwner } = require('./booking');
const { create: createPayment, uploadProof, getByBooking } = require('./payment');
const { create: createReview, getForRoom } = require('./review');
const { listUsers, removeUser, stats, listRooms, removeRoom, listBookings, revenueChart } = require('./admin');
const { create: createInquiry, getForOwner: getInquiriesForOwner } = require('./inquiry');
const { getMine, markRead, markAllRead } = require('./notification');
const { protect, adminOnly } = require('../middlewares/auth');
const upload = require('../config/multer');
const { create: createReport, getAll: getAllReports, updateStatus: updateReportStatus } = require('./report');

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPasswordHandler);

router.post('/rooms', protect, create);
router.get('/rooms', getAll);
router.get('/rooms/my', protect, getMyRooms);
router.get('/rooms/:id', getOne);
router.put('/rooms/:id', protect, update);
router.delete('/rooms/:id', protect, remove);
router.post('/rooms/:id/upload-image', protect, upload.array('images', 5), uploadImage);
router.delete('/rooms/:id/image', protect, deleteImage);

router.post('/bookings', protect, createBooking);
router.get('/bookings/my', protect, getMyBookings);
router.get('/bookings/owner', protect, getBookingsForOwner);
router.put('/bookings/:id/cancel', protect, cancelBooking);

router.post('/payments', protect, createPayment);
router.post('/payments/:id/upload-proof', protect, upload.single('image'), uploadProof);
router.get('/payments/booking/:bookingId', protect, getByBooking);

router.post('/reviews', protect, createReview);
router.get('/reviews/room/:roomId', getForRoom);

router.post('/inquiries', protect, createInquiry);
router.get('/inquiries/owner', protect, getInquiriesForOwner);

router.get('/notifications', protect, getMine);
router.put('/notifications/:id/read', protect, markRead);
router.put('/notifications/read-all', protect, markAllRead);

router.get('/admin/users', protect, adminOnly, listUsers);
router.delete('/admin/users/:id', protect, adminOnly, removeUser);
router.get('/admin/stats', protect, adminOnly, stats);
router.get('/admin/rooms', protect, adminOnly, listRooms);
router.delete('/admin/rooms/:id', protect, adminOnly, removeRoom);
router.get('/admin/bookings', protect, adminOnly, listBookings);
router.get('/admin/revenue-chart', protect, adminOnly, revenueChart);
router.get('/rooms/:id/similar', getSimilar);
router.put('/rooms/:id/favorite', protect, toggleFav);
router.get('/favorites', protect, getFavorites);
router.post('/reports', protect, createReport);
router.get('/admin/reports', protect, adminOnly, getAllReports);
router.put('/admin/reports/:id', protect, adminOnly, updateReportStatus);
router.get('/favorites/count', protect, getFavCount);
router.get('/rooms/:id/favorite-status', protect, checkFavorite);

module.exports = router;