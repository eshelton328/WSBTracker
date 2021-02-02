const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.static('../client/dist'));
app.use(express.json());


app.listen(PORT, () => {
  console.log('serving up now at ' + JSON.stringify(PORT));
});