const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri =
  "mongodb+srv://products-curd:simD9PuozzQsOdH0@cluster0.6lvjk.mongodb.net/productsdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

client.connect((err) => {
  const collection = client.db("productsdb").collection("products");

  // Get products from database
  app.get("/products", (req, res) => {
    collection.find({}).toArray((err, collection) => {
      res.send(collection);
    });
  });
  // Get Single product
  app.get("/product/:id", (req, res) => {
    collection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, collection) => {
        res.send(collection);
      });
  });

  // Add products to database
  app.post("/add-product", (req, res) => {
    const product = req.body;
    collection.insertOne(product).then((result) => {
      console.log("data added successfully");
      res.redirect("/");
    });
  });

  // Delete product from database
  app.delete("/delete-product/:id", (req, res) => {
    collection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => res.send(result.deletedCount > 0));
  });

  // Update product
  app.patch("/update-product/:id", (req, res) => {
    collection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            name: req.body.name,
            price: req.body.price,
            quentity: req.body.quentity,
          },
        }
      )
      .then((result) => res.send(result.modifiedCount > 0));
  });
});

app.listen(3000, () => console.log("server is running at port 3000"));
