const express = require('express');
const app = require('./configs/express')(express);
const { stream } = require('./configs/winston');
const morgan = require('morgan');
const cors = require('cors');

const path = require('path');
const api = require('./api');

const jwtMiddleware = require('./lib/jwtMid');
const limitMiddleware = require('./lib/limiterMid');
const errHandlerMiddleware = require('./lib/errorHandlerMid');

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, '/')));

app.use(morgan('combined', { stream }));
app.use(jwtMiddleware); // 검증 미들웨어가 먼저 사용되어야 함.
app.use(limitMiddleware); // api 접속이 단시간 급격하게 증가할 시 접속 제한
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(api);

app.use(errHandlerMiddleware);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server Connected, ${port} port!`);
});
