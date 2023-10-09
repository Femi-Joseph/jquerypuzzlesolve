$(document).ready(function () {
  var row = 3,
    column = 3;
  var pieces = '';
  var pieces1 = '';
  var pieces2 = '';

  var dragId,
    dropname = '';
  var chkStatus = 0;
  var findSrc = '';
  var top, left;
  var questionCount = $('.question').length;
  //Load all Local storage images
  function allStorage() {
    var archive = [];
    for (var i = 0; i < localStorage.length; i++) {
      //archive[i] = localStorage.getItem(localStorage.key(i));
      createDiv();
      addElements();
      questionCount += 1;
      document.querySelector(`#q${questionCount}`).src = localStorage.getItem(
        localStorage.key(i)
      );
      $(`#q${questionCount}`).css(
        { width: ' 150px' },
        { height: '150px' },
        { border: ' 1 px solid black' },
        { margin: '10px' },
        { padding: '10px' }
      );
    }
  }
  allStorage();

  //Hide Continue Button
  $('#btnNewgame').hide();
  //Popup INitialization
  const popup = document.querySelector('.popup');
  const closeBtn = document.querySelector('.close-btn');
  //Image Uploading to Local storage
  function createDiv() {
    post = $('<div/>', { class: 'question' }).appendTo('#verticalImages');
  }
  function addElements() {
    img = $('<img/>', { id: `q${questionCount + 1}` }).appendTo(post);
  }
  //Upload Image start
  document.querySelector('#myFile').addEventListener('change', function () {
    console.log(this.files);
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      localStorage.setItem(`img${questionCount + 1}`, reader.result);
      createDiv();
      addElements();
      questionCount += 1;
      document.querySelector(`#q${questionCount}`).src = localStorage.getItem(
        localStorage.key(localStorage.length - 1)
      );
      $(`#q${questionCount}`).css(
        { width: ' 150px' },
        { height: '150px' },
        { border: ' 1 px solid black' },
        { margin: '10px' },
        { padding: '10px' }
      );

      popup.classList.toggle('active');
      location.reload();
    });

    reader.readAsDataURL(this.files[0]);
  });

  //Popup code
  $('#questionUploader').click(function () {
    popup.classList.toggle('active');
    closeBtn.addEventListener('click', () => {
      popup.classList.toggle('active');
    });
  });

  //Creating Div inside Puzzle container to split Image
  for (top = 0, i = 0; i < row; i++, top -= 128) {
    for (j = 0, left = 0; j < column; j++, left -= 128) {
      pieces +=
        `<div  name=${i.toString() + j.toString()} id=${
          i.toString() + j.toString()
        }` +
        ' ' +
        `style='background-position:  ${left}px  ${top}px;'    class='piece'></div>`;
    }
  }

  $('#puzzleContainer').html(pieces);
  //Select Question from vertical images

  $('.question img').click(function () {
    //Previous class assigned removed
    $('#pieceContainer').removeClass('successmsg');
    $('#pieceContainer').removeClass('failmsg');
    var temp = this.src;

    if (temp.length < 75) {
      //Extract filename for loading
      findSrc = temp.slice(-8);

      pieces = '';

      $('.piece').css('background-image', `url(./asset/image/${findSrc})`);
    } else {
      pieces = '';

      //$(".piece").css("background-image", `url(./asset/image/${temp})`);
      $('.piece').css('background-image', `url(${temp})`);
    }
  });

  //Start solving puzzle

  $('#btnStart').click(function () {
    $('.question img').off('click');
    chkStatus = 0;
    //Picture order changing in Piece container
    for (i = 0, x = 2; i < row; i++, x = x - 1) {
      for (j = 0, y = 2; j < column; j++, y = y - 1) {
        $(`#${x.toString()}${y.toString()}`).addClass('dragablePiece');

        $(`#pieceContainer`).append($(`#${x.toString()}${y.toString()}`));
        $('.dragablePiece').draggable();
      }
    }
    //Create Empty Div for droping images
    pieces2 = '';
    for (i = 0; i < row; i++) {
      for (j = 0; j < column; j++) {
        pieces2 += `<div name=${
          i.toString() + j.toString()
        } style='background-image: none;' class='piece dropable'></div>`;
      }
    }

    $('#puzzleContainer').html(pieces2);
    //Droping
    $('.dropable').droppable();
    $('.dropable').droppable({
      drop: function (event, ui) {
        var dragableElement = ui.draggable;

        dragId = ui.draggable.prop('id');

        var droppedOn = $(this);
        dropname = $(this).attr('name');

        droppedOn.addClass('piecePresent');
        $(dragableElement)
          .addClass('droppedPiece')
          .css({
            top: 0,
            left: 0,
            position: 'relative',
          })
          .appendTo(droppedOn);

        if (dragId === dropname) {
          $(this).removeClass('fail');
          $(this).addClass('success');
        } else {
          $(this).removeClass('success');
          $(this).addClass('fail');
        }
      },
    });
  });
  //Button finish to show Game status
  $('#btnFinish').click(function () {
    $('#btnNewgame').show();
    var chkStatus = $('.success').length;

    var chkFail = $('.fail').length;

    if (chkStatus === 9) {
      $('#pieceContainer').empty();
      $('#pieceContainer').addClass('successmsg');
      $('#btnStart').hide();
      $('#btnFinish').hide();
    } else {
      $('#pieceContainer').empty();
      $('#pieceContainer').addClass('failmsg');
      $('#btnStart').hide();
      $('#btnFinish').hide();
    }
  });
  //Continue Game
  $('#btnNewgame').click(function () {
    location.reload();
    $('.question img').on('click');
  });
});
