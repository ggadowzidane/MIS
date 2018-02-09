var express = require('express');
var mongoose = require('mongoose');
var Vacation = mongoose.model('Vacation');
var Approval = mongoose.model('Approval');

var router = express.Router();

//휴가결재 목록조회
router.get('/mis/1.0/vacations/approvals',function(req,res,next){

  var approvalStartDate = req.query.approvalStartDate;
  var approvalEndDate = req.query.approvalEndDate;
  var employeeId = req.query.employeeId;  // employeeId로 변경해야 할듯하다. Name은 동명이인일 경우 문제가 발생 가능 (restfulAPI도 수정, 테이블 명세서도 변경예정)
  var approvalState = req.query.approvalState;

  //이것도 페이징 처리 하는것인지 확인하여 queryString restfulAPI에도 추가하는지 확인
  var pageCount = parseInt(req.query.pageCount);  // 한페이지에 출력 갯수
  var pagingNumber = parseInt(req.query.pagingNumber);  // 페이지 번호

  if(pageCount==undefined) { pageCount = 10; } //값이 넘어오지 않을 경우 기본값 셋팅
  if(pagingNumber==undefined) { pagingNumber = 1; }//값이 넘어오지 않을 경우 기본값 셋팅
  //console.dir("employeeId :: " + employeeId + "/approvalState::"+approvalState);
  //approvalState : 전체보기(0),기안(1),승인(2),반려(3)
  //휴가결재 목록조회에서는 결재에 대한 정보만 나타낸다. (TABLE : APPROVAL)
  //완료된 휴가 리스트들은 휴가 목록조회에서 보여준다. (TABLE : VACATION)

  var approvalQuery = Approval.find({
    $or:[
          {"request_employee_id":req.query.employeeId},
          {"reference_employee_id":req.query.employeeId},
          {"approval_employee_id":req.query.employeeId}
        ]  // 결재요청직원 , 결재참조직원 , 결재승인직원아이디 전부 포함된 조건
  });

  approvalQuery.where('type').equals(1);

  if(approvalState != ""){
    console.dir('state check in vacation search');
    approvalQuery.where('state').equals(approvalState);
  }

  if(approvalStartDate!="" && approvalEndDate!=""){
    console.dir('date check in vacation search');
    approvalQuery.where('request_date').gt(new Date(approvalStartDate)).lt(new Date(approvalEndDate));
  }

  approvalQuery.sort('code').skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
    if(error){
      return next(error);
    }
    //res.json(results);
    res.json(results.map(Approval => Approval.toJSON()));
  });

});

//휴가결재 상세조회
router.get("/mis/1.0/vacations/approvals/:approvalCode",function(req,res,next){
  Approval.findOne({
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
      newCode = (results[0].code)+1;
    }
    var newApproval = new Approval({
      code:newCode,
      type:"1", //휴가는 1
      state:"1",
      request_employee_id:req.body.ApprovalRequestEmployeeId,
      request_date:new Date(),
      reference_employee_id:req.body.ApprovalReferenceEmployeeId,
      approval_employee_id:req.body.ApprovalEmployeeId,
      request_description:req.body.ApprovalRequestDescription,
      approval_date:new Date(req.body.ApprovalDate),
      insert_date:new Date(),
      //나중에 휴가에 들어갈 데이터들을 문자열 변수로 지정
      approval_data:{
                      //newCode,  // 결재코드는 결재완료 처리 후 각 테이블의 코드값을 따서 사용
                      ApprovalVacationType:req.body.ApprovalVacationType,  //타입
                      ApprovalStartDate:req.body.ApprovalStartDate, //시작기간
                      ApprovalEndDate:req.body.ApprovalEndDate, //끝기간
                      ApprovalRequestDescription:req.body.ApprovalRequestDescription,
                      ApprovalEmployeePhone:req.body.ApprovalEmployeePhone,
                      RequestDate:new Date(), //request_Datejjadf
                      ApprovalYn:'N', //approval_yn
                      ApprovalEmployeeId:req.body.ApprovalEmployeeId, //employee_id
                      ApprovalDate:new Date(), // approval_date
                      InsertDate:new Date() //insert_date
                    }
    });

    newApproval.save(function(error,approval){
        if(error){
          return next(error);
        }
        Approval.findOne({
          code:approval.code
        }).exec(function(error,results){
          if(error){
            return next(error);
          }
          res.json(results);
        })
    });
  });
  //테이블 명세서의  code를 id로 바꿔야할듯

});

