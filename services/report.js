const Report = require('../models/Report');

const createReport = async (userId, { roomId, reason }) => {
  const report = await Report.create({ room: roomId, reportedBy: userId, reason });
  return report;
};

const getAllReports = async () => {
  return Report.find()
    .populate('room', 'title')
    .populate('reportedBy', 'name email')
    .sort({ createdAt: -1 });
};

const updateReportStatus = async (reportId, status) => {
  const report = await Report.findById(reportId);
  if (!report) throw new Error('Report not found');
  report.status = status;
  await report.save();
  return report;
};

module.exports = { createReport, getAllReports, updateReportStatus };