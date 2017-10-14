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
  //그리고 결재 시작일자와 결재 끝나는 일자에 대해서 그기간에 딱 맞는 결재만 출력 하는지
  //아니면 겹치는 조건이 어떻게 되는지 확인하기

  //결재상태 코드값 정의하기 Ex) 1이면 결재상신 , 2이면 결재완료 등등

  if(approvalState==1){ //결재승인 이전은 결재테이블에서 조회
    Approval.find({
      request_date:{"$gte":approvalStartDate, "$lt":approvalEndDate},
      request_employee_code:employeeId,
      state:approvalState
    }).exec(function(req,res,next){
      if(error){
        return next(error);
      }
      res.json(results);
    });
  } else{  // 결재승인 이후는 휴가테이블에서 조회
    Vacation.find({
      //일단 소스는 휴가요청날짜로 처리 (추후 변경예정)
      request_date:{"$gte":approvalStartDate, "$lt":approvalEndDate},
      employee_code:employeeId
    }).exec(function(req,res,next){
      if(error){
        return next(error);
      }
      res.json(results);
    });
  }
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
    request_date:new Date('YYYY-MM-DD');
    reference_employee_code:req.body.ApprovalReferenceEmployeeCode,
    approval_employee_code:req.body.ApprovalEmployeeCode,
    request_description:req.body.ApprovalRequestDescription,
    approval_date:req.body.ApprovalDate,
    insert_date:new Date('YYYY-MM-DD'),
    //나중에 휴가에 들어갈 데이터들을 문자열 변수로 지정
    approval_datas:[
                    newCode,  // 코드
                    req.body.ApprovalType,  //타입
                    req.body.ApprovalStartDate, //시작기간
                    req.body.ApprovalEndDate, //끝기간
                    req.body.ApprovalRequestDescription,
                    req.body.ApprovalEmployeePhone,
                    new Date('YYYY-MM-DD'), //request_Date
                    'Y', //approval_yn
                    req.body.ApprovalEmployeeCode, //employee_code
                    new Date('YYYY-MM-DD'), // approval_date
                    '', //return_description
                    new Date('YYYY-MM-DD'), //insert_date
                    new Date('YYYY-MM-DD') // update_date 수정할때 데이터 수정
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
