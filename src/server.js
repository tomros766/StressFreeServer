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

const playlistId = "PLOWSbqDrrI5QU6-kEuXq2eFqWZ3po6yHh"
const url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&maxResults=1000&playlistId="+playlistId+"&key="
const yt_video = "https://www.youtube.com/watch?v="

app.get('/clips', (req,res) => {
   fetch(url+process.env.YT_API_KEY)
   .then(response => response.json())
   .then(data => res.send(data.items.map(elem =>yt_video+elem.snippet.resourceId.videoId)))
   .catch(err => console.log(err));
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
    .then(data => res.send(data))
    .catch(err => console.log(err));
})

app.listen(process.env.PORT || 5000)
