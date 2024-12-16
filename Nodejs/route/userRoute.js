const { authentiation, restrictTo } = require('../controller/authController');
const { getAllUser } = require('../controller/userController');

const router = require('express').Router();

router.route('/').get(authentiation, restrictTo('0'), getAllUser)

module.exports = router;