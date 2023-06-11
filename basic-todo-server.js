// const dotenv = require("dotenv").config();
const jsonServer = require("json-server");
const router = jsonServer.router("bo-auth.json");
const bodyParser = require("body-parser");
const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const db = router.db;
const jwt = require("jsonwebtoken");
const SECRET_KEYS = "mysecretkey";

// bodyParser 미들웨어 사용하여 POST 요청 body 파싱
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/auth/signin", (req, res) => {
  const { userid, password } = req.body;
  console.log(userid);
  console.log(password);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  // userid와 passsword 검증
  if (userid === "user1@test.com" && password === "Password1!") {
    // JWT 토큰 생성
    const token = jwt.sign({ userid }, SECRET_KEYS);
    const msg = "login success";

    res.json({ msg, token });
  } else {
    res.json({ msg: "login failed" });
  }
});

app.post("/auth/signup", (req, res) => {
  const { userid, password } = req.body;
  console.log(userid);
  console.log(password);

  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  const response = { msg: "signup success!" };

  res.json(response);
});

// JSON-Server 미들웨어 추가
app.use(middlewares);

// JSON-Server 라우터 추가
app.use(router);

// 서버 실행
app.listen(4000, () => {
  console.log("JSON Server is running");
});
