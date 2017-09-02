var express = require('express');
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');
//var Department = mongoose.model('Department');
var router = express.Router();

router.all("/mis/0.1/employees",function(req,res,next){

  //Employee 전체 조회 router
  if(req.method =="GET"){
    //queryString
    var pageCount = req.params.pageCount;
    var pagingNumber = req.params.pagingNumber;
    var employeeName = req.params.employeeName;

    //queryString 중 employeeName이 없으면 관리자의 전체조회를 의미
    var array = {};

    if(employeeName==null){    }
    else {
      array["employeeName"] = employeeName;
    }

    Employee.find(array).sort('code').skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
    });


  }else if(req.method=="POST"){ // 사원 정보 등록
    //angular js 에서 데이터 보낼 때 서버에서 받는 방식 검색해서 맵핑하기
    Employee.name = req.body.EmployeeName;
    Employee.birth = req.body.EmployeeBirth;
    Employee.position = req.body.EmployeePosition;
    Employee.deparment = req.body.EmployeeDepartment;
    Employee.join_yyyymm = new Date('yyyy-MM');
    Employee.gender = req.body.EmployeeGender;
    Employee.email = req.body.EmployeeEmail;
    Employee.phone = req.body.EmployeePhone;
    Employee.address = req.body.EmployeeAddress;
    Employee.zipcode = req.body.EmployeeZipcode;
    Employee.insert_date = new Date();
    Employee.update_date = new Date();
    Employee.employee_yn = 'N';
    Employee.employee_state = '00000';
    Employee.salary = req.body.EmployeeSalary;
    Employee.vacation_count = req.body.EmployeeVacation_count;
    Employee.authority = '11111';
    Employee.last_login_date = new Date();
    Employee.id = req.body.EmployeeId;
    Employee.password = req.body.EmployeePassword;
    EMployee.type = req.body.EmployeeType;

    Employee.save(function(error){
      if(error){
        return next(error);
      }
    })
  }else{

  }

});

//비밀번호 초기화
router.get("/mis/0.1/employees/:employeeId/pwdReset",function(req,res,next){
  Employee.where({
    id:req.params.EmployeeId
  }).update({
    pw:'mis1234',
    update_date:new Date()
  }).exec(function(error){
    if(error){
      return next(error);
    }
  });
});

//비밀번호 변경
router.put("/mis/0.1/employees/:employeeId/pwdChange",function(req,res,next){
  Employee.where({
    id:req.body.EmployeeId
  }).update({
    pw:req.body.EmployeePassword,
    update_date:new Date()
  }).exec(function(error){
    if(error){
      return next(error);
    }
  });
});

router.all("/mis/0.1/employees/:employeeId",function(req,res,next){
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
    var array = {};
    if(req.body.EmployeeType==3){ //일반 사원 화면의 수정일 경우
      array["phone"]      =req.body.EmployeePhone,
      array["address"]    =req.body.EmployeeAddress,
      array["zipcode"]    =req.body.EmployeeZipcode,
      array["update_date"]=new Date()
    }else{  //마스터 및 관리자 화면의 수정일 경우
      array["name"]       =req.body.EmployeeName,
      array["gender"]     =req.body.EmployeeGender,
      array["birth"]      =req.body.EmployeeBirth,
      array["phone"]      =req.body.EmployeePhone,
      array["email"]      =req.body.EmployeeEmail,
      array["department"] =req.body.EmployeeDepartment,
      array["position"]   =req.body.EmployeePosition,
      array["address"]    =req.body.EmployeeAddress,
      array["zipcode"]    =req.body.EmployeeZipcode,
      array["salary"]     =req.body.EmployeeSalary,
      array["update_date"]=new Date()
    }
    //사원정보 수정 시 넘어오는 값을 EmployyId로 할 것 2017-08-30
    Employee.where({
      id:req.params.EmployeeId
    }).update(array).exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
    });

  }else if(req.method=="DELETE"){ //사원정보삭제
    Employee.deleteOne({id:req.params.EmployeeId});
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






module.exports = router;
