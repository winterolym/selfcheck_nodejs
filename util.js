var hcs = require("hcs.js");
var util = {};

util.login = async function (req, res, next) {
  try {
    const schools = await hcs.searchSchool(req.body.schoolName);
    if (schools.length === 0) {
      res.status(400).json({
        error: true,
        code: "SCHOOL",
        message: "검색된 학교가 없습니다.",
      });
    }
    const school = schools[0];
    res.locals.name = req.body.name;
    res.locals.birthday = req.body.birth;
    res.locals.schoolCode = school.schoolCode;
    res.locals.endpoint = school.endpoint;

    const login = await hcs.login(
      school.endpoint,
      school.schoolCode,
      res.locals.name,
      res.locals.birthday
    );
    if (!login.success) {
      res.status(400).json({
        error: true,
        code: "LOGIN",
        message: "로그인에 실패했습니다.",
      });
    }
    if (login.agreementRequired) {
      await hcs.updateAgreement(school.endpoint, login.token);
    }
    res.locals.login_token = login.token;

    const passwordExists = await hcs.passwordExists(
      school.endpoint,
      login.token
    );
    if (!passwordExists) {
      res.status(400).json({
        error: true,
        code: "PASSWORD_NONE",
        message: "자가진단 비밀번호가 없습니다.",
      });
    }

    const secondLogin = await hcs.secondLogin(
      school.endpoint,
      login.token,
      req.body.password
    );
    if (secondLogin.success) {
      res.locals.password_token = secondLogin.token;
      next();
    }
    if (secondLogin.message) {
      res.status(400).json({
        error: true,
        code: "PASSWORD_MESSAGE",
        message: secondLogin.message,
      });
    }
    if (secondLogin.remainingMinutes) {
      res.status(400).json({
        error: true,
        code: "PASSWORD_WAIT",
        number: secondLogin.remainingMinutes,
        message:
          "5회 이상 실패하여 " +
          secondLogin.remainingMinutes +
          "분 후에 재시도가 가능합니다.",
      });
    }
    if (!secondLogin.success) {
      res.status(400).json({
        error: true,
        code: "PASSWORD_INVALID",
        number: secondLogin.failCount,
        message:
          "잘못된 비밀번호입니다. 5회 이상 실패시 5분 후에 재시도가 가능합니다. 현재 " +
          secondLogin.failCount +
          "번 실패하셨습니다.",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

util.logger = function (req, res, next) {
  console.log("[Selfcheck] type=req method="+req.method+" path="+req.originalUrl+" host="+req.hostname+" from="+req.ip+" protocol="+req.protocol);
  res.on("finish", () => {
    console.log("[Selfcheck] type=res method="+req.method+" path="+req.originalUrl+" host="+req.hostname+" from="+req.ip+" protocol="+req.protocol);
  });
  next();
};

module.exports = util;
