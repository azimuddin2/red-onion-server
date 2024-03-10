const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// Database connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.t3bn8t4.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {
    try {
        const foodCollection = client.db("redOnion").collection("foods");
        const reviewsCollection = client.db('redOnion').collection('reviews');

        // food related api
        app.get('/foods', async (req, res) => {
            const search = req.query.search;
            let cursor;

            if (search) {
                cursor = foodCollection.find({ name: { $regex: search, $options: 'i' } });
            } else {
                cursor = foodCollection.find();
            }

            const result = await cursor.toArray();
            res.send(result);
        });


        // reviews related api
        app.get('/reviews', async (req, res) => {
            const query = {};
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews);
        });

    }
    finally {

    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Red onion server running.')
});

app.listen(port, () => {
    console.log(`Red onion app listening on port ${port}`)
});