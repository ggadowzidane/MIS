var mongoose = require('mongoose');
var Schema = mongoose.Schema;
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
  employee_phone1:{
    type:Number,
    required:true
  },
  employee_phone2:{
    type:Number,
    required:true
  },
  employee_phone3:{
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
  }
  update_date:{
    type:Date,
    default:new Date()
  }
});

module.exports = mongoose.model('Vacation',VacationSchema);
