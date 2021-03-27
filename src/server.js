var express = require('express');
var app = express();
var fs = require("fs");
var cors = require("cors")
const fetch = require("node-fetch");
var SpotifyWebApi = require('spotify-web-api-node');



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
    .then(data => res.send({"url": data.url}))
    .catch(err => console.log(err));
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
})






app.listen(process.env.PORT || 5000)