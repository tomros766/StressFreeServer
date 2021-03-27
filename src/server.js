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
    .then(data => res.send({"url": data.url}))
    .catch(err => console.log(err));
})

app.get('/music', function (req, res) {
    fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
        "Authorization": "066408f213eb445db863613e81c4dc06:c7a2a9f9209749289d566124a1eb2a65"
    },
    body: {
        "grant_type": "client_credentials"
    }
}).then(data => data.json)
.then(object => {
    fetch('https://api.spotify.com/v1/playlists/37i9dQZF1DX1s9knjP51Oa/tracks', {
        method: 'GET',
        headers: {
            "Authorization": object.access_token,
        }
    }).then(obj => res.send(obj))
})
});




app.listen(process.env.PORT || 5000)