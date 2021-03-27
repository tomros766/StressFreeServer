var express = require('express');
var app = express();
var fs = require("fs");
var cors = require("cors")

app.use(cors)


app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
 })

app.get('/getCategories', function (req, res) {
   fs.readFile( __dirname + "/resources/" + "categories.json", 'utf8', function (err, data) {
      console.log( data );
      res.send( data );
   });
})

app.listen(process.env.PORT || 5000)