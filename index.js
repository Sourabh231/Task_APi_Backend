const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');

const app = express();

const taskModel = require('./models/taskSchema');


//const routes = require('./routes/userRoutes');

//middleware
app.use(bodyparser.json());


mongoose.connect(`mongodb://localhost:27017/Task`,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log(`connected to the database`);
}).catch((err)=>{
    console.log(`database connected error`,err)
});



app.get('/',(req,res)=>{
    res.status(200).send('Hello Sourabh')
});

const port = 5000;



//create a post  || task

app.post('/v1/tasks',(req,res)=>{
    const {title} = req.body;

    if(!title){
        return res.status(201).json({message:'title are required'})
    }

    try{
        const task = new taskModel({
            title:req.body.title
        });
        task.save().then(result=>{
            res.status(201).json({
                message:'task created successfully',
                id:result._id
            })
        })

    }catch(err){
        console.log('error',err);
    }
})

app.listen(port,()=>{
    console.log(`server is connected to port of ${port}`);
});



//get all the tasks 

app.get('/v1/tasks',(req,res)=>{
    try{
        taskModel.find().then(result=>{
            res.status(201).send({
                message:'data arrives of all the tasks',
                tasks:result,
                is_completed:true
            })
        })

    }catch(err){
        console.log('err',err);

    }
})


//get the specific tasks

app.get('/v1/tasks/:id',(req,res)=>{
    taskModel.findById(req.params.id).then(result=>{
        if(result){
            res.status(201).send({
                result,
                is_completed:false
            })
        }
        else{
            res.status(404).json({message:'task not found'})
        }
    })
});


//Delete a specific Tasks

app.delete('/v1/tasks/:id',(req,res)=>{
    taskModel.deleteOne({_id:req.params.id}).then((result)=>{
        if(result.deletedCount > 0){
            res.status(201).send({
                message:'task deleted successfully'
            })
        }
        else{
            res.status(401).send({
                message:'none'
            })
        }
    })
});


//update a title or specific tasks

app.put('/v1/tasks/:id',(req,res)=>{
    const updateTask = new taskModel({
        _id:req.params.id,
        title:req.params.title
    });
    taskModel.updateOne({_id:req.params.id},updateTask).then(result=>{
        if(result){
            res.status(200).send({
                message:'task updated successfully'
            })
        }
        else{
            res.status(201).send({
                message:'task not found'
            })
        }
    })
})



//bulk add task

app.post('/v1/tasks/bulk-task',async(req,res)=>{
    const {task} = req.body;
    taskModel.insertMany(task).then(result=>{
        res.status(201).send({
            message:result
        })
    }).catch(err=>{
        console.log(err,'err');
        res.send({
            message:'error add the bulk task'
        })
    });
});

//delete the multiple task

app.delete('/v1/tasks/bulk-deleted',async(req,res)=>{
    const {task} = req.body;
    taskModel.deleteMany(task).then(result=>{
        res.status(201).send({
            message:result
        })
    }).catch(err=>{
        console.log('err',err);
    })
})