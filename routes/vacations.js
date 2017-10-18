var express = require('express');
var mongoose = require('mongoose');
var Vacation = require('Vacation');
var Approval = require('Approval');

var router = express.Router();

//휴가결재 목록조회
router.get('/mis/1.0/vacations/approvals',function(req,res,next){
  var approvalStartDate = req.query.approvalStartDate;
  var approvalEndDate = req.query.approvalEndDate;
  var employeeName = req.query.employeeName;  // employeeId로 변경해야 할듯하다. Name은 동명이인일 경우 문제가 발생 가능
  var employeeId = req.query.employeeId;  // employeeId로 변경해야 할듯하다. Name은 동명이인일 경우 문제가 발생 가능 (restfulAPI도 수정, 테이블 명세서도 변경예정)
  var approvalState = req.query.approvalState;

  //이것도 페이징 처리 하는것인지 확인하여 queryString restfulAPI에도 추가하는지 확인

  //휴가결재 목록 조회 시 결재요청직원 아이디 or 결재참조직원아이디 or 결재승인직원아이디 인 목록을 다 가져와야 한다.
  //approvalState : 전체보기(0),기안(1),승인(2),반려(3)
  //휴가결재 목록조회에서는 결재에 대한 정보만 나타낸다. (TABLE : APPROVAL)
  //완료된 휴가 리스트들은 휴가 목록조회에서 보여준다. (TABLE : VACATION)
  Approval.find({
    //or 조건 추가예정 line18
    request_date:{"$gte":approvalStartDate, "$lt":approvalEndDate},
    request_employee_code:employeeId,
    state:approvalState
  }).exec(function(req,res,next){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

//휴가결재 상세조회
router.get('/mis/1.0/vacations/approvals/:approvalCode',function(req,res,next){
  Vacation.findOne({
    code:req.params.approvalCode
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

//휴가결재 등록
router.post("/mis/1.0/vacations/approvals",function(req,res,next){
  var newCode = 0;

  //신규 결재 코드 준비값
  Approval.find().sort({'code':-1}).limit(1).exec(function(error,results){
    if(results==null){
      newCode = 0;
    }else{
      newCode = results[0].code;
    }
  });

  //테이블 명세서의  code를 id로 바꿔야할듯
  var newApproval = new Approval({
    code:newCode,
    type:req.body.ApprovalType,
    state:"1",
    request_employee_code:req.body.ApprovalRequestEmployeeCode,
    request_date:new Date();
    reference_employee_code:req.body.ApprovalReferenceEmployeeCode,
    approval_employee_code:req.body.ApprovalEmployeeCode,
    request_description:req.body.ApprovalRequestDescription,
    approval_date:req.body.ApprovalDate,
    insert_date:new Date(),
    //나중에 휴가에 들어갈 데이터들을 문자열 변수로 지정
    approval_datas:[
                    newCode,  // 코드 (결재코드랑 휴가코드는 달라야한다. 휴가코드는 사원의 휴가코드가 unique 해야할듯 수정필요)
                    req.body.ApprovalVacationType,  //타입
                    req.body.ApprovalStartDate, //시작기간
                    req.body.ApprovalEndDate, //끝기간
                    req.body.ApprovalRequestDescription,
                    req.body.ApprovalEmployeePhone,
                    new Date(), //request_Date
                    'Y', //approval_yn
                    req.body.ApprovalEmployeeCode, //employee_code
                    new Date(), // approval_date
                    '', //return_description
                    new Date(), //insert_date
                    new Date() // update_date 수정할때 데이터 수정
                  ]
  });

  newApproval.save(function(error,Approval){
      if(error){
        return next(error);
      }
      Approval.findOne({
        code:Approval.code
      }).exec(function(error,results){
        if(error){
          return next(error);
        }
        res.json(results);
      })
  });
});

//수정항목 : 휴가 시작 , 휴가 종료 , 연락처 , 참조자 목록 , 휴가 사유 , 승인자 목록
