var Main = {

  init: function () {
    var _this = this;
    this.getImages()
    .then(function (images) {
      return images.forEach(function (el) {
        _this.renderRow(el);
      });
    })
    .then(function () {
      _this.bindActions();
    });
  },

  bindActions: function() {
    document.querySelector('#addImage')
    .addEventListener('submit', this.addNewImage );

    document.querySelectorAll('.delete')
    .forEach( function (el) {
      el.addEventListener('click', Main.deleteImage )
    });
  },

  addNewImage: function(e) {
    e.preventDefault();

    $.ajax({
      url: "./api/images",
      type: "PUT",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData:false,
      success: function(data) {
        Main.refresh();
      }
    });

  },

  renderRow: function(data) {
    var table = document.querySelector('#imageTable');
    var tbody = table.querySelector('tbody');
    var tpl = document.querySelector('#rowTpl').cloneNode(true);

    tpl.content.querySelector('tr').dataset.id = data._id;
    tpl.content.querySelector('img').src = './images/uploads/' + data.image;
    tpl.content.querySelector('p').innerHTML = data.description;
    
    tbody.appendChild(tpl.content);
  },

  getImages: function () {
    return new Promise ( function (resolve, reject) {
      fetch('./api/images')
        .then( function (data) { return data.json() })
        .then( function (data) { resolve(data) })
        .catch( err => reject(err) );
    });
  },

  deleteImage: function (e) {
    var id = e.target.parentNode.parentNode.dataset.id;

    $.ajax({
      url: "./api/images/"+id,
      type: "DELETE",
      contentType: false,
      cache: false,
      processData:false,
      success: function(data) {
        Main.refresh();
      }
    });
  },

  refresh() {
    var table = document.querySelector('#imageTable');
    var tbody = table.querySelector('tbody');
    tbody.innerHTML = '';
    Main.init();
  }

};

(function () {
  "use strict";
  Main.init();
})();