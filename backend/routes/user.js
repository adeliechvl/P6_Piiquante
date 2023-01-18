const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const checkEmail = require('../middleware/check-email');

router.post('/signup', checkEmail, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;