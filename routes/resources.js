//자재등록날짜는 결재가 승인 처리 되었을 때 값을 넣는다.
var express = require('express');
var mongoose = require('mongoose');
var async = require('async');
var Resource = mongoose.model('Resource');
var Approval = mongoose.model('Approval');

var router = express.Router();

//자제결재 목록조회
router.get('/mis/1.0/resources/approvals',function(req,res,next){
  var employeeId = req.query.employeeId;
  var approvalState = req.query.approvalState;

  var pageCount = parseInt(req.query.pageCount);  // 한페이지에 출력 갯수
  var pagingNumber = parseInt(req.query.pagingNumber);  // 페이지 번호
  var totalCnt = ""; //
  if(pageCount==undefined) { pageCount = 10; } //값이 넘어오지 않을 경우 기본값 셋팅
  if(pagingNumber==undefined) { pagingNumber = 1; }//값이 넘어오지 않을 경우 기본값 셋팅

  //동기 처리를 위하여 async 사용
  async.series([
    function(callback){
      //총 갯수를 구하는 조건은 협의가 필요할듯. 20180413
      Approval.count({
        $or:[
              {"request_employee_id":employeeId},
              {"reference_employee_id":employeeId},
              {"approval_employee_id":employeeId}
            ]  // 결재요청직원 , 결재참조직원 , 결재승인직원아이디 전부 포함된 조건
      },function(err, TotalCount){
        callback(null, TotalCount);
      });
    },
    function(callback){
      var approvalQuery = Approval.find({
        $or:[
              {"request_employee_id":employeeId},
              {"reference_employee_id":employeeId},
              {"approval_employee_id":employeeId}
            ]  // 결재요청직원 , 결재참조직원 , 결재승인직원아이디 전부 포함된 조건
      });

      //결재 타입 2는 자재
      approvalQuery.where('type').equals(2);

      if(approvalState != ""){
        console.dir('state check in vacation search');
        approvalQuery.where('state').equals(approvalState);
      }

      approvalQuery.sort({'code': 1}).skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
        if(error){
          return next(error);
        }
        callback(null , results.map(Approval => Approval.toJSON()));
        //callback(null,results);
      });
    }
  ] , function(err,results){
    res.json({
      totalCount : results[0],
      approval : results[1]
    })
  });
});

//자제결재 상세조회
router.get("/mis/1.0/resources/approvals/:approvalCode",function(req,res,next){
  Approval.findOne({
    code:req.params.approvalCode
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  })
});

//자제결재 등록
router.post("/mis/1.0/resources/approvals",function(req,res,next){
  var newCode = 0 ;

  async.waterfall([
    function(callback){
      Approval.find().sort({'code':-1}).limit(1).exec(function(error,results){
        if(results==""){
          newCode = 0;
        }
        else{
          newCode = (results[0].code)+1;
        }
        callback(null , newCode);
      });
    },
    function(newCode , callback){
      var newApproval = new Approval({
        code:newCode,
        type:"2",     //자재는 2
        state:"1",
        request_employee_id:req.body.approvalRequestEmployeeId,
        request_date:new Date(),
        reference_employee_id:req.body.approvalReferenceEmployeeId,
        approval_employee_id:req.body.approvalEmployeeId,
        request_description:req.body.approvalRequestDescription,
        insert_date:new Date(),
        approval_data:{
          approvalResourceName:req.body.approvalResourceName,     // 자재명
          approvalResourceCount:req.body.approvalResourceCount,   // 자재 갯수
          approvalResourceType:req.body.approvalResourceType,     // 자재 타입
          approvalManagerId:req.body.approvalManagerId,         // 자재 담당자 아이디
          approvalYn:'N',                                         // 결재 여부
          approvalInsertEmployeeId:req.body.approvalInsertEmployeeId, // 자재 등록 아이디
          iunsertDate:new Date()                                   // insert_date
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
          callback(null,results);
        });
      });
    }
  ] , function(err,results){
    //동기 식으로 코드 채번하고 등록 후 등록된 것 조회 하여 리턴
    res.json({
      approval : results[0]
    });
  });
});

