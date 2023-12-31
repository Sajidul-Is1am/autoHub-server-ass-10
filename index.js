const express = require('express')
const cors = require('cors');
require('dotenv').config()
const {
    MongoClient,
    ServerApiVersion,
    ObjectId
} = require('mongodb');
const app = express()
const port = process.env.PORT || 5000





// connection everthing

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.cn0nmqv.mongodb.net/?retryWrites=true&w=majority`;


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
        const ProductCollection = client.db("AutoHubBrandDB").collection("products");
        const BrandCollection = client.db("AutoHubBrandDB").collection("Brand");
        const MyCardCollection = client.db("AutoHubBrandDB").collection("MyCard");

        // insert data
        app.post('/products', async (req, res) => {
                const products = req.body;
                const result = await ProductCollection.insertOne(products);
                res.send(result)
            }),
            // add data for my card information
            app.post('/products/mycard', async (req, res) => {
                const MyProduct = req.body;
                const result = await MyCardCollection.insertOne(MyProduct)
                res.send(result)
            });
        app.get('/products/mycard', async (req, res) => {
            const resuls = await MyCardCollection.find().toArray();
            res.send(resuls)
        })

        // add brand 6 data form home page show all brand
        app.post('/brands', async (req, res) => {
                const Brand = req.body;
                const result = await BrandCollection.insertOne(Brand);
                res.send(result)
            }),

            // read data from brand collections
            app.get('/brands', async (req, res) => {
                const result = await BrandCollection.find().toArray();
                res.send(result)
            })
        // read data find data 

        app.get('/products', async (req, res) => {
            const result = await ProductCollection.find().toArray();
            res.send(result)
        })

        // get data form barand advertisment 
        app.get('/products/:brandName', async (req, res) => {
            const brandName = req.params.brandName;
            const query = {
                brandname: brandName
            };
            const results = await ProductCollection.find(query).toArray();
            res.send(results)
        })

        // details for product

        app.delete('/products/mycard/:id',async (req,res) =>{
            const id = req.params.id;
            const query = {_id : new ObjectId(id)};
            const result = await MyCardCollection.deleteOne(query);
            res.send(result)

        })

        // update data 

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const filter = {
                _id: new ObjectId(id)
            };
            const options = {
                upsert: true
            };
            const update = {
                $set: {
                    image: updatedData.image,
                    name: updatedData.name,
                    brandname: updatedData.brandname,
                    category: updatedData.category,
                    price: updatedData.price,
                    rating: updatedData.rating
                },
            };
            const result = await ProductCollection.updateOne(filter, update, options);
            res.send(result)

        })





        // Send a ping to confirm a successful connection
        await client.db("admin").command({
            ping: 1
        });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// middlewere

app.use(express.json())
app.use(cors())



app.get('/', (req, res) => {
    res.send("Local Server is Runnning.....")
})

app.listen(port, () => {
    console.log("this is running on", port);
})





// 
// 