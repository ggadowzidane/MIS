//신규 디비 셋팅하는 js파일
var async = require('async');
var mongoose = require('mongoose');
require(process.cwd() + '/lib/connection');
var Employee = mongoose.model('Employee');

var data = {
  employees:[
      {
        name:'홍길동',
        birth:'1977-11-11',
        position:'사원',
        department:'개발팀',
        join_yyyymm:'1977-11',
        picture_filepath:'./resource/images/hon123.png',
        gender:'M',
        email:'hong131323@naver.com',
        phone:'010-1111-1234',
        address:'충청북도 진천군 괴산리',
        zipcode:'15021',
        insert_date:new Date(),
        update_date:new Date(),
        employee_yn:'Y',
        employee_state:'10001',
        salary:2400,
        vacation_count:12,
        authority:'00001',
        last_login_date:new Date(),
        retire_date:new Date(),
        id:'hong1221313',
        password:'1111',
        type:3
      },
      {
        name:'왕눈이',
        birth:'1999-10-10',
        position:'인턴',
        department:'개발팀',
        join_yyyymm:'2017-11',
        picture_filepath:'./resource/images/wang123.png',
        gender:'M',
        email:'wang12344@naver.com',
        phone:'010-1111-1234',
        address:'경기도 파주시 헤이리마을',
        zipcode:'12021',
        insert_date:new Date(),
        update_date:new Date(),
        employee_yn:'Y',
        employee_state:'10002',
        salary:2400,
        vacation_count:12,
        authority:'00002',
        last_login_date:new Date(),
        retire_date:new Date(),
        id:'wang14155123',
        password:'1111',
        type:3
      },
      {
        name:'문지기',
        birth:'1969-10-10',
        position:'과장',
        department:'개발팀',
        join_yyyymm:'2007-11',
        picture_filepath:'./resource/images/moon123.png',
        gender:'M',
        email:'moon1ssss23@naver.com',
        phone:'010-1111-7234',
        address:'청담역',
        zipcode:'12321',
        insert_date:new Date(),
        update_date:new Date(),
        employee_yn:'Y',
        employee_state:'10002',
        salary:2400,
        vacation_count:12,
        authority:'00002',
        last_login_date:new Date(),
        retire_date:new Date(),
        id:'moon115151523',
        password:'1111',
        type:2
      }
  ]
}

var deleteEmployees = function(callback) {
  console.info('Deleting employees');
  Employee.remove({}, function(error, response) {
    if (error) {
      console.error('Error deleting employees: ' + error);
    }

    console.info('Done deleting employees');
    callback();
  });
};


var addEmployees = function(callback) {
  console.info('Adding employees');
  Employee.create(data.employees, function (error) {
    if (error) {
      console.error('Error: ' + error);
    }

    console.info('Done adding employees');
    callback();
  });
};


async.series([
  deleteEmployees,
  addEmployees
], function(error, results) {
  if (error) {
    console.error('Error: ' + error);
  }

  mongoose.connection.close();
  console.log('Done!');
});
