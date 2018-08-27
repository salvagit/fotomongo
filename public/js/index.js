var Main = {

  init: function () {
    var _this = this;
    this.bindActions();
    this.getImages()
    .then(function (images) {
      images.forEach(function (el) {
        _this.renderRow(el);
      });
    });
  },

  bindActions: function() {
    var addImageForm = document.querySelector('#addImage');
    addImageForm.addEventListener('submit', this.addNewImage )
  },

  addNewImage: function(e) {
    e.preventDefault();

    $.ajax({
      url: "./api/addNewImage",
      type: "POST",
      data: new FormData(this),
      contentType: false,
      cache: false,
      processData:false,
      success: function(data) {
        console.log(data)
      }
    });

  },

  renderRow: function(data) {
    var table = document.querySelector('#imageTable');
    var tbody = table.querySelector('tbody');
    var tpl = document.querySelector('#rowTpl').cloneNode(true);

    tpl.dataset.id = data._id;
    tpl.content.querySelector('img').src = './images/uploads/' + data.image;
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