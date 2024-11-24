const http = require('http');
const {url, parse} = require('url');
const crypto = require('crypto');
const { MongoClient, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const { Router, json } = require('./lib/router');
const JWT_SECRET = "aa";
const mongoUrl = "mongodb+srv://Ken:Ken2024@cluster0.ar39i.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let db, 
usersCollection, 
productsCollection, 
imagesCollection, 
ordersCollection, 
storageCollection;

async function databaseConnect(){
  await MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db();
    usersCollection = db.collection('UserInfo');
    productsCollection = db.collection('ProductInfo');
    imagesCollection = db.collection('ImageDetails');
    ordersCollection = db.collection('OrderInfo');
    storageCollection = db.collection('ProductStorage');
    console.log("Connected to database");
  })
  .catch(err => console.error(err));
}

let router = new Router()

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  router.resolve(req, res);
});

router.put('/profile/update', async({req, res})=>{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
  const { email, useremail } = JSON.parse(body);
  const records = await productsCollection.find({ userId: useremail }).toArray();
  if (!records.length) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "User not found" }));
  }
  const updatePromises = records.map(record => {
    return productsCollection.updateOne(
      { _id: record._id },
      { $set: { userId: email } }
    );
  });
  await Promise.all(updatePromises);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true }));
})})

router.post('/profile/update', async({req, res})=>{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
  const { email, useremail, gender, name } = JSON.parse(body);
  const user = await usersCollection.findOne({ email: useremail });
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "User not found" }));
  }
  const updatedUser = await usersCollection.findOneAndUpdate(
    { _id: user._id },
    { $set: { email, gender, name } },
    { returnDocument: 'after' }
  );
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ success: true, user: updatedUser.value }));
})})


router.get('/profile', async ({ req, res }) => {
  const parsedUrl = parse(req.url, true);
  const { token, useremail } = parsedUrl.query;
  if (!token) {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: "error", message: "Token is required" }));
  }
  try {
    const user = await usersCollection.findOne({ email: useremail });
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ status: "error", message: "User not found" }));
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "ok", data: user }));
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: "Invalid token" }));
    } else if (error.name === "TokenExpiredError") {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: "Token expired" }));
    } else {
      console.error(error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "error", message: "Internal server error" }));
    }
  }
});


router.get('/getP/:email', async({req, res, params})=>{
  const useremail = params.email;
  const userPurchaseRecord = await productsCollection.find({ userId: useremail }).toArray();
  if (userPurchaseRecord.length) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(userPurchaseRecord));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "error", message: "No purchase record found for this user." }));
  }
})

router.post('/login-user', async({req, res})=>{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
  
  const { email, password } = JSON.parse(body);
  const user = await usersCollection.findOne({ email });
  if (!user) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "User Not found" }));
  }
  const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
  if (encryptedPassword === user.password) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '15m' });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "ok", data: token }));
  } else {
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: "error", error: "Invalid Password" }));
  }
})})

router.post('/addP', async({req, res})=>{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
  const data = JSON.parse(body);
  const { record, cost, userId, date } = data;
  const oldProduct = await productsCollection.findOne({ record });
  const users = await usersCollection.find({}).toArray();
  for (const user of users) {
    if (user.email === userId) {
      var userName = user.name;
      await ordersCollection.insertOne({  buyTime: {day: date.day, month: date.month, year: date.year, record:{order: {}, cost, userId, userName} } });
      await productsCollection.insertOne({ record, cost, userId });
      return userName ;
    }
  }
  if (oldProduct) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "Product Exists" }));
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "ok" }));
})})

router.post('/register', async({req, res})=>{
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });
  
  req.on('end', async () => {
  const data = JSON.parse(body);
  const { selectedTimezone, date, contactNumber, email, password, userType } = data;
  const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
  const oldUser = await usersCollection.findOne({ email });
  if (oldUser) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: "User Exists" }));
  }
  await usersCollection.insertOne({ selectedTimezone, date, contactNumber, email, password: encryptedPassword, userType });
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: "ok" }));
})})

router.post('/reset-password/:useremail/:token', async ({ req, res, params }) => {
  const { useremail, token } = params;
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', async () => {
    try {
      const { password } = JSON.parse(body);
      const oldUser = await usersCollection.findOne({ email: useremail });
      if (!oldUser) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: "User Not Exists!!" }));
      }
      const secret = JWT_SECRET;
      try {
        const verify = jwt.verify(token, secret);
        const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');
        await usersCollection.updateOne(
          { email: useremail },
          { $set: { password: encryptedPassword } }
        );
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "Password updated successfully" }));
      } catch (error) {
        console.log(error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: "Invalid or Expired Token" }));
      }
    } catch (error) {
      console.log(error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "Invalid Request Body" }));
    }
  });
});


async function serverStart(){
  await databaseConnect()
  server.listen(5000, () => {
  console.log('Server started on port 5000');
});

}


serverStart();