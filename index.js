const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;


//midleWere:
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.coffee_Db}:${process.env.coffee_pass}@cluster0.bqchovi.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("CoffeeDB");
        const coffeeConection = database.collection("coffee");


        app.get('/coffee', async (req, res) => {
            const cursor = coffeeConection.find()
            const result = await cursor.toArray()
            res.send(result)
        })

        app.get('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const options = { _id: new ObjectId(id) }
            const result = await coffeeConection.findOne(options)
            res.send(result)
        })

        app.post('/coffee', async (req, res) => {
            const coffee = req.body;
            const result = await coffeeConection.insertOne(coffee)
            res.send(result)

        })
        app.put('/coffee/:id', async (req, res) => {
            const id = req.params.id
            const user = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateCofee = {
                $set: {
                    name: user.name,
                    chef: user.chef,
                    supplier: user.supplier,
                    tests: user.tests,
                    category: user.category,
                    details: user.details,
                    photoUrl: user.photoUrl
                }
            }
            const result = await coffeeConection.updateOne(filter, updateCofee, options);
            res.send(result)
        })

        app.delete('/coffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            console.log(query)
            const result = await coffeeConection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('coffee server is runnning')
})

app.listen(port, () => {
    console.log(`server project setUp done,${port}`)
})