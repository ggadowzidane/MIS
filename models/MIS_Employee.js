var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EmployeeSchema = new Schema({
  name:{
    type:String,
    required:true
  },
  birth:{
    type:Date,
    required:true
  },
  position:{
    type:String,
    required:true
  },
  department:{
    type: Schema.Types.ObjectId,
    ref: 'Department'
    /*Department 관련 추가 시 수정 예정 2017-08-31*/
    //type:String
  },
  join_yyyymm:{
    type:Date,
    required:true
  },
  picture_filepath:{
    type:String,
    default: 'resources/images/user.png'
  },
  gender:{
    type:String,
    required:true
  },
  email:{
    type:String,
    required:true,
    unique:true
  },
  phone:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  zipcode:{
    type:Number,
    required:true
  },
  insert_date:{
    type:Date,
    default:new Date()
  },
  update_date:{
    type:Date,
    default:new Date()
  },
  employee_yn:{
    type:String,
    Default:'Y'
  },
  employee_state:{
    type:String
  },
  salary:{
    type:Number,
    Default:0
  },
  vacation_count:{
    type:Number,
    Default:0
  },
  authority:{
    type:String
  },
  last_login_date:{
    type:Date,
    default:new Date()
  },
  retire_date:{
    type:Date,
    default:new Date()
  },
  id:{
    type:String,
    required:true,
    unique:true
  },
  password:{
    type:String,
    required:true
  },
  type:{
    type:Number,
    default:3   // 마스터 1 , 관리자 2 , 일반회원 3
  }
  //id , password 추가 2017-08-30
});

module.exports = mongoose.model('Employee', EmployeeSchema);
