const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs');

const db = mongojs(process.env.MONGO_PATH, ['fotolog']);

class Images {

  get (req, res) {
    db.fotolog.find({}, (err, docs) => {
      if (err) throw (err);      
      return res.json(docs);
    })
  }

  add (req, res) {
    fs.rename(
      path.join(req.file.destination, req.file.filename),
      path.join(req.file.destination, req.file.originalname),
      fsErr => {
        if (fsErr) throw(fsErr);
        let obj = {
          image: req.file.originalname,
          description: req.body.description
        }
        db.fotolog.insert(obj, (dbErr, dbres) => {
          if (dbErr) throw dbErr;
          return res.end();
        });
      }
    );
  }
  
  delete (req, res) {
    db.fotolog.remove({ _id: mongojs.ObjectId(req.params._id) }, function (err) {
      if (err) throw err;
      return res.end();
    });
  }
}

module.exports = new Images();