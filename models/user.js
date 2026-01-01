const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default;


const userSchema=new Schema({ // but in our schema, there is 3 sections: username, email, password
    email:{
        type:String,
        required:true,  
    }
})

userSchema.plugin(passportLocalMongoose);// we dont need to create username, password or have to hash, 
///this plugin will do all hash , salt, hashed passwords automatically

module.exports = mongoose.model("User", userSchema);