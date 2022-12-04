const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000


app.use(cors());
app.use(express.json());

const uri = "mongodb+srv://dbuser:gOI4GdOZgJz6UlZp@cluster0.c3txqlb.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const userConnection = client.db('mongonode').collection('users')


        app.get('/users', async (req, res) => {
            const quary = {};
            const cursor = userConnection.find(quary)
            const users = await cursor.toArray();
            res.send(users)
        })

        app.get('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) };
            const user = await userConnection.findOne(quary)
            res.send(user)
        })

        app.post('/users', async (req, res) => {
            const user = req.body
            console.log(user)
            const result = await userConnection.insertOne(user)
            res.send(result)
        })

        app.put('/users/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const user = req.body;
            const option = { upsert: true }
            const updatedUser = {
                $set: {
                    name: user.name,
                    address: user.address,
                    email: user.email
                }
            }
            const result = await userConnection.updateOne(filter, updatedUser, option);
            res.send(result)
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const quary = { _id: ObjectId(id) }
            // console.log('trying to delete', id)
            const result = await userConnection.deleteOne(quary)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('hello form node mongo curd ')
})

app.listen(port, () => {
    console.log(`listening to port ${port}`)
})