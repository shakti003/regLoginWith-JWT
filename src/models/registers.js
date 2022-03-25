const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");



const registerSchema = mongoose.Schema({
    firstname : {
        type : String,
        required: true
    },
    lastname : {
        type : String,
        required : true
    },
    email:{
        type:String,
        require:true,
        unique:[true,"Email exist...."]
    },
    password:{
        type:String,
        require:true,
       
    },
    confirmpassword:{
        type:String,
        require:true,
         
    },
    tokens: [{
        token: {
            type : String,
            required : true

        }
    }]
    
})
//Generating token
registerSchema.methods.generateAuthToken = async function(){
    try {
        const token = await jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY)
        
        this.tokens = this.tokens.concat({token:token});
        return token ;
        //await this.save();
        
    } catch (error) {
        res.send("Error part" + error)
    }
}

//Converting Password into hasing
registerSchema.pre("save",async function(next){
    if(this.isModified){
        
       // console.log(`current password is ${this.password}`);
        this.password = await bcrypt.hash(this.password ,10);
       // console.log(`Hasing password is ${this.password}`);

        this.confirmpassword = await bcrypt.hash(this.password,10);
    }
   
    next();
})


// Now create collection
const Register = new mongoose.model('Register',registerSchema);

module.exports = Register ;