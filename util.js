var hcs = require("hcs.js");
var util = {};

util.login = async function (req, res, next) {
  const schools = await hcs.searchSchool(req.body.schoolName);
  if (schools.length === 0) {
    res.status(400).json({
      error: true,
      code: "SCHOOL",
      message: "�˻��� �б��� �����ϴ�.",
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
      message: "�α��ο� �����߽��ϴ�.",
    });
  }
  if (login.agreementRequired) {
    await hcs.updateAgreement(school.endpoint, login.token);
  }
  res.locals.login_token = login.token;

  const passwordExists = await hcs.passwordExists(school.endpoint, login.token);
  if (!passwordExists) {
    res.status(400).json({
      error: true,
      code: "PASSWORD_NONE",
      message: "�ڰ����� ��й�ȣ�� �����ϴ�.",
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
        "5ȸ �̻� �����Ͽ� ${secondLogin.remainingMinutes}�� �Ŀ� ��õ��� �����մϴ�.",
    });
  }
  if (!secondLogin.success) {
    res.status(400).json({
      error: true,
      code: "PASSWORD_INVALID",
      number: secondLogin.failCount,
      message:
        "�߸��� ��й�ȣ�Դϴ�. 5ȸ �̻� ���н� 5�� �Ŀ� ��õ��� �����մϴ�. ���� ${secondLogin.failCount}�� �����ϼ̽��ϴ�.",
    });
  }
};

module.exports = util;
