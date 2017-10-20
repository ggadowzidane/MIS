//필요한 객체 호출
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors'); //크로스 도메인 관련 객체

require('./lib/connection');
//route 호출
var employees = require('./routes/employees');
var departments = require('./routes/departments');
var login = require('./routes/login');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// 애플리케이션 라우트
app.use(login);
app.use(departments);
app.use(employees);


// 404를 잡아 오류 처리기로 전달
app.use(function(req, res, next) {
  var err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// 오류 처리기

// 스택 추적을 출력하는 개발자용 오류 처리기
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
      message: err.message,
      error: err
    });
  });
}

// 실제 서비스용 오류 처리기
// 사용자에게 스택 추적을 유출하지 않는다.
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
});

module.exports = app;
