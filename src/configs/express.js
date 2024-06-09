module.exports = function (express) {
  const dotenv = require('dotenv');
  require('dotenv').config();
  const session = require('express-session');
  const cookieParser = require('cookie-parser');
  if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.production' });
  } else {
    dotenv.config({ path: '.env.local' });
  }

  const cors = require('cors');

  const helmet = require('helmet');

  const app = express();

  app.disable('x-powered-by');
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          formAction: ["'self'"],
          scriptSrc: ["'self'"],
        },
      },
    })
  );
  app.use(helmet.xssFilter());
  app.use(cors());

  app.use(
    session({
      secret: process.env.SESSION_KEY,
      resave: false,
      name: 'sessionId',
      cookie: {
        secure: true, // https를 통해서만 쿠키 전송
        httpOnly: true, // JavaScript가 아닌 https를 통해서만 전송, XSS 공격 보호
      },
      saveUninitialized: true,
    })
  );

  return app;
};
