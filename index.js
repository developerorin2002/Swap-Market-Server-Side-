const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
// middlewere 
app.use(cors());
app.use(express.json());





const verifyUser = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({message:'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];
    if(!token){
        return res.status(401).send({message:'unauthorized access'})
    };
    jwt.verify(token,process.env.TOKEN_SECRET,(err, decoded)=>{
        if(err){
            res.status(403).send({message:'403 Forbidden'})
        }
        req.decoded = decoded;
    });
    next();
    
}
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wfzwlor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    const categoryCollection = client.db('swap-car').collection("car-category")
    const usersCollection = client.db('swap-car').collection("users")
    const carsCollection = client.db('swap-car').collection("all-cars")
    const orderCollection = client.db('swap-car').collection("orders")
    try{
        // jwt user token
        app.get('/jwt',(req,res)=>{
            const email = req.query.email;
            const token = jwt.sign({email},process.env.TOKEN_SECRET,{expiresIn:'20d'})
            res.send({token});
        });
        // get car category 
        app.get("/category",async(req,res)=>{
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        });
        // post user
        app.post('/users',async(req,res)=>{
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });
        // get all car
        app.get('/allcars/:name',async(req,res)=>{
            const category = req.params.name;
            const query = {
                category:category
            };
            const result = await carsCollection.find(query).toArray();
            res.send(result);
        });
        // post an order
        app.post('/order',async(req,res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });
        // get an order 
        app.get('/order',verifyUser,async(req,res)=>{
            const email = req.query.email;
            const decodedEmail = req.decoded.email;
            if(decodedEmail !== email){
                return res.status(401).send({message:'unauthorized access'})
            };
            const query = {
                email:email
            }
            const result = await orderCollection.find(query).toArray();
            res.send(result);
        });
        // check buyer role
        app.get('/seller',async(req,res)=>{
           const email = req.query.email;
           const query = {
            email:email
           };
           const user = await usersCollection.findOne(query);
           res.send({isSeller : user?.role == 'seller'})
        })
        // check admin
        app.get('/admin',async(req,res)=>{
           const email = req.query.email;
           const query = {
            email:email
           };
           const user = await usersCollection.findOne(query);
           res.send({isAdmin : user?.role == 'admin'})
        })
        // check buyer
        app.get('/buyer',async(req,res)=>{
           const email = req.query.email;
           const query = {
            email:email
           };
           const user = await usersCollection.findOne(query);
           res.send({isBuyer : user?.role == 'buyer'})
        })
        // post an order 
        app.post('/uploadcar',async(req,res)=>{
            const car = req.body;
            console.log(car)
            const upload = await carsCollection.insertOne(car);
            res.send(upload);
        });
        // get my product
        app.get('/myproduct',verifyUser,async(req,res)=>{
            const email = req.query.email;
            const query = {
                email:email
            };
            const result = await carsCollection.find(query).toArray();
            res.send(result);
        })
        // delete product
        app.delete('/deleteproduct/:id',async(req,res)=>{
            const deleteId = req.params.id;
            console.log(deleteId)
            const query = {
                _id:ObjectId(deleteId)
            }
            const result = await carsCollection.deleteOne(query);
            res.send(result);

        })
        

    }
    finally{

    }
}
run().catch(err=>console.log(err))





app.get('/',(req,res)=>{
   res.send('server is runnning')
})











app.listen(port,()=>{
    console.log(`server is running on port ${5000}`);
})