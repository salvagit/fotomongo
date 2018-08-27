const express = require('express');
const path = require('path');
const Router = express.Router();
const Images = require('../controllers/images');

const multer = require('multer');

Router.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

  if (req.method == 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

var upload = multer({ dest: path.join(__dirname, process.env.UPLOAD_PATH) })

Router.get('/api/getImages', Images.getImages);
Router.post('/api/addNewImage', upload.single('image'), Images.multerAdd);

module.exports = Router;