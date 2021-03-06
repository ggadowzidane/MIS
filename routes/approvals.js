var express = require('express');
var mongoose = require('mongoose');
var Approval = mongoose.model('Approval');
var Employee = mongoose.model('Employee');
var router = express.Router();

//결재 참조자 목록 조회 (자기자신을 제외한 목록 보여주도록 처리)
router.get('/mis/1.0/approvals/refEmployees',function(req,res,next){
  //해당 결재자의 부서의 인원을 조회할 것인지 전체 인원의 목록을 조회할 것인지 확인
  Employee.find().sort('id').exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

//결재자 목록 조회 (자기자신을 제외한 목록 보이도록 처리 , 결재자의 부서인 사람들만 보이도록 처리)
router.get('/mis/1.0/approvals/aprEmployees',function(req,res,next){
  //해당 결재올리는 인원의 부서의 인원들을 조회할 것인지 전체 인원의 목록 을 조회할 것인지 확인
  Employee.find().sort('id').exec(function(error,results){
    if(error){
      return next(error);
    }

    res.json(results);
  });
});

module.exports = router;
