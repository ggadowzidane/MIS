var mongoose = require('mongoose');
var dbUrl = "mongodb://ggadow:eoqkfdl1!@ds011218.mlab.com:11218/mis";

mongoose.connect(dbUrl);
//var db = mongoose.createConnection(dbUrl);

// 컨트롤 + C를 누르면 몽구스 연결 종료
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected');
    process.exit(0);
  });
});

require('../models/MIS_Employee');
require('../models/MIS_Department');
require('../models/MIS_Approval');
require('../models/MIS_Resource');
require('../models/MIS_Vacation');
