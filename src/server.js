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

app.get('/categories', function (req, res) {
  fs.readFile(__dirname + "/resources/" + "categories.json", 'utf8', function (err, data) {
    console.log(data);
    res.send(data);
  });
})




app.get('/clip', (req, res) => {
  fs.readFile(__dirname + "/resources/" + "playlists.json", 'utf8', function (err, data) {
    const playlists = JSON.parse(data).playlists;
    const playlistId = playlists[Math.floor(Math.random() * playlists.length)].code
    const url = "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2C+id&maxResults=1000&playlistId=" + playlistId + "&key="
    const yt_video = "https://www.youtube.com/watch?v="
    fetch(url + process.env.YT_API_KEY)
      .then(response => response.json())
      .then(data => {
        const urls = data.items.map(elem => yt_video + elem.snippet.resourceId.videoId)
        const idx = Math.floor(Math.random() * Math.floor(urls.length))
        res.send({ "url": urls[idx] })
      })
      .catch(err => console.log(err));
    increment('clip')
  });
})

app.get('/meme', function (req, res) {
  const obj = fetch('https://meme-api.herokuapp.com/gimme')
    .then(response => response.json())
    .then(data => res.send({ "url": data.url }))
    .catch(err => console.log(err));
  increment('meme')
})

app.get('/landscape', function (req, res) {
  const obj = fetch('https://meme-api.herokuapp.com/gimme/EarthPorn')
    .then(response => response.json())
    .then(data => res.send({ "url": data.url }))
    .catch(err => console.log(err));
  increment('landscape')
})

var spotifyApi = new SpotifyWebApi({
  clientId: '066408f213eb445db863613e81c4dc06',
  clientSecret: 'c7a2a9f9209749289d566124a1eb2a65'
});


app.get('/music', function (req, res) {
  spotifyApi.clientCredentialsGrant().then(
    function (data) {
      fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX1s9knjP51Oa/tracks', {
        method: 'GET',
        headers: {
          "Authorization": "Bearer " + data.body['access_token'],
        }
      }).then(tracks => tracks.json())
        .then(tracksJson => {
          var url = tracksJson.items[Math.floor(Math.random() * tracksJson.items.length)].track.preview_url;
          res.send({ "url": url })
        })
        .catch(err => console.log(err))
    },
    function (err) {
      console.log('Something went wrong when retrieving an access token', err);
    }
  );
  increment('music')
})

app.get('/breathing', function (req, res) {
  fs.readFile(__dirname + "/resources/" + "exercises.json", 'utf8', function (err, data) {
    console.log(data);
    let parsed = JSON.parse(data);
    res.send(parsed.exercises[Math.floor(Math.random() * parsed.exercises.length)])

  });
  increment('breathing')
})

const increment = function (category) {
        pool.query('INSERT INTO counts(category, created_on) VALUES ($1, $2)', [category, new Date()], (err, res) => {
          if (err) {
            console.log(err.stack)
          } else {
            console.log('inserted')
          }
        })
}

app.get('/counts', function (req, res) {
  pool.query("SELECT COUNT(*) FROM counts GROUP BY counts.createdOn, counts.category", (err, response) => {
    if (err) {
      console.log(err.stack)
    } else {
      res.send(response.rows)
    }
  })
})



app.listen(process.env.PORT || 5000)

