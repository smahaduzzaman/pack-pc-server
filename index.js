const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const username = "packpc";
const password = "SAim654oTswoQaIk";

const uri = `mongodb+srv://${username}:${password}@cluster0.fceds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Database Connected Successfully");
    const productsCollection = client.db("packpc").collection("products");
    const categoriesCollection = client.db("packpc").collection("categories");

    app.get("/products", async (req, res) => {
      const cursor = productsCollection.find({});
      const products = await cursor.toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.get("/categories", async (req, res) => {
      const cursor = categoriesCollection.find({});
      cursor.sort({ name: -1 });
      const categories = await cursor.toArray();
      res.send(categories);
    });

    app.get("/products/category/:category", async (req, res) => {
      const category = req.params.category;
      const query = { category: category };
      const cursor = productsCollection.find(query);
      const products = await cursor.toArray();
      res.send(products);
    });
  } catch (error) {
    console.log(error.stack);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', async (req, res) => {
    res.send('Pack PC server is running');
})

app.listen(port, () => {
    console.log(`Pack PC Server is Running at http://localhost:${port}`)
})