//삭제 시 해당 코드가 결재완료가 되었다면 삭제가 불가능하도록 해야 할듯
//화면과 서버에서 처리해야 할듯 하다.
//자제결재 삭제
router.delete("/mis/1.0/resources/approvals/:approvalCode",function(req,res,next){
  var approvalCode = req.params.approvalCode;
  var approvalState = "";
  var message = "";
  //삭제 시 결재상태가 기안을 제외하고는 삭제가 불가능하도록 처리
  async.waterfall([
    function(callback){
      Approval.findOne({code:approvalCode}).exec(function(error,results){
        console.dir('aaaa');
        if(results==""){
          approvalState = null;
        }else{
          console.log("state in approval resource delete method :: " +  results["state"]);
          approvalState = results["state"];
        }
        console.dir('bbbb');
        callback(null,approvalState);
      });
    },
    function(state , callback){
      console.dir('state::'+state);
      if(state == null){
        message = "no approval";
      }
      else{
        if(state == 1){
          Approval.remove({code:req.params.approvalCode},function(error){
            if(error) return next(error);
            message = 'delete success';
            callback(null,message);
          });
        }else{
          message = 'delete is failed (approval is end)';
          callback(null,message);
        }
      }
    }
  ],function(err , results){
    res.json(results);
  });
});

//자제결재 수정
router.put("/mis/1.0/resources/approvals/:approvalCode",function(req,res,next){
  Approval.findOne({
    code:req.params.approvalCode
  }).exec(function(error,searchApproval){
    if(searchApproval.state==1){  // 결재 상태가 기안인 경우 update 진행
      searchApproval.approval_data["approvalResourceCount"] = req.body.approvalResourceCount || searchApproval.approval_data["approvalResourceCount"];  //자재명
      searchApproval.approval_data["approvalResourceName"] = req.body.approvalResourceName || searchApproval.approval_data["approvalResourceName"];     //휴가 시작일자
      searchApproval.approval_data["approvalResourceType"] = req.body.approvalResourceType || searchApproval.approval_data["approvalResourceType"];     //자재 타입
      searchApproval.approval_data["approvalManagerId"] = req.body.approvalManagerId || searchApproval.approval_data["approvalManagerId"];         //자재 등록 아이디
      searchApproval.markModified('approval_data');     //Schema가 mixed 타입일 경우 해당 함수 호출해야 mixed 타입 수정이 된다.

      searchApproval.reference_employee_id = req.body.approvalReferenceEmployeeId || searchApproval.reference_employee_id;   //참조자목록
      searchApproval.request_description = req.body.approvalRequestDescription || searchApproval.request_description;   //요청 사유
      searchApproval.approval_employee_id = req.body.approvalEmployeeId || searchApproval.approval_employee_id;   //승인자목록

      searchApproval.save(function(error,approval){
        if(error){
          return next(error);
        }
        var updateYnVal = true; //휴가결재 수정 체크 여부
        if(approval==null){updateYnVal=false;}
        //휴가결재수정 성공여부 리턴
        res.json({updateYn:updateYnVal});
      });
    }else{  //결재 상태가 기안이 아닌 경우 updateYn false 리턴
      res.json({updateYn:false});
    }
  });
});

