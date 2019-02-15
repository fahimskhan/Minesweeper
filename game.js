"use strict"

var numRows = null;
var numCols = null;
var mineCount = null;
var leftEmpty = null;

function printBoard(board) {
  var formatedBoard = board.map(function(row) {
    return row.join(',');
  }).join('\n');
  console.log(formatedBoard);
}

function drawBoard(board, numRows, numCols) {
  var i, j;
  var boardEl = $('#game-board').html('');

  for(i = 0; i < numRows; i++) {
    var rowEl = $('<div class="row"></div>');
    for(j = 0; j < numCols; j++) {
      var cellEl = $(`<div row="${i}" col="${j}" state="${board[i][j]}" class="cell">&nbsp;</div>`);
      cellEl.on('click', function(event) {
        var elRow = parseInt($(this).attr('row'), 10);
        var elCol = parseInt($(this).attr('col'), 10);
        var elState = $(this).attr('state');
        console.log(elRow, elCol, elState);

        //handle clicks
        if (elState === 'B') {
          $('div[state="B"]').addClass('bomb');
          $('#game-over').show();
        } else {
          var bac = bombAdjacencyCount(board, elRow, elCol);
          $(this).text(bac).addClass(`num-${bac}`);
          leftEmpty--;
          if (bac === 0) {
            findNeighbors(board, elRow, elCol);
          }
        }

      })
      rowEl.append(cellEl);
    }
    boardEl.append(rowEl)
  }
}

function placeBomb(board, row, col) {
  board[row][col] = 'B';
}

function shuffle(arr) {
  var i;
  for (i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function outOfBounds(board, row, col) {
  return (row < 0 || col < 0 || row >= board.length || col >= board[row].length);
}

function bombAdjacencyCount(board, row, col) {
  var count = 0;

  for (var i = -1; i < 2; i++) {
    var ri = row+i;
    for (var j = -1; j < 2; j++) {
      var cj = col+j;
      if (!outOfBounds(board, ri, cj) && board[ri][cj] === 'B') {
        count++;
      }
    }
  }

  return count;
}


  function findNeighbors(board, row, col) {

    for (var i = -1; i < 2; i++) {
      var ri = row+i;
      for (var j = -1; j < 2; j++) {
        var cj = col+j;

        if (!outOfBounds(board, ri, cj)) {
          var el = $(`div[row="${ri}"][col="${cj}"]`);
          if (el.text().trim().length !== 0) {
            ;
          } else {
            var bac = bombAdjacencyCount(board, ri, cj);
            el.text(bac).addClass(`num-${bac}`);
            leftEmpty--;
            if (bac === 0) {
              findNeighbors(board, ri, cj);
            }
          }
        }
      }
    }
  }



$(document).ready(function() {
  $("#game-over").hide();
  $('#start-game').on('click', function() {

    var gameBoard = [];
    var coords = [];
    var numRows = parseInt($('#row-size').val(), 10);
    var numCols = parseInt($('#col-size').val(), 10);
    var mineCount = parseInt($('#mine-count').val());
    var leftEmpty = numRows * numCols;

    //create empty board
    for (var i = 0 ; i < numRows; i++) {
      var row = [];
      gameBoard[i] = row;
      for (var j = 0; j < numCols; j++) {
        row[j] = 'X';
        coords.push([i,j]);
      }
    }

    //randomly place bombs
    shuffle(coords);
    for (var i = 0; i < mineCount; i++) {
      placeBomb(gameBoard, coords[i][0], coords[i][1]);
    }

    //handle win










    printBoard(gameBoard);
    drawBoard(gameBoard, numRows, numCols);
  })


})
