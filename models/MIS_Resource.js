var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//자원은 해당 결재 넣는 insert_employee_code별 code가 unique하다.
var ResourceSchema = new Schema({
  code:{
    type:Number,
    required:true,
    unique:true
  },
  name:{
    type:String,
    required:true
  },
  employee_id:{
    type:String,
    required:true
  },
  count:{
    type:Number,
    Default:0
  },
  insert_date:{
    type:Date,
    default:new Date()
  },
  update_date:{
    type:Date,
    default:new Date()
  },
  type:{
    type:String
  },
  insert_employee_code:{
    type:Schema.Types.ObjectId,
    ref:'Employee'
  },
  delete_yn:{
    type:String,
    deault:'N'
  }
});

module.exports = mongoose.model('Resource',ResourceSchema);
