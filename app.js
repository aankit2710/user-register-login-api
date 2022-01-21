//Components Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
const cors = require("cors");

//Calling env variable
require('dotenv').config();

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

//Middleware
app.use(express.json());
app.use(cors());

//Importing User Routes
const userRoute = require('./src/controllers/user_controller');
app.use('/api/user', userRoute);


//ROUTES
app.get('/', (req, res) => {
    res.send("Server connected");
})

const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcowk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
console.log(url);
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once("open", () => { console.log('Successfully Connected to Database!') });

//Listen

server.listen(server_port, server_ip_address, function () {

  console.log( "Listening on " + server_ip_address + ", port " + server_port )

});