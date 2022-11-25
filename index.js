const express = require('express');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
// middlewere 
app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wfzwlor.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async() =>{
    const categoryCollection = client.db('swap-car').collection("car-category")
    const usersCollection = client.db('swap-car').collection("users")
    const carsCollection = client.db('swap-car').collection("all-cars")
    const orderCollection = client.db('swap-car').collection("orders")
    try{
        // get car category 
        app.get("/category",async(req,res)=>{
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        });
        // post user
        app.post('/users',async(req,res)=>{
            const user = req.body;
            console.log(user);
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
            console.log(order);
            const result = await orderCollection.insertOne(order);
            res.send(result);
        });
        // get an order 
        app.get('/order',async(req,res)=>{
            const email = req.query.email;
            console.log(email);
            const query = {
                email:email
            }
            const result = await orderCollection.find(query).toArray();
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