//자재결재 심사
router.put("/mis/1.0/resources/approvals/:approvalCode/evaluate",function(req,res,next){
  var newCode=0;
  var state = req.body.approvalState;
  Approval.findOne({
    code:req.params.approvalCode
  }).exec(function(error,searchApproval){
    if(state==2 || state==3){
      searchApproval.approval_data["approvalYn"]="Y";
    }else{
      searchApproval.approval_data["approvalYn"]="N";
    }

    searchApproval.state = state;
    searchApproval.approval_description = req.body.approvalDescription;
    searchApproval.save(function(error,approval){ //결재 테이블 update
      if(error){
        return next(error);
      }
      // 승인일 경우 휴가 테이블에 등록 반려 및 기안일 경우 null값 반환
      if(state == 2){
        //결재 테이블 update 후 휴가 결재 테이블에 insert
        Resource.find().sort({'code': 1}).limit(1).exec(function(error,results){ //신규 결재 코드 준비값

          if(results==""){
            newCode = 0;
          }else{
            newCode = (results[0].code)+1;
          }
          console.dir('new Code ::'+newCode);
          var newResource = new Resource({
              code  : newCode,
              name  :  searchApproval.approval_data["approvalResourceName"] ,                   // 자재명
              employee_id : searchApproval.approval_data["approvalManagerId"] ,                 // 자재 담당자 아이디
              count :  searchApproval.approval_data["approvalResourceCount"] ,                  // 자재 갯수
              type  :  searchApproval.approval_data["approvalResourceType"] ,                   // 자재 타입
              insert_employee_id : searchApproval.approval_data["approvalInsertEmployeeId"] ,   // 자재 등록 아이디
              insert_date : searchApproval.approval_data["insertDate"] ,  // 휴가 요청 날짜
              update_date : new Date(),  // 결재심사 일자
              delete_yn   : 'N'         // 자재 삭제 유무
          });

          //결재 update , 휴가는 insert 어느것을 리턴할지는 협의해서 정하도록
          //임시로 결재 찾아서 리턴
          newResource.save(function(error,resource){
            if(error){
              return next(error);
            }
            console.dir("searchResource Code::"+resource.code);
            Resource.findOne({
              code:resource.code
            }).exec(function(error,results){
              if(error)
                return next(error);
              res.json(results);
            });
          });
        });
      } else {
        res.json(null);
      }
    });
  });
});
//개인별 자제결재 목록조회 (자재결재 목록조회가 개인 아이디 별로 조회하는 것이라 중복됨)
//승인이 목록에서 누락됐다.
//부서별 자제결재 목록조회 (UI 화면에서 부서별 검색 조건이 없어서 필요한지 논의 대상)

//자재 전체 조회
router.get("/mis/1.0/resources",function(req,res,next){
  var pageCount = parseInt(req.query.pageCount);  // 한페이지에 출력 갯수
  var pagingNumber = parseInt(req.query.pagingNumber);  // 페이지 번호
  var totalCnt = ""; //
  if(pageCount==undefined) { pageCount = 10; } //값이 넘어오지 않을 경우 기본값 셋팅
  if(pagingNumber==undefined) { pagingNumber = 1; }//값이 넘어오지 않을 경우 기본값 셋팅

  async.series([
    function(callback){
      Resource.count({},function(err,totalCount){
        callback(null,totalCount);
       });
    },
    function(callback){
      Resource.find().sort({'code':1}).skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
        if(error){
          return next(error);
        }
        callback(null , results);
      });
    }
  ] , function(err,results){
      res.json({
        totalCount : results[0],
        resource : results[1]
      });
    }
  );
});

//자재 상세 조회
router.get("/mis/1.0/resources/:resourceCode",function(req,res,next){
  Resource.findOne({
    code:req.params.resourceCode
  }).exec(function(err,results){
    if(err){
      return next(error);
    }
    res.json(results);
  });
});

//자재 담당자 목록 조회 -> 담당자별 자재 목록을 조회 하는 것인지 무엇인지 체크하기
router.get("/mis/1.0//resources/mngEmployees/:employeeId",function(req,res,next){
  //이것도 페이징 처리 하는것인지 확인하여 queryString restfulAPI에도 추가하는지 확인
  var pageCount = parseInt(req.query.pageCount);  // 한페이지에 출력 갯수
  var pagingNumber = parseInt(req.query.pagingNumber);  // 페이지 번호
  var totalCnt = ""; //
  if(pageCount==undefined) { pageCount = 10; } //값이 넘어오지 않을 경우 기본값 셋팅
  if(pagingNumber==undefined) { pagingNumber = 1; }//값이 넘어오지 않을 경우 기본값 셋팅

  async.series([
    function(callback){
      Resource.count({
        employee_id : req.params.employeeId
      },function(err,totalCount){
        callback(null,totalCount);
      });
    },
    function(callback){
      Resource.find({
        employee_id : req.params.employeeId
      }).sort({'code':1}).exec(function(err,results){
        if(error){
          return next(error);
        }
        callback(null,results);
      });
    }
  ],function(err,results){
    res.json({
      totalCount : results[0],
      resource : results[1]
    });
  });
});

module.exports = router;
