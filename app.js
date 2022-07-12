const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();
const authRouter = require('./src/routes/authRouter');
const usersRouter = require('./src/routes/usersRouter');
const postsRouter = require('./src/routes/postsRouter');
const cafesRouter = require('./src/routes/cafesRouter');
const passport = require('passport');
const cors = require('cors');

let corsOptions = {
  origin: '*', // 출처 허용 옵션
  credential: true, // 사용자 인증이 필요한 리소스(쿠키 ..등) 접근
};

app.use(cors(corsOptions));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      domain: 'cpp.co.kr',
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);
app.use('/cafes', cafesRouter);

app.listen(3300, () => {
  console.log('connected on 3300 port');
});
