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
ApprovalSchema.set('toJSON', { getters: true, virtuals: false });

ApprovalSchema.options.toJSON = {
  transform : function (doc, ret, options) {
    // remove the _id of every document before returning the result
    // ret.insert_date = setDateYYYYMMDD(ret.insert_date);
    return ret;
  }
}
//날짜변환 함수
function setDateYYYYMMDD(date){
  var yyyy = date.getFullYear().toString();
  var mm = "";
  if(date.getMonth()<10){
    mm = "0"+date.getMonth();
  }else{
    mm = date.getDate().toString();
  }
  var dd = "";
  if(date.getDate()<10){
    dd = "0"+date.getDate();
  }else{
    dd = date.getDate();
  }
  return yyyy+'-'+mm+'-'+dd;
}

module.exports = mongoose.model('Approval',ApprovalSchema);
