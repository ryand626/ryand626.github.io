// game.js
// Modified by Ryan Dougherty
// Last updated 2/25/2014

// Global Variables
var canvas;
var ctx;
var img;

// Initialization
function run () {
	//prepare canvas variables
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');

	//prepare images
	img = new Image();
	img.src = 'assets/duckhunt.png';

	draw();
}

function draw () {
	img.onload = function () {
		drawBackground();

		drawDuck(100,200);
		drawDuck(200,200);
		drawDuck(300,200);
		drawDuck(400,200);
		drawDuck(500,200);
		
		drawForeground();
		drawDog();
	}
}

function drawForeground () {
	// grass & road
	ctx.drawImage(img,0,718,900,182,0,418,900,182);
}

function drawBackground () {
	// sky
	ctx.fillStyle = "#87CEEB";
	ctx.fillRect(0,0,600,800);

	// tree
	ctx.drawImage(img, 0,274,75,121,300,400,75,121);
}

function drawDog () {
	ctx.drawImage(img,5,3,53,40,400,550,53,40);
}

function drawDuck (x, y) {
	ctx.drawImage(img, 43,158,29,29,x,y,29,29);
}