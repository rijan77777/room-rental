const { createReport, getAllReports, updateReportStatus } = require('../services/report');

const create = async (req, res) => {
  try {
    const { roomId, reason } = req.body;
    if (!roomId || !reason) {
      return res.status(400).json({ message: 'Room ID and reason are required' });
    }
    const report = await createReport(req.userId, { roomId, reason });
    res.status(201).json({ message: 'Report submitted', report });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAll = async (req, res) => {
  try {
    const reports = await getAllReports();
    res.status(200).json({ count: reports.length, reports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const report = await updateReportStatus(req.params.id, req.body.status);
    res.status(200).json({ report });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { create, getAll, updateStatus };