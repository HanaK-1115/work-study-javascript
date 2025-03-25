const express = require('express');
const router = express.Router();
const paidLeaveController = require('../controllers/paidLeaveController');

router.post('/apply', paidLeaveController.applyForPaidLeave);
router.get('/applications/:userId', paidLeaveController.getLeaveApplications);
router.put('/update-status', paidLeaveController.updateLeaveApplicationStatus);
router.get('/applications-all/:department', paidLeaveController.getPaidLeaveApplications);

module.exports = router;
