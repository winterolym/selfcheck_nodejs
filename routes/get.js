var express = require('express');
var hcs = require('hcs.js');
var util = require('../util');
var router = express.Router();

router.get('/userinfo', util.login, async function(req, res){
  const user_info = await hcs.userInfo(res.locals.endpoint, res.locals.password_token);
  res.status(200).json(user_info);
});
router.get('/token', util.login, function(req, res){
  res.status(200).json({
    "login_token":res.locals.login_token,
    "password_token":res.locals.password_token
  });
});

module.exports = router;