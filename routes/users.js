var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/userController')

/* GET users listing. */
router.get('/log-in', function (req, res, next) {
  res.render('log-in-form', { title: 'Log-in' });
});

router.post('/', user_controller.user_sign_up)

module.exports = router;
