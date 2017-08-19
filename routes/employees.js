var express = require('express');

/*
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');
var Department = mongoose.model('Department');
*/

var db = require('../lib/connection');
require('../models/MIS_Employee');
require('../models/MIS_Department');
var Employee = db.model('Employee');
var Department = db.model('Department');

var router = express.Router();

router.get("/employees",function(req,res,next){

  //Employee 전체 조회 router
  if(req.method =="GET"){
    Employee.find().sort('code').exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
    });
  }else if(req.method=="POST"){ // 사원 정보 등록
    //angular js 에서 데이터 보낼 때 서버에서 받는 방식 검색해서 맵핑하기
    Employee.code = 1;
    Employee.name = req.params.name;
    Employee.birth = req.params.birth;
    Employee.position = req.params.position;
    Employee.deparment = req.params.department;
    Employee.join_yyyymm = new Date('yyyy-MM');
    Employee.gender = req.params.gender;
    Employee.email = req.params.email;
    Employee.phone = req.params.phone;
    Employee.address = req.params.address;
    Employee.zipcode = req.params.zipcode;
    Employee.insert_date = new Date();
    Employee.update_date = new Date();
    Employee.employee_yn = 'N';
    Employee.employee_state = '00000';
    Employee.salary = req.params.salary;
    Employee.vacation_count = req.params.vacation_count;
    Employee.authority = '11111';
    Employee.last_login_date = new Date();

    Employee.save(function(error){
      if(error){
        return next(error);
      }
    })
  }else{

  }

});


router.get("/employees/:employeeId",function(req,res,next){
  if(req.method =="GET"){ //사원정보조회
    Employee.findOne({
      id:req.params.employeeId
    }).exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
    });
  }else if(req.method=="PUT"){  //사원정보수정

  }else if(req.method=="DELETE"){ //사원정보삭제

  }
});

//메일 중복 확인
router.get("/employees/emailCheck/:emailAddress",function(req,res,next){
  Employee.findOne({
    email:req.params.email
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});
