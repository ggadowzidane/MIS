var express = require('express');
var mongoose = require('mongoose');
var Employee = mongoose.model('Employee');

var router = express.Router();

router.post("/mis/1.0/login" , function(req,res,next){
  console.info("login id::"+req.body.loginId +"////password"+req.body.loginPassword);
  //if(req.Method=="POST"){ //login check
    Employee.findOne({
      id:req.body.loginId,
      password:req.body.loginPassword
    }).exec(function(error,results){
      if(error){
        return next(error);
      }

      if(results == null){  //로그인 실패 시 로그인 화면 복귀
        //redirect 할 때 데이터를 포함하려면 req.session에 할당하여 제공
        res.redirect("/");
      }else{  //로그인 시 정보 처리
        res.json(results);
      }

    });
  //}
});

module.exports = router;
