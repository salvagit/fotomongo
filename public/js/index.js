var Main = {

  init: function () {
    var _this = this;
    this.getImages()
    .then(function (images) {
      document.querySelector('#total').innerHTML = images.length;
      return images.forEach(function (el) {
        _this.renderRow(el);
      });
    })
    .then(function () {
      return _this.bindActions();
    });
  },

  bindActions: function() {
    document.querySelector('#addImage')
    .addEventListener('submit', this.addNewImage );

    document.querySelectorAll('.edit')
    .forEach( function (el) {
      el.addEventListener('click', Main.updateImage )
    });

    document.querySelectorAll('.delete')
    .forEach( function (el) {
      el.addEventListener('click', Main.deleteImage )
    });

    var el = document.getElementById('imageTable');
    var dragger = tableDragger(el, {
      mode: 'row',
      onlyBody: true,
      animation: 300
    });
    dragger.on('drop',function(from, to){
      console(from);
      console(to);
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

  updateImage: function (e) {
    var id = e.target.parentNode.parentNode.dataset.id;

    fetch('./api/images/'+id)
      .then( function (data) { return data.json() })
      .then( function (data) {
        var form = document.querySelector('#addImage');

        idInput = document.createElement('input');
        idInput.type='hidden';
        idInput.name='_id';
        idInput.value=id;
        form.appendChild(idInput);

        form.querySelector('textarea').value = data[0].description;
        // form.querySelector("input[type='file']").value = data.image;
        form.querySelector("input[type='file']").required = data.image;

      })
      .catch( err => console.error(err) );
  },

  refresh() {
    var form = document.querySelector('#addImage');
    var table = document.querySelector('#imageTable');
    var tbody = table.querySelector('tbody');
    var inputHidden = form.querySelector('input[type=hidden]');
    if (inputHidden) form.removeChild(inputHidden);
    form.reset();
    tbody.innerHTML = '';
    Main.init();
  }

};

(function () {
  "use strict";
  Main.init();
})();