// const dotenv = require("dotenv").config();
const jsonServer = require("json-server");
const router = jsonServer.router("bo-auth.json");
const bodyParser = require("body-parser");
const { encrypt, decrypt } = require("./utils/crypto");
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const db = router.db;

// bodyParser 미들웨어 사용하여 POST 요청 body 파싱
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", (req, res) => {
  console.log("req body: " + JSON.stringify(req.body));

  const decryptedData = decrypt(req.body.encryptedData);
  const { id, password, ip } = JSON.parse(decryptedData);
  console.log(id);
  console.log(password);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const { returncode, returnmsg, tid, authtype, authtarget } = db
    .get("auth_user")
    .value();

  const response = {
    returncode,
    returnmsg,
    tid,
    authtype,
    authtarget,
  };

  const enc_res = encrypt(JSON.stringify(response));

  res.json(enc_res);
});

// send-otp
app.get("/:authtype/:tid", (req, res) => {
  const { authtype, tid } = req.params;

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const { returncode, returnmsg } = db.get("send_otp").value();
  const response = {
    returncode,
    returnmsg,
    tid,
  };

  const enc_res = encrypt(JSON.stringify(response));
  console.log(enc_res);

  res.json(enc_res);
});

// check-otp
app.post("/:authtype/:tid", (req, res) => {
  const { authtype, tid } = req.params;
  const decryptedData = decrypt(req.body.encryptedData);
  const { otp } = JSON.parse(decryptedData);
  console.log("otp: " + otp);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const { returncode, returnmsg, login_token } = db.get("check_otp").value();
  const response = {
    returncode,
    returnmsg,
    tid,
    login_token,
  };

  const enc_res = encrypt(JSON.stringify(response));
  res.json(enc_res);
});

// JSON-Server 미들웨어 추가
app.use(middlewares);

// JSON-Server 라우터 추가
app.use(router);

// 서버 실행
app.listen(4000, () => {
  console.log("JSON Server is running");
});
