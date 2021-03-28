var express = require('express');
var app = express();
var fs = require("fs");
var cors = require("cors")
const fetch = require("node-fetch");
var SpotifyWebApi = require('spotify-web-api-node');
const { Pool, Client } = require('pg');
const { response } = require('express');

const pool = new Pool({
  ssl: { rejectUnauthorized: false }
})


app.use(cors())


app.get('/', function (req, res) {
    console.log("Got a GET request for the homepage");
    res.send('Hello GET');
 })

const playlistId = "PLOWSbqDrrI5QU6-kEuXq2eFqWZ3po6yHh"
const url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&maxResults=1000&playlistId="+playlistId+"&key="
const yt_video = "https://www.youtube.com/watch?v="

app.get('/clip', (req,res) => {
   fetch(url+process.env.YT_API_KEY)
   .then(response => response.json())
   .then(data => 
      {
         const urls = data.items.map(elem =>yt_video+elem.snippet.resourceId.videoId)
         const idx = Math.floor(Math.random()*Math.floor(urls.length))
         res.send({"url": urls[idx]})
      })
   .catch(err => console.log(err));
   increment('clip')
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
    .then(data => res.send({"url": data.url}))
    .catch(err => console.log(err));
    increment('meme')
})


  var spotifyApi = new SpotifyWebApi({
    clientId: '066408f213eb445db863613e81c4dc06',
    clientSecret: 'c7a2a9f9209749289d566124a1eb2a65'
  });
  

app.get('/music', function (req, res) {
  spotifyApi.clientCredentialsGrant().then(
    function(data) {
        fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX1s9knjP51Oa/tracks', {
        method: 'GET',
        headers: {
            "Authorization": "Bearer " + data.body['access_token'],
        }
    }).then(tracks => tracks.json())
    .then(tracksJson => {
        var url = tracksJson.items[Math.floor(Math.random() * tracksJson.items.length)].track.preview_url;
        res.send({"url" : url})
    })
    .catch(err => console.log(err))
    },
    function(err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  increment('music')
})

app.get('/breathing', function(req, res) {
  fs.readFile( __dirname + "/resources/" + "exercises.json", 'utf8', function (err, data) {
    console.log(data);
    let parsed = JSON.parse(data);
    res.send( parsed.exercises[Math.floor(Math.random() * parsed.exercises.length)] )
    
 });
 increment('breathing')
}) 

const increment = function(category) {
  pool.query('SELECT counts.count FROM counts WHERE counts.category = $1', [category] ,(err, res) => {
    if (err) {
      console.log(err.stack)
    } else {
      if (res.rows == null) {
        pool.query('INSERT INTO counts(category, count) VALUES ($1, $2) returning *', [category, 1], (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log(res.rows[0])
          }
        })

      } else {
        pool.query('UPDATES counts SET count=count+1 WHERE category = $1', [category], (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('updated')
          }
        })
      }
    }
  })
}



app.listen(process.env.PORT || 5000)

