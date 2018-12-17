const PORT = 8080;
const express = require('express');
const app = express();

app.use(express.static('public'))

// app.get('/channels/cat/:id', (req, res) => {
//   templateVars = {
//     url: 'http://localhost:8080/cat.jpg'
//   }
//   res.send(templateVars);
// });



app.listen(PORT, () => {
    console.log(`We're live on port ${PORT}!`);
  });