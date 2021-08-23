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
  const result = await hcs.registerSurvey(res.locals.endpoint, res.locals.password_token, survey);
  console.log(result);
  res.status(200).json(result);

  // pythonProcess.on('close', (code) => {
  //   selfcheck_data = JSON.parse(selfcheck_data);
  //   if (selfcheck_data.error) {
  //     res.status(400).json({
  //       "error":selfcheck_data.code,
  //       "message":selfcheck_data.message
  //     });
  //   }
  //   else {
  //     res.status(200).json(selfcheck_data);
  //   }
  // })
});

router.post('/selfcheck-token', function(req, res){
  let selfcheck_data = '';
  const pythonProcess = spawn(python_cmd,['./scripts/selfcheck_token.py',req.body.token]);
  pythonProcess.stdout.on('data', function (data) {
    selfcheck_data += data.toString();
  });
  pythonProcess.stderr.on('data', function (data) {
    selfcheck_data += data.toString();
  });
  pythonProcess.on('close', (code) => {
    selfcheck_data = JSON.parse(selfcheck_data);
    if (selfcheck_data.error) {
      res.status(400).json({
        "error":selfcheck_data.code,
        "message":selfcheck_data.message
      });
    }
    else {
      res.status(200).json(selfcheck_data);
    }
  })
});

router.post('/generate-token', function(req, res){
  let pw_token = '';
  const pythonProcess = spawn(python_cmd,['./scripts/generate_token.py',req.body.name,req.body.birth,req.body.area,req.body.schoolName,req.body.schoolType,req.body.password]);
  pythonProcess.stdout.on('data', function (data) {
    pw_token += data.toString();
  });
  pythonProcess.stderr.on('data', function (data) {
    pw_token += data.toString();
  });
  pythonProcess.on('close', (code) => {
    pw_token = JSON.parse(pw_token);
    if (pw_token.error) {
      res.status(400).json({
        "error":pw_token.code,
        "message":pw_token.message
      });
    }
    else {
      res.status(200).json(pw_token);
    }
  })
});

module.exports = router;