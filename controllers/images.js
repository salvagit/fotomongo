require('dotenv').load();
const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs');

const db = mongojs(process.env.MONGO_PATH, ['fotolog']);

class Images {

  getImages (req, res) {
    db.fotolog.find({}, (err, docs) => {
      if (err) return err;
      return res.json(docs);
    })
  }
  
  multerAdd (req, res) {
    fs.rename(
      path.join(req.file.destination, req.file.filename),
      path.join(req.file.destination, req.file.originalname),
      err => {
        if (err) throw(err);
        let obj = {
          image: req.file.originalname,
          description: req.body.description
        }
        db.fotolog.insert(obj, (err, dbres) => {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
          res.end();
        });
      }
    );
  }
}

module.exports = new Images();