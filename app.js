const express = require('express');
const mongojs = require('mongojs');

const dbPath = 'mongodb://test_mongo_1:27017';
const port = 3000;

const db = mongojs(dbPath, ['fotolog']);

const app = express();

app.use(express.static('public'));

app.get('/api/getImages', (req, res) => {
  db.fotolog.find({}, (err, docs) => {
    if (err) return err;
    return res.json(docs);
  })
});

app.listen(port);