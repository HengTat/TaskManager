const mongoose= require('mongoose');


//adjust time to local time zone
const date = new Date();
const today = new Date(
  date.getFullYear(),
  date.getMonth(),
  date.getDate(),
  date.getHours() + 8
);

const taskmodel = mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  type:{
    type:String
  },
  date: {
    type: Date,
    default:
    today,
    required:true
  },
  duedate: {
    type: Date,
  },
  completeddate: {
    type: Date,
  },
  status: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    require: false,
  },
});

module.exports=mongoose.model("Task",taskmodel)