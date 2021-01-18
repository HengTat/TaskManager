const { Router } = require('express');
const express=require('express');
const { model } = require('mongoose');
const router=express.Router();
const Task = require('../models/taskmodel');
const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        
//adjust time to local time zone
const date =  new Date();
const today = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours()+8
)

//create new task 
router.get('/allcompletedtask',(req,res)=>{
    const complete=["completed","completedoverdue"]
    Task.find({status:complete}).then(data=>res.json(data));
});

//get all pending task
router.get('/getallpendingtask',async(req,res)=>{
     const startoftoday = new Date(
                today.getFullYear(),
              today.getMonth(),
              today.getDate()
            );
    //update task which are overdue
    //find task which duedate past today
    await Task.updateMany(
              { duedate: { $lte: startoftoday },status:"pending"},
              { $set: { status: "overdue" } }
            );
    //get all pending
    const pending=['overdue','pending']
    Task.find({ status: pending }).then((data) =>
      res.json(data)
    );
});

//create new task 
router.post('/createtask',(req,res)=>{
    const task = new Task({
        task:req.body.task,
        description:req.body.description,
        status:"pending",
        duedate:req.body.duedate,
        type:req.body.type
    })
    task.save().then(data=>res.json(data));
})

//change task to completed or completedoverdue by using id
router.put('/completedtask/:id',async(req,res)=>{
    const currTask = await Task.findById(req.params.id)
    const startoftoday= new Date(today.getFullYear(),today.getMonth(),today.getDate());
    if(currTask.duedate>=startoftoday){
    Task.updateOne(
      { _id: req.params.id },
      { $set: { status: "completed" ,completeddate: startoftoday} }
    ).then(
      res.json("Task " + req.params.id + " has been updated to completed")
    );
    }
    else{
          Task.updateOne(
            { _id: req.params.id },
            {
              $set: { status: "completedoverdue", completeddate: startoftoday },
            }
          ).then(() =>
            res.json("Task " + req.params.id + " has been updated to completed")
          );  
    }
})

//change task to deleted by using id
router.put('/deletedtask/:id',(req,res)=>{
    Task.updateOne(
      { _id: req.params.id },
      { $set: { status: "deleted" } }
    ).then((data)=>{
      res.json("Task " + req.params.id + " has been updated to deleted" + data);
    }
    );
})

//get numberofcompletedtasktoday
router.get('/numberoftaskcompletedtoday',(req,res)=>{
    const startoftoday= new Date(today.getFullYear(),today.getMonth(),today.getDate());
    Task.find({ completeddate: { $gte: startoftoday } }).then((data) =>
      res.json(data.length)
    );
})

//getnumberofoverdue task
router.get('/numberofoverduetask',async(req,res)=>{
        const startoftoday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        //update task which are overdue
          //find task which duedate past today
        await Task.updateMany({duedate:{ $lte: startoftoday },status:"pending"},{$set:{status:"overdue"}});
        Task.find({status:"overdue"}).then(data=>res.json(data.length));
});


//getupcoming task for one week
router.get('/getupcomingtask',async(req,res)=>{
        const startofoneweeklater = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()+7
        );  
        pending=["pending","overdue"]
    Task.find({duedate:{ $lte: startofoneweeklater },status:pending}).then(data=>res.json(data));
}
);


//data percetages for task complete 1year, 1 week , 1 month
router.get('/gettaskcompletedpercentage', async(req,res)=>{
  var complieddata = { today: 0, oneweek: 0, onemonth: 0 };
  let pending = ["pending", "overdue"];
  //1 day
  const startoftoday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  await Task.find({ duedate: { $lte: startoftoday }, status: pending }).then(
    (data) => {
      complieddata.today = data.length;
    }
  );

  await Task.find({
    duedate: { $lte: startoftoday },status:{ $ne:"deleted"}
  }).then((data) => {
    complieddata.today =100-( (complieddata.today / data.length) * 100);
  });

  //1 week
  const startofoneweeklater = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 7
  );
  await Task.find({
    duedate:  { $lte: startofoneweeklater},
    status: pending,
  }).then((data) => {
    complieddata.oneweek = data.length;
  });

  await Task.find({
    duedate: {  $lte: startofoneweeklater },
    status: { $ne: "deleted" },
  }).then((data) => {
    complieddata.oneweek = 100 - (complieddata.oneweek / data.length) * 100;
  });
  //1 month
    const startofonemonthlater = new Date(
        today.getFullYear(),
        today.getMonth()+1,
        today.getDate() 
    );

    await Task.find({
        duedate: {  $lte: startofonemonthlater },
        status: pending,
    }).then((data) => {
        complieddata.onemonth = data.length;
    });

    await Task.find({
        duedate: {  $lte: startofonemonthlater },
        status: { $ne:"deleted"}
    }).then((data) => {
        complieddata.onemonth = 100 - (complieddata.onemonth / data.length) * 100;
    });

  res.json(complieddata);
}) 


