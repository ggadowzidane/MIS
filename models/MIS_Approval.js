var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ApprovalSchema = new Schema({
  code:{
    type:Number,
    required:true,
    unique:true
  },
  type:{
    type:String,
    required:true
  },
  state:{
    type:String,
    required:true
  },
  request_employee_id:{
    type:String,
    required:true
  },
  request_date:{
    type:Date,
    required:true,
    default:new Date()
    //default add
  },
  reference_employee_id:{
    type:[String],
    required:true
  },
  approval_employee_id:{
    type:String,
    required:true
  },
  request_description:{
    type:String,
    required:true
  },
  approval_description:{
    type:String,
  },
  hold_description:{
    type:String,
  },
  approval_date:{
    type:Date,
    required:true,
    default:new Date()
  },
  insert_date:{
    type:Date,
    default:new Date()
  },
  update_date:{
    type:Date,
    default:new Date()
  },
  hold_date:{
    type:Date,
    default:new Date()
  },
  approval_data:{
    //type:[String] //결재 데이터 문자열 배열로 가지고 있을
    type : mongoose.Schema.Types.Mixed
    //결재데이터를 객체 형태로 가지고 있도록 처리 2018-01-29
  }
});

/*형변환 테스트*/
ApprovalSchema.options.toJSON = {
  transform : function (doc, ret, options) {
    //transform은 응답객체의 한객체 마다 호출한다.
    // remove the _id of every document before returning the result
    ret["hold_date"] = setDateYYYYMMDD(ret["hold_date"]);
    ret["request_date"] = setDateYYYYMMDD(ret["request_date"]);
    ret["approval_date"] = setDateYYYYMMDD(ret["approval_date"]);
    ret["update_date"] = setDateYYYYMMDD(ret["update_date"]);
    ret["insert_date"] = setDateYYYYMMDD(ret["insert_date"]);
    var approval_data = ret["approval_data"];
    if(approval_data != null){
      approval_data["ApprovalDate"] = setDateYYYYMMDD(approval_data["ApprovalDate"]);
      approval_data["RequestDate"] = setDateYYYYMMDD(approval_data["RequestDate"]);
      approval_data["InsertDate"] = setDateYYYYMMDD(approval_data["InsertDate"]);
      ret["approval_data"] = approval_data;
    }
    return ret;
  }
}
//날짜변환 함수
function setDateYYYYMMDD(inputDate){
  var nDate = new Date(inputDate);

  var yyyy = nDate.getFullYear().toString();
  var mm = "";
  if(nDate.getMonth()<10){
    mm = "0"+nDate.getMonth();
  }else{
    mm = nDate.getDate().toString();
  }
  var dd = "";
  if(nDate.getDate()<10){
    dd = "0"+nDate.getDate();
  }else{
    dd = nDate.getDate();
  }
  return yyyy+'-'+mm+'-'+dd;
}

module.exports = mongoose.model('Approval',ApprovalSchema);
