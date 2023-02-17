const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;
var gameStart = false;

let slide = 1;
const images = [
  "./img/tutorial/jatekmenet.png",
  "./img/tutorial/tutorial.png",
  "./img/tutorial/fejlesztesek.png"
];

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;

const squareWidth = 1000;
const squareHeight = 600;
const squareX = centerX - (squareWidth / 2);
const squareY = centerY - (squareHeight / 2);

let buttonWidth = 300;
let buttonHeight = 150;
let buttonX = centerX - (buttonWidth / 2);
let buttonY = centerY - (buttonHeight / 2);

let buttonColor = 'green';
let buttonText = 'Start';
fontsize = 70;

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
  ctx.font = `bold ${fontsize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '10px';
  ctx.fillText(buttonText, buttonX + (buttonWidth/2), buttonY + (buttonHeight/2));
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
    slide++;
    if (slide == 2) {
      drawImage(2,);
      buttonWidth = 200;
      buttonHeight = 100; 
      buttonText = "Next";
      fontsize = 50;
      buttonX = centerX + (squareWidth / 2) - buttonWidth - 20;
      buttonY = centerY + (squareHeight / 2) - buttonHeight - 20;
    } else if (slide == 3) {
      drawImage(3);
      buttonWidth = 200;
      buttonHeight = 100; 
      buttonText = "Next";
      fontsize = 50;
      buttonX = centerX + (squareWidth / 2) - buttonWidth - 20;
      buttonY = centerY + (squareHeight / 2) - buttonHeight - 20;
    } else if (slide == 4) {
      drawImage(3);
      buttonWidth = 200;
      buttonHeight = 100; 
      buttonText = "Ready";
      fontsize = 50;
      buttonX = centerX + (squareWidth / 2) - buttonWidth - 20;
      buttonY = centerY + (squareHeight / 2) - buttonHeight - 20;
    }
    if (slide == 5){
      Loading();
    }
  }
}

function drawImage() {
  const image = new Image();
  image.onload = function() {
    ctx.drawImage(image, squareX, squareY, squareWidth, squareHeight);
    drawButton();
  };
  image.src = images[slide-2];
}



