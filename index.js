const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId,  } = require("mongodb");
require("dotenv").config();
const app = express();

const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bi1el.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productCollection =client.db("emajohn").collection("products")
    
    app.get('/products',async(req,res)=>{
      const page=parseInt(req.query.page);
      const size=parseInt(req.query.size);
      const query= {}
      const cursor= productCollection.find(query)
      let products;
      if(page || size){
        products=await cursor.skip(page*10).limit(size).toArray()
      }else{
         products=await cursor.toArray()
      }
      res.send(products)
    })

    app.post('/productBykeys',async(req,res)=>{
      const keys=req.body;
      console.log(keys)
      const ids= keys.map(id=>ObjectId(id))
      const query={_id: {$in:ids}}
      const cursor=productCollection.find(query)
      const products=await cursor.toArray()
      
      res.send(products)
    })

    app.get('/pagecount',async(req,res)=>{
    
      const count=await productCollection.estimatedDocumentCount()
      res.send({count})
    })
    
  } finally {
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
