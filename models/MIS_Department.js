var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var DepartmentSchema = new Schema({
  code:{
    type:Number,
    required:true,
    unique:true
  },
  name:{
    type:String,
    required:true
  },
  representation:{
    type:String,
    required:true
  },
  description:{
    type:String
  },
  insert_date:{
    type:Date,
    default:new Date()
  },
  update_date:{
    type:Date,
    default:new Date()
  },
  delete_yn:{
    type:String,
    dafult:'N'
  }
});

module.exports = mongoose.model('Department',DepartmentSchema);
