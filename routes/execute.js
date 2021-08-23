var express = require('express');
const spawn = require("child_process").spawn;
var router = express.Router();

let python_cmd ='';
if(process.env.PYTHON) {
  python_cmd = 'python3';
} else {
  python_cmd = 'python';
}

router.post('/selfcheck', function(req, res){
  let selfcheck_data = '';
  const pythonProcess = spawn(python_cmd,['./scripts/selfcheck.py',req.body.name,req.body.birth,req.body.area,req.body.schoolName,req.body.schoolType,req.body.password,req.body.custom]);
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