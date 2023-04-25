const jsonServer = require("json-server");
const router = jsonServer.router("users.json");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = jsonServer.create();
const middlewares = jsonServer.defaults();
const SECRET_KEYS = "mysecretkey";

// bodyParser 미들웨어 추가
app.use(bodyParser.json());

// /auth/login 경로에 대한 POST 요청 처리
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body;

  // email과 passsword 검증
  if (email === "user1@test.com" && password === "Password1!") {
    // JWT 토큰 생성
    const token = jwt.sign({ email }, SECRET_KEYS);
    const msg = "login success";
    res.json({ msg, token });

    // users.json 파일 내 auth 객체에 msg와 token 값 push
    const db = router.db;
    db.set("auth.msg", msg).write();
    db.set("auth.token", token).write();
  } else {
    res.json({ msg: "login failed" });
  }
});

// JSON-Server 미들웨어 추가
app.use(middlewares);

// JSON-Server 라우터 추가
app.use(router);

// 서버 실행
app.listen(4000, () => {
  console.log("JSON Server is running");
});
