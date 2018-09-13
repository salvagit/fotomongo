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
    db.fotomongo.find(filter).sort( { 'order': 1 }, (err, docs) => {
      if (err) throw (err);
      return res.json(docs);
    });
  }

  order (req, res) {
    let from = parseInt(req.body.from, 10);
    let to = parseInt(req.body.to, 10);
    // get all documents in original sort.
    db.fotomongo.find({}).sort({ 'order': 1 }, (err, docs) => {
      if (err) throw (err);
      // get moved item.
      const movedItem = docs.find( (item, index) => item.order == from );
      // get the other items.
      const remainingItems = docs.filter((item, index) => item.order != from);
      // create list with new order.
      const reorderedItems = [
        ...remainingItems.slice(0, to - 1),
        movedItem,
        ...remainingItems.slice(to - 1)
      ];
      // iterate new order list.
      reorderedItems.forEach((item, i) => {
        db.fotomongo.findAndModify({
          query: { _id: mongojs.ObjectId(item._id) },
          // update order to new list index.
          update: { $set: { 'order': i + 1 } },
          new: false
        },
          (err, task) => {
            if (err) throw err;
          }
        );
      });
      return res.end();
    });
    return res.json({from, to});
  }

  save (req, res) {

    let id = req.body._id;
    let obj = {};

    // save action.
    function doSave (id, obj) {
      // add description
      if (req.body.description) {
        obj.description = req.body.description;
      }
      // create or update
      if (!id) {
        db.fotomongo.count({}, (err, count) => {
          obj.order = (count + 1).toString();
          db.fotomongo.insert( obj, (err, dbres) => {
            if (err) throw err;
            return res.end();
          });
        });
      } else {
        db.fotomongo.count({}, (err, count) => {
          obj.order = (count + 1).toString();
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
        });
      }
    }
    // add file
    if (req.file) {
      let date = new Date();
      obj.image = `${date.getTime()}_${req.file.originalname.replace(' ', '-')}`;
      fs.rename(
        path.join(req.file.destination, req.file.filename),
        path.join(req.file.destination, obj.image),
        fsErr => {
          if (fsErr) throw(fsErr);
          // if not description save now.
          if (!req.body.description) doSave(id, obj);
        }
      );
    }
    // if have description save now.
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