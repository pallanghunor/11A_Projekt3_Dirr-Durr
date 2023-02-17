const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
var gameStart = false;

let slide = 1;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const squareWidth = 1000;
const squareHeight = 600;
const squareX = centerX - (squareWidth / 2);
const squareY = centerY - (squareHeight / 2);

const buttonWidth = 300;
const buttonHeight = 150;
const buttonX = centerX - (buttonWidth / 2);
const buttonY = centerY - (buttonHeight / 2);

let buttonColor = 'green';

if (gameStart === false) {
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('click', handleClick);

  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.fillStyle = 'rgb(128,128,128)';
  ctx.fillRect(squareX, squareY, squareWidth, squareHeight);

  drawButton();
}

function drawButton() {
  ctx.fillStyle = buttonColor;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.shadowBlur = 5;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

  ctx.fillStyle = 'white';
  ctx.font = 'bold 70px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '10px';
  ctx.fillText('Start', centerX, centerY);
}

function handleMouseMove(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  if (x >= buttonX && x < buttonX + buttonWidth && y >= buttonY && y < buttonY + buttonHeight) {
    buttonColor = 'darkgreen';
    canvas.style.cursor = 'pointer';

  } else {
    buttonColor = 'green';
    canvas.style.cursor = 'default';
  }
  drawButton();
}

function handleClick(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;
  if (x >= buttonX && x < buttonX + buttonWidth && y >= buttonY && y < buttonY + buttonHeight) {
    Loading();
  }
}



