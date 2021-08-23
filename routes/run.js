var express = require('express');
var hcs = require('hcs.js');
var util = require('../util');
var router = express.Router();

router.post('/selfcheck', util.login, async function(req, res){
  const survey = {
    // 학생 본인이 37.5도 이상 발열 또는 발열감이 있나요?
    Q1: false,

    // 학생에게 코로나19가 의심되는 임상증상이 있나요?
    // 기침, 호흡곤란, 오한, 근육통, 두통, 인후통, 후각·미각 소실 또는 폐렴 등
    Q2: false,

    // 학생 본인 또는 동거인이 방역당국에 의해 현재 자가격리가 이루어지고 있나요?
    Q3: false,
  };
  let result = '';
  try {
    result = await hcs.registerSurvey(res.locals.endpoint, res.locals.password_token, survey);
  } catch (err) {
    console.log(err);
  }

  if (!result) {
    res.status(400).json({
      "error":"SURVEY",
      "message":"자가진단 제출 중 오류가 생겼습니다."
    });
  }
  else {
    res.status(200).json(result);
  }
});

module.exports = router;