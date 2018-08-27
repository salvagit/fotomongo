const fs = require('fs');
const path = require('path');
const mongojs = require('mongojs');

const db = mongojs(process.env.MONGO_PATH, ['fotomongo']);

class Images {

  get (req, res) {
    let id = req.params._id;
    let filter = {};
    if (id) {
      filter = { _id: mongojs.ObjectId(id) };
    }
    db.fotomongo.find(filter, (err, docs) => {
      if (err) throw (err);
      return res.json(docs);
    })
  }

  save (req, res) {

    let id = req.body._id;
    let obj = {};

    function doSave (id, obj) {
      if (req.body.description) {
        obj.description = req.body.description;
      }
      if (!id) {
        db.fotomongo.insert(obj, (err, dbres) => {
          if (err) throw err;
          return res.end();
        });
      } else {
        db.fotomongo.findAndModify({
          query: { _id: mongojs.ObjectId(id) },
          update: { $set: obj },
          new: false
        }, function (err, doc, lastErrorObject) {
          if (err) throw err;
          let imagePath = path.join(
            __dirname,
            `${process.env.UPLOAD_PATH}/${process.env.UPLOAD_PATH, doc.image}`
          );
          if (fs.existsSync(imagePath)) {
            fs.unlink(imagePath, err => console.log(err) );
          }
          return res.end();
        });
      }
    }

    if (req.file) {
      obj.image = req.file.originalname;
      fs.rename(
        path.join(req.file.destination, req.file.filename),
        path.join(req.file.destination, req.file.originalname),
        fsErr => {
          if (fsErr) throw(fsErr);
          if (!req.body.description) doSave(id, obj);
        }
      );
    }
    if (req.body.description) doSave(id, obj);

  }

  delete (req, res) {
    db.fotomongo.find({ _id: mongojs.ObjectId(req.params._id) }, function (err, docs) {
      if (err) throw err;
      let imageName = '';
      imageName = docs[0].image;

      db.fotomongo.remove({ _id: mongojs.ObjectId(req.params._id) }, function (err, doc) {
        if (err) throw err;
        let imagePath = path.join(
          __dirname,
          `${process.env.UPLOAD_PATH}/${process.env.UPLOAD_PATH, imageName}`
        );
        if (fs.existsSync(imagePath)) {
          fs.unlink(imagePath, err => console.log(err) );
        }
        return res.end();
      });
    })

  }
}

module.exports = new Images();