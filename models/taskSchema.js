const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    title:{
        type:String,
        require:['title is required']
    }
});

module.exports = mongoose.model('taskSchema',taskSchema);