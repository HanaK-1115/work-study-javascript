const express = require('express');
const { registerUser, signInUser, getUserLeaveDays } = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/signin', signInUser);
router.get('/:id/leave-days', getUserLeaveDays);

module.exports = router;
