var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: {
        id:{
            type : mongoose.Schema.Types.ObjectId,
            ref: "User" //the model that we are going to refer to using this _id
        } ,
        username: String
    }
});


module.exports = mongoose.model("Comment", commentSchema);