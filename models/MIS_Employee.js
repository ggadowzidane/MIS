var mongoose = require('mongoose');
var db = require('../models/db');
var autoIncrement = require('mongoose-auto-increment'); // sequence 를 사용하기 위한 플러그인
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  birth:{
    type:Date,
    required:true
  }
  position:{
    type:String,
    required:true
  },
  department:{
    type: Schema.Types.ObjectId,
    ref: 'Department'
  }
  join_yyyymm:{
    type:Date,
    required:true
  }
  picture_filepath:{
    type:String,
    default: 'resources/images/user.png'
  }
  gender:{
    type:String,
    required:true
  }
  email:{
    type:String,
    required:true
  }
  phone:{
    type:String,
    required:true
  }
  address:{
    type:String,
    required:true
  }
  zipcode:{
    type:Number
    required:true
  }
  insert_date:{
    type:Date,
    default:new Date()
  }
  update_date:{
    type:Date,
    default:new Date()
  }
  employee_yn:{
    type:String,
    Default:'Y'
  }
  employee_state:{
    type:String
  }
  salary:{
    type:Number,
    Default:0
  }
  vacation_count:{
    type:Number,
    Default:0
  }
  authority:{
    type:String
  }
  last_login_date:{
    type:Date,
    default:new Date()
  }
  retire_date:{
    type:Date,
    default:new Date()
  }
});

EmployeeSchema.plugin(autoIncrement.plugin,//auto increment 사용
    //field를 code로 정의 시작값 , 증분값 설정)
    {"model":"Employee" , "code":"num" , "startAt":1 , "incrementBy":1});

var Employee = mongoose.model('Employee',EmployeeSchema);
module.exports = Employee;
