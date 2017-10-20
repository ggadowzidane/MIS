var express = require('express');
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');

var router = express.Router();

//Employee 전체 조회 router
router.get("/mis/1.0/employees",function(req,res,next){
  //queryString

  var pageCount = parseInt(req.query.PageCount);  // 한페이지에 출력 갯수
  var pagingNumber = parseInt(req.query.PagingNumber);  // 페이지 번호
  var employeeName = req.query.EmployeeName;

  if(pageCount==undefined) { pageCount = 10; } //값이 넘어오지 않을 경우 기본값 셋팅
  if(pagingNumber==undefined) { pagingNumber = 1; }//값이 넘어오지 않을 경우 기본값 셋팅

  //queryString 중 employeeName이 없으면 관리자의 전체조회를 의미
  var array = {};

  if(employeeName==null){    }
  else {
    employeearray["name"] = employeeName;
  }

  Employee.find(array).sort('id').skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

// 사원 정보 등록
router.post("/mis/1.0/employees",function(req,res,next){
  //angular js 에서 데이터 보낼 때 서버에서 받는 방식 검색해서 맵핑하기
  var newEmployee = new Employee({
                                  name : req.body.EmployeeName,
                                  birth : req.body.EmployeeBirth,
                                  position : req.body.EmployeePosition,
                                  department : req.body.EmployeeDepartment,
                                  join_yyyymm : new Date(),
                                  gender : req.body.EmployeeGender,
                                  email : req.body.EmployeeEmail,
                                  phone : req.body.EmployeePhone,
                                  address : req.body.EmployeeAddress,
                                  zipcode : req.body.EmployeeZipcode,
                                  insert_date : new Date(),
                                  update_date : new Date(),
                                  employee_yn : 'N',
                                  employee_state : '00000',
                                  salary : req.body.EmployeeSalary,
                                  vacation_count : req.body.EmployeeVacation_count,
                                  authority : '11111',
                                  last_login_date : new Date(),
                                  id : req.body.EmployeeId,
                                  password : req.body.EmployeePassword,
                                  type : req.body.EmployeeType
                                });

  newEmployee.save(function(error,employee){
    if(error){
      return next(error);
    }
    Employee.findOne({
      id:employee.id
    }).exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
    });
  });

});

//비밀번호 초기화
router.get("/mis/1.0/employees/:employeeId/pwdReset",function(req,res,next){
  const doc = {
    password : 'mis1234' ,
    update_date : new Date()
  };

  Employee.update({id : req.params.employeeId}, doc , function(error,raw){
    if (error) {
      next(error);
    }
    res.json(raw);
  });
});

//비밀번호 변경
router.put("/mis/1.0/employees/:employeeId/pwdChange",function(req,res,next){
  const doc = {
    password : req.body.EmployeePassword ,
    update_date : new Date()
  };

  Employee.update({id : req.body.EmployeeId}, doc , function(error,raw){
    if (error) {
      next(error);
    }
    res.json(raw);
  });
});

//단일 사원 정보 조회
router.get("/mis/1.0/employees/:employeeId",function(req,res,next){
  Employee.findOne({
    id:req.params.employeeId
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

//사원 정보 수정
router.put("/mis/1.0/employees/:employeeId",function(req,res,next){

  /*
  const array = {};
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
  */
  //사원정보 수정 시 넘어오는 값을 EmployyId로 할 것 2017-08-30
  /*
  Employee.update({id : req.body.EmployeeId}, array , function(error,raw){
    if (error) {
      next(error);
    }
    res.json(raw);
  });
  */
  Employee.findOne({
    id:req.params.employeeId
  }).exec(function(error,searchEmployee){
    searchEmployee.name = req.body.EmployeeName || searchEmployee.name;
    searchEmployee.gender = req.body.EmployeeGender || searchEmployee.gender;
    searchEmployee.birth = req.body.EmployeeBirth || searchEmployee.birth;
    searchEmployee.phone = req.body.EmployeePhone || searchEmployee.phone;
    searchEmployee.email = req.body.EmployeeEmail || searchEmployee.email;
    searchEmployee.department = req.body.EmployeeDepartment || searchEmployee.department;
    searchEmployee.position = req.body.EmployeePosition || searchEmployee.position;
    searchEmployee.address = req.body.EmployeeAddress || searchEmployee.address;
    searchEmployee.zipcode = req.body.EmployeeZipcode || searchEmployee.zipcode;
    searchEmployee.salary = req.body.EmployeeSalary || searchEmployee.salary;

    searchEmployee.save(function(error,employee){
      if(error){
        return next(error);
      }
      var updateYnVal = true;   //이메일 중복 체크 여부
      if(employee == null) {  updateYnVal = false;   }
      //회원정보수정 성공여부 리턴
      res.json({updateYn:updateYnVal});
    });
  });
});

//사원정보삭제
router.delete("/mis/1.0/employees/:employeeId",function(req,res,next){
    Employee.remove({id:req.params.employeeId},function(error){
      if(error) return next(error);
      res.json('delete success');
    });
});

//메일 중복 확인
router.get("/mis/1.0/employees/emailCheck/:emailAddress",function(req,res,next){
  Employee.findOne({
    email:req.params.emailAddress
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    var checkYnVal = true;   //이메일 중복 체크 여부
    if(results == null) {  checkYnVal = false;   }
    //이메일 중복체크 하여 중복확인 결과 리턴
    res.json({checkYn:checkYnVal});
  });
});

module.exports = router;
