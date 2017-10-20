var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//휴가는 해당 employee_code 별 code가 unique하다.
var VacationSchema = new Schema({
  code:{
    type:Number,
    required:true,
    unique:true
  },
  type:{
    type:String,
    required:true
  },
  start_date:{
    type:Date,
    required:true,
    default:new Date()
  },
  end_date:{
    type:Date,
    required:true,
    default:new Date()
  },
  request_description:{
    type:String,
    required:true
  },
  employee_phone:{
    type:Number,
    required:true
  },
  request_date:{
    type:Date,
    required:true,
    default:new Date()
  },
  approval_yn:{
    type:String,
    required:true
  },
  employee_code:{
    type:Schema.Types.ObjectId,
    ref:'Employee'
  },
  approval_date:{
    type:Date,
    required:true,
    default:new Date()
  },
  return_description:{
    type:String,
    required:true
  },
  insert_date:{
    type:Date,
    default:new Date()
  },
  update_date:{
    type:Date,
    default:new Date()
  }
});

module.exports = mongoose.model('Vacation',VacationSchema);
