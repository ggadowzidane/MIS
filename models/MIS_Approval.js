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
  request_employee_code:{
    type:String,
    required:true
  },
  request_date:{
    type:Date,
    required:true,
    default:new Date()
    //default add
  },
  reference_employee_code:{
    type:String,
    required:true
  },
  approval_employee_code:{
    type:String,
    required:true
  },
  request_description:{
    type:String,
    required:true
  }
  approval_description:{
    type:String,
    required:true
  }
  hold_description:{
    type:String,
    required:true
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
  }
});

module.exports = mongoose.model('Approval',ApprovalSchema);