//data for completed task for past week
router.get('/getcompletedtaskforpastweek',async(req,res)=>{
    try{
        const compileddata=[];
        const startofpastweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() -7
        );
        completed=["completed","completedoverdue"]
            var i =7;
        while(i>0){
            const date= new Date(
                startofpastweek.getFullYear(),
                startofpastweek.getMonth(),
                startofpastweek.getDate() +i
            )
            await Task.find({status:completed,completeddate:date}).then(data=>{
                const newinput={date:date, value:data.length}
                compileddata[i-1]=newinput;
            });
            i--;
        }
        res.json(compileddata);

    }catch (error){
        console.log(error);
    }
});

//data for completed task for past week
router.get('/getcompletedtaskontimeforpastweek',async(req,res)=>{
    try{
        const compileddata=[];
        const startofpastweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() -7
        );
        completed=["completed"]
            var i =7;
        while(i>0){
            const date= new Date(
                startofpastweek.getFullYear(),
                startofpastweek.getMonth(),
                startofpastweek.getDate() +i
            )
            await Task.find({status:completed,completeddate:date}).then(data=>{
                const newinput={date:date, value:data.length}
                compileddata[i-1]=newinput;
            });
            i--;
        }
        res.json(compileddata);

    }catch (error){
        console.log(error);
    }
});

//data for completed task for past week
router.get('/getcompletedtasklateforpastweek',async(req,res)=>{
    try{
        const compileddata=[];
        const startofpastweek = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() -7
        );
        completed=["completedoverdue"]
            var i =7;
        while(i>0){
            const date= new Date(
                startofpastweek.getFullYear(),
                startofpastweek.getMonth(),
                startofpastweek.getDate() +i
            )
            await Task.find({status:completed,completeddate:date}).then(data=>{
                const newinput={date:date, value:data.length}
                compileddata[i-1]=newinput;
            });
            i--;
        }
        res.json(compileddata);

    }catch (error){
        console.log(error);
    }
});

//get number of task completed by type
router.get('/getcompletedtaskbytype',async(req,res)=>{
    const types=['Work','Leisure','Errands','Finance']
    const completed=['completed','completedoverdue'];
    const compileddata={Work:0,Leisure:0,Errands:0,Finance:0};
    var x;
    for (x of types){
        await Task.find({type:x,status:completed}).then(data=>{
            compileddata[x]=data.length});
    }
    res.json(compileddata);
})



//data for pending task for next week
router.get('/getpendingtaskfornextweek',async(req,res)=>{
    try{
        const compileddata=[];
        var startofnextweek = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate()
        );
        var i =7;
        while(i>0){
            const date= new Date(
                startofnextweek.getFullYear(),
                startofnextweek.getMonth(),
                startofnextweek.getDate() +i
            )
            const date2 = new Date(
                startofnextweek.getFullYear(),
                startofnextweek.getMonth(),
                startofnextweek.getDate() + i -1
            );

            await Task.find({ status: "pending", duedate: {$lte:date , $gte:date2} }).then(
              (data) => {
                const newinput = { date: date, value: data.length };
                compileddata[i - 1] = newinput;
              }
            );
            i--;
        }
        res.json(compileddata);

    }catch (error){
        console.log(error);
    }
});

//get pending task by type
router.get("/getpendingtaskbytype", async (req, res) => {
  const types = ["Work", "Leisure", "Errands", "Finance"];
  const pending = ["pending", "overdue"];
  const compileddata = { Work: 0, Leisure: 0, Errands: 0, Finance: 0 };
  var x;
  for (x of types) {
    await Task.find({ type: x, status: pending }).then((data) => {
      compileddata[x] = data.length;
    });
  }
  res.json(compileddata);
});

//clear all data
router.delete("/deletealldata/",(req,res)=>{
    Task.deleteMany({}).then(data=>res.json(data));
})



module.exports=router;