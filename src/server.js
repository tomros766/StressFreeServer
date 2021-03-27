var express = require('express');
var app = express();
var fs = require("fs");
var http = require('http')
var cors = require('cors');

app.use(cors);

http.createServer(app, 8081)

app.get('/getCategories', function (req, res) {
   fs.readFile( __dirname + "/resources/" + "categories.json", 'utf8', function (err, data) {
      console.log( data );
      res.end( data );
   });
})

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Example app listening at http://%s:%s", host, port)
})