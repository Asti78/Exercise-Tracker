const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose=require('mongoose');
const{Schema}=mongoose;
mangoose.connect(process.env.MANGO_URI )

const UserSchema= new Schema({
  username: String,
},
);

const User=mongoose.model('User',UserSchema);
const ExercisesSchema=new Schema({
  user_id:{type:String,required:true},
  description:String,
  duration:Number,
  date:Date,
  
});
const Exercise=mongoose.model("Exercises",ExercisesSchema)
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
 app.get('/api/users',async(req,res)=>{
  const users=await User.find({}).select("_id username");
  if(!users){
    res.send("no users");
  }else{
    res.send(users);
  }

 });
app.post('/api/users',async(req,res)=>{
 const userObj=new User({
  username:req.body.username
 })
 try{
  const user=await userObj.save();
  console.log(user);
  
  res.json(user);
 }catch(err){
  console.log(err);
  
 }
});
app.get('/api/users/:_id/exercises',async(req,res)=>{
  const id=req.params._id;
  const {description,duration,date}=req.body
  try{
    const user= await User.findById(id);
    if(!user){
      res.send("Could not find user")
    }
    else{
      const exerciseObj=new Exercise({
        user_id:user._id,
        description,
        duration,
        date:date? new Date(date):new Date()
      })
      const exercise= await exerciseObj.save()
      res.json({
        _id:user._id,
        username:user.username,
        description:exercise.description,
              duration:exercise.duration,
              date: new Date( exercise.date).toDateString(),
      })
    }
  }catch(err){
    console.log(err);
    res.send("there was an error saving the exercise")
  }
})
app.get("/api/users/:_id/logs",async(req,res) =>{
const{from,to,limit}=rep.query;
const id =rep.params._id;
const user =await User.findById(id);
if(!user){
  res.send("Could not find user")
  return;
}
let dateObj={}
if(from){
  dateObj["$gte"]= new Date(from)
}
if(to){
  dateObj["$lte"]=new Date(to)
}
let filter={
  user_id:id
}
if(from||to){
  filter.date=dateObj;
}
const exercises=await Exercise.find(filter.limit(+limit ?? 500))
const log =exercises.map(e=>({
  description:e.description,
  duration:e.duration,
  date:e.date.toDateString()
}))
res.json=exercises.map( e =>({
  username:user.username,
  count:exercises.length,
  _id:user._id,
  log
}))
})
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
