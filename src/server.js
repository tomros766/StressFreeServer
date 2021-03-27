var express = require('express');
var app = express();
var fs = require("fs");
var cors = require("cors")
const fetch = require("node-fetch");

app.use(cors())


app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
 })

app.get('/categories', function (req, res) {
   fs.readFile( __dirname + "/resources/" + "categories.json", 'utf8', function (err, data) {
      console.log( data );
      res.send( data );
   });
})

app.get('/meme', function (req, res) {
    const obj = fetch('https://meme-api.herokuapp.com/gimme')
    .then(response => response.json())
    .then(data => res.send(data.url))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT || 5000)