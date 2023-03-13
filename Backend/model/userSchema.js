const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    // _id:{
    //     type:ObjectId,
    //     required:true
    // },
    name:mongoose.Schema.Types.String,
    phone:mongoose.Schema.Types.String,
    email:mongoose.Schema.Types.String,
    password:mongoose.Schema.Types.String,
    tokens:[
        {
            token:{
                type:String,
                required:true
            }
        }
    ]
})

userSchema.pre('save',async function(next){
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();
});

userSchema.methods.generateAuthToken= async function(){
    try{
        let token=jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token; //return iss liye krwaya h taki hum use signin route me get kr skein
    } catch(err){
        console.log(err);
    }
}

module.exports=mongoose.model('User',userSchema);