//수정항목 : 휴가 시작 , 휴가 종료 , 연락처 , 참조자 목록 , 휴가 사유 , 승인자 목록
//휴가결재 정보수정
router.put("/mis/1.0/approvals/:approvalCode",function(req,res,next){
  Approval.findOne({
    code:req.params.approvalCode
  }).exec(function(error,searchApproval){
    //console.dir("111:"+searchApproval.approval_data["ApprovalEmployeePhone"]+"@@"+req.body.employee_phone);
    if(req.body.start_date!="" || req.body.end_date!="" || req.body.employee_phone!=""){
      searchApproval.approval_data["ApprovalStartDate"] = req.body.start_date || searchApproval.approval_data["ApprovalStartDate"];   //휴가 시작일자
      searchApproval.approval_data["ApprovalEndDate"] = req.body.end_date || searchApproval.approval_data["ApprovalEndDate"];   //휴가 종료일자
      searchApproval.approval_data["ApprovalEmployeePhone"] = req.body.employee_phone || searchApproval.approval_data["ApprovalEmployeePhone"];   //연락처
      searchApproval.markModified('approval_data');
    }
    searchApproval.reference_employee_id = req.body.reference_employee_id || searchApproval.reference_employee_id;   //참조자목록
    searchApproval.request_description = req.body.request_description || searchApproval.request_description;   //요청 사유
    searchApproval.approval_employee_id = req.body.approval_employee_id || searchApproval.approval_employee_id;   //승인자목록

    searchApproval.save(function(error,approval){
      if(error){
        return next(error);
      }
      var updateYnVal = true; //휴가결재 수정 체크 여부
      if(approval==null){updateYnVal=false;}
      //휴가결재수정 성공여부 리턴
      res.json({updateYn:updateYnVal});
    });
  })
});

//휴가결재 심사
router.put("/mis/1.0/vacations/approvals/:approvalCode/evaluate",function(req,res,next){
  var newCode=0;
  var state = req.body.approval_state;
  Approval.findOne({
    code:req.params.approvalCode
  }).exec(function(error,searchApproval){
    if(state==2){
      searchApproval.approval_data["ApprovalYn"]="Y";
    }else{
      searchApproval.approval_data["ApprovalYn"]="N";
    }

    searchApproval.state = state;
    searchApproval.approval_description = req.body.approval_description;
    searchApproval.save(function(error,approval){ //결재 테이블 update
      if(error){
        return next(error);
      }
      //결재 테이블 update 후 휴가 결재 테이블에 insert
      Vacation.find().sort({'code':-1}).limit(1).exec(function(error,results){ //신규 결재 코드 준비값
        if(results==null){
          newCode = 0;
        }else{
          newCode = (results[0].code)+1;
        }

        var newVacation = new Vacation({
            code  : newCode,
            type  : searchApproval.approval_data["ApprovalVacationType"] , // 타입
            start_date :  searchApproval.approval_data["ApprovalStartDate"] ,  // 휴가 시작 일
            end_date :  searchApproval.approval_data["ApprovalEndDate"] ,  // 휴가 종료 일
            request_description : searchApproval.approval_data["ApprovalRequestDescription"] ,  // 휴가 사유
            employee_phone : searchApproval.approval_data["ApprovalEmployeePhone"] ,  // 휴가자 연락처
            request_date : searchApproval.approval_data["RequestDate"] ,  // 휴가 요청 날짜
            approval_yn : searchApproval.approval_data["ApprovalYn"] ,  // 휴가 승인 여부
            employee_code : searchApproval.approval_data["ApprovalEmployeeId"] ,  // 휴가 직원 아이디
            approval_date : searchApproval.approval_data["ApprovalDate"],  // 휴가 승인 날짜
            return_description : req.body.approval_description , // 반려 사유 ( 승인 일 경우에는 승인 사유가 없는데 그냥 심사 사유로 변경하는게 어떨지 확인하기)
            insert_date : searchApproval.approval_data["InsertDate"] ,  // 휴가 요청 날짜
            update_date : new Date()  // 결재심사 일자
        });

        //결재 update , 휴가는 insert 어느것을 리턴할지는 협의해서 정하도록
        //임시로 결재 찾아서 리턴
        newVacation.save(function(error,vacation){
          if(error){
            return next(error);
          }
          console.dir("searchVacation Code::"+vacation.code);
          Vacation.findOne({
            code:vacation.code
          }).exec(function(error,results){
            if(error)
              return next(error);
            res.json(results);
          });
        });
      });

    });

  });
});

//휴가결재 삭제
router.delete("/mis/1.0/vacations/approvals/:approvalCode",function(req,res,next){
  Approval.remove({code:req.params.approvalCode},function(error){
    if(error) return next(error);
    res.json('delete success');
  });
});

module.exports = router;
