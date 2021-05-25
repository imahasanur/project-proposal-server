const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()
const port = process.env.PORT || 4000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8pwx7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;


const app = express()
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('I am there')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const usersCollection = client.db(`${process.env.DB_NAME}`).collection('users');
  const groupsCollection = client.db(`${process.env.DB_NAME}`).collection('groups');

  // add registration information of an user 
  app.post('/addUserInfo', (req, res) => {
    const information = req.body;
    usersCollection.insertOne(information)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

    // to check an email is a valid Teacher or not
    app.get('/isATeacher', (req, res) => {
      usersCollection.find({ email: req.query.email, designation: req.query.designation})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

    // to check an email is a valid Student or not
    app.get('/isAStudent', (req, res) => {
      usersCollection.find({ email: req.query.email, designation: req.query.designation})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })
    // to check a student is a group member or not
    app.get('/isAGroupMember', (req, res) => {
      groupsCollection.find({ email: req.query.email})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

    // to find a student's group
    app.get('/searchGroup', (req, res) => {
      groupsCollection.find({ name: req.query.name})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

  // to make a new group  
  app.post('/makeAGroup', (req, res) => {
    const groupInformation = req.body;
    groupsCollection.insertOne(groupInformation)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

  // to add a new group member
  app.post('/addAMember', (req, res) => {
    const groupInformation = req.body;
    groupsCollection.insertOne(groupInformation)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  })

    // to check total group member
    app.get('/memberCount', (req, res) => {
      groupsCollection.find({ name: req.query.name})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })

  // to get all Group Information
  app.get('/getAllGroup', (req, res) => {
    groupsCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })
  
  // to update a group member status
  app.patch("/updateStatus/:id",(req, res)=>{
    groupsCollection.updateOne({_id: ObjectId(req.params.id)},
    {
      $set:{status:req.body.status}
    }
    )
    .then(result =>{
      console.log(result);
      res.send(result.modifiedCount > 0)
    })
  })

    // to get all student Information
    app.get('/viewStudents', (req, res) => {
      usersCollection.find({})
      .toArray((err, documents)=>{
        res.send(documents);
      })
    })
  

  // client.close();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

