const express = require('express');
const router = express.Router();

const checkEmail = require('../middleware/check-email');
const checkPassword = require('../middleware/check-password');

const userCtrl = require('../controllers/user');

router.post('/signup', checkEmail, checkPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;