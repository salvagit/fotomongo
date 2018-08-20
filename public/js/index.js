var Main = {

  init: function () {
    var _this = this;
    this.getImages()
    .then(function (images) {
      images.forEach(function (el) {
        _this.renderRow(el);
      });
    });
  },

  renderRow: function(data) {
    var table = document.querySelector('#imageTable');
    var tbody = table.querySelector('tbody');
    var tpl = document.querySelector('#rowTpl');

    tpl.dataset.id = data._id;
    tpl.content.querySelector('img').src = data.image;
    tpl.content.querySelector('p').innerHTML = data.description;
    
    tbody.appendChild(tpl.content);
  },

  getImages: function () {
    return new Promise ( function (resolve, reject) {
      fetch('./api/getImages')
        .then( function (data) { return data.json() })
        .then( function (data) { resolve(data) })
        .catch( err => reject(err) );
    });
  }

};

(function () {
  "use strict";
  Main.init();
})();