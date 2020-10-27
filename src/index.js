if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const { handleEvent } = require('./handleEvent');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.send('Hello from express');
});

app.post('/webhook', (req, res) => {
  req.body.events.map(handleEvent);
  return res.sendStatus(200);
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
