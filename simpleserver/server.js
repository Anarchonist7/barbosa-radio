const PORT = process.env.PORT || 8080;
const express = require('express');
const app = express();
const bodyParser    = require("body-parser");


const serverData = [
  {
    id: 1,
    title: 'Stressed Out',
    artist: 'Twenty One Pilots',
    albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
    audioUrl: 'http://localhost:8080/tune2.mp3'
  },
  {
    id: 2,
    title: 'Iron Lion Zion',
    artist: 'Bob Marley',
    albumArtUrl: "http://36.media.tumblr.com/14e9a12cd4dca7a3c3c4fe178b607d27/tumblr_nlott6SmIh1ta3rfmo1_1280.jpg",
    audioUrl: 'http://localhost:8080/tune3.mp3'
  }
]

function asyncRequest() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(serverData)
    }, 2000)
  })
}

app.use(express.static('public'))

app.get("/ships/1", function(req, res) {
  asyncRequest().then((serverResponse, error) => {
    if (error) {
      console.log('error', error.message)
      res.status(500).json({ error: error.message });
    } else {
      res.json(serverResponse);
    }
  });
});

app.listen(PORT, () => {
    console.log(`We're live on port ${PORT}!`);
  });