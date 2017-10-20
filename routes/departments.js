var express = require('express');
var mongoose = require('mongoose');
var Department = mongoose.model('Department');

var router = express.Router();

//부서 전체 목록 조회
router.get('/mis/1.0/departments',function(req,res,next){

    var pageCount = parseInt(req.query.PageCount);
    var pagingNumber = parseInt(req.query.PaginNumber);

    if(pageCount==undefined){ pageCount = 10; }
    if(pagingNumber==undefined){ pagingNumber = 1; }

    //페이징 쿼리 추가 필요 (2017-10-14)
    Department.find({delete_yn:'N'}).sort('name').skip((pagingNumber-1)*pageCount).limit(pageCount).exec(function(error,results){
      if(error){
        return next(error);
      }
      res.json(results);
      //총 건수 , 총 페이지 갯수 , 현재페이지 갯수 json에서 포함해서 화면에 전달하기
    });
});

//부서 상세 조회
router.get("/mis/1.0/departments/:departmentCode",function(req,res,next){
  Department.findOne({
    code:req.params.departmentCode,
    delete_yn:'N'
  }).exec(function(error,results){
    if(error){
      return next(error);
    }
    res.json(results);
  });
});

//부서 등록
router.post('/mis/1.0/departments',function(req,res,next){
  var newCode = 0;

  //신규 부서 코드 준비값
  Department.find().sort({'code':-1}).limit(1).exec(function(error,results){
    if(results==null){
      newCode = 0;
    }else{
      newCode = results[0].code;
    }

    var newDepartment = new Department({
                                        code:(newCode+1),
                                        name:req.body.DepartmentName,
                                        representation:req.body.DepartmentRepresentation,
                                        description:req.body.DepartmentDescription,
                                        insert_date:new Date(),
                                        update_date:new Date(),
                                        delete_yn:'N'
                                      });

    newDepartment.save(function(error,department){
      if(error){
        return next(error);
      }
      Department.findOne({
        code:department.code
      }).exec(function(error,results){
        if(error){
          return next(error);
        }
        res.json(results);
      });
    });
  });

});

//부서 정보 수정
router.put("/mis/1.0/departments/:departmentCode",function(req,res,next){
    Department.findOne({
      code:req.params.departmentCode
    }).exec(function(error,searchDepartment){
      searchDepartment.name = req.body.DepartmentName || searchDepartment.name;
      searchDepartment.representation = req.body.DepartmentRepresentation || searchDepartment.representation;
      searchDepartment.description = req.body.DepartmentDescription || searchDepartment.description;
      searchDepartment.update_date = new Date();

      searchDepartment.save(function(error,department){
        if(error){
          return next(error);
        }
        var updateYnVal = true;   //이메일 중복 체크 여부
        if(department == null) {  updateYnVal = false;   }
        //회원정보수정 성공여부 리턴
        res.json({updateYn:updateYnVal});
      });
    });
});

//부서 정보 삭제
router.delete("/mis/1.0/departments/:departmentCode",function(req,res,next){
  Department.findOne({
    code:req.params.departmentCode
  }).exec(function(error,searchDepartment){
    if(error) return next(error);
    searchDepartment.delete_yn = 'Y';
    searchDepartment.update_date = new Date();
    searchDepartment.save(function(error,department){
      if(error) return next(error);
      res.json('delete success');
    });
  });
});

module.exports = router;
