const mongoose = require('mongoose');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
console.log(process.env.MONGO_URI) 
mongoose.Promise = global.Promise;
global.url =  process.env.MONGO_URI;
console.log(global.url )

if (!url) {
    console.error('Error: MONGO_URI environment variable is not set.');
    process.exit(1);
  }
  
  console.log("herererere");
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true,  })
    .then(() => {
      console.log('Connected to the database successfully!');
    })
    .catch(err => {
      console.log(process.env.MONGO_URI);
        console.error('Connection error:', err.message);
        console.error('Stack trace:', err.stack);
      console.error('o the database. Exiting now...', err);
      process.exit(1);
    });