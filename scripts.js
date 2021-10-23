const pictureContainer = document.querySelector('.picture-container');
const gridContainer = document.querySelector('.grid-container');
const saveContainer = document.querySelector('.save-container');
const paletteContainer = document.querySelector('.palette-container');
const fillButton = document.querySelector('.fill-button');
const wipeButton = document.querySelector('.wipe-button');
const saveButton = document.querySelector('.save-button');
const loadButton = document.querySelector('.load-button');
const loadPictureButton = document.querySelector('.load-picture-button');
const colorPicker = document.querySelector('.color-picker');
// Creates an array of colors we want to pass into our palette circles
const paletteColors = ['red', 'orange', 'yellow', 'green', 'blue', 'black', 'white'];
let paintColor = '#666666';
const theSaveSquares = [];
let allSquares = [];
console.log(paletteColors)
// OBJECTIVE: create a image element and append it to picture container
const newImage = document.createElement('img');
pictureContainer.appendChild(newImage);

// OBJECTIVE: add event listener to load picture button
loadPictureButton.addEventListener('click', (e) => {
  e.preventDefault();
  getImageFromApi();

});

function makeGrid(height, width) {
  for (let i = 0; i < height; i++) {
    const row = makeRow();
    gridContainer.appendChild(row);
    for (let j = 0; j < width; j++) {
      const square = makeSquare();
      row.appendChild(square);
      square.addEventListener('click', () => {
        square.style.backgroundColor = paintColor;
      })
      square.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        square.style.backgroundColor = '';
      })
    }
  }
}

function makeRow() {
  const row = document.createElement('div');
  row.classList.add('row');

  return row;
}

function makeSquare() {
  const square = document.createElement('div');
  square.classList.add('square');
  allSquares.push(square);
  return square;
}

function fillSquares() {
  fillButton.addEventListener('click', () => {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => (square.style.backgroundColor = paintColor));
  });
}
function wipeSquares() {
  wipeButton.addEventListener('click', () => {
    const allSquares = document.querySelectorAll('.square');
    allSquares.forEach(square => (square.style.backgroundColor = 'white'));
  });
}

// Create a color circle and append to palette container
function createColorCircleAndAppend(colorHex) {
  const colorCircle = document.createElement('div');
  colorCircle.classList.add('circle');
  colorCircle.style.backgroundColor = colorHex;

  paletteContainer.appendChild(colorCircle);
  colorCircle.addEventListener('click', () => {
    paintColor = colorCircle.style.backgroundColor;
  });
}

// Create multiple color palette circles
function createColorPalette() {
  for (let i = 0; i < paletteColors.length; i++) {
    const colorHex = paletteColors[i];

    createColorCircleAndAppend(colorHex);
  }
}

function changeColor() {
  colorPicker.addEventListener('change', () => {
    createColorCircleAndAppend(colorPicker.value)
  });
}

function dragAndDraw() {
  gridContainer.addEventListener('mousedown', () => {
    down = true;
    gridContainer.addEventListener('mouseup', () => {
      down = false;
    });
    gridContainer.addEventListener('mouseover', (e) => {
      if (e.target.className === "square" && down) {
        e.target.style.backgroundColor = paintColor;
      }
    });
  });
}
function saveBtn() {
  saveButton.addEventListener('click', () => {
    const gridArray = [];
    for (let i = 0; i < allSquares.length; i++) {
      const squareColors = allSquares[i];
      gridArray.push(squareColors.style.backgroundColor);
    }

    const gridInfo = {
      grid: gridArray,
    }

    localStorage.setItem('gridSave', JSON.stringify(gridInfo));

  });
}

function loadBtn() {
  loadButton.addEventListener('click', () => {
    const savedGridInfo = JSON.parse(localStorage.getItem('gridSave'));
    for (let i = 0; i < allSquares.length; i++) {
      allSquares[i].style.backgroundColor = savedGridInfo.grid[i];
    }
  });
}
function getImageFromApi() {
  const fetchRequest = fetch('https://dog.ceo/api/breeds/image/random');

  fetchRequest.then((response) => {
    return response.json();
  }).then((data) => {
    console.log(data);
    newImage.src = data.message;
  });
}
function makeSaveSquare() {
  const saveSquare = document.createElement('div');
  saveSquare.classList.add('saveSquare')
  theSaveSquares.push(saveSquare);
  return saveSquare
}
function saveGrid(height, width) {
  for (let i = 0; i < height; i++) {
    const row = makeRow();
    saveContainer.appendChild(row);
    for (let j = 0; j < width; j++) {
      const square = makeSaveSquare();
      row.appendChild(square);
    }
  }
  saveButton.addEventListener('click', () => {
    const savedGridInfo = JSON.parse(localStorage.getItem('gridSave'));
    for (let i = 0; i < theSaveSquares.length; i++) {
      theSaveSquares[i].style.backgroundColor = savedGridInfo.grid[i];
    }
  });
}


function init() {
  makeGrid(10, 10);
  fillSquares();
  createColorPalette();
  wipeSquares();
  dragAndDraw();
  saveBtn();
  loadBtn();
  saveGrid(10, 10);
  changeColor();
}

init();