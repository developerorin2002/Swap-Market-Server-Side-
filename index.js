const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors')
// middlewere 
app.use(cors());
app.use(express.json());



app.get('/',(req,res)=>{
   res.send('server is runnning')
})











app.listen(port,()=>{
    console.log(`server is running on port ${5000}`);
})