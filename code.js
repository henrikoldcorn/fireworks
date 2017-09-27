var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
canvas.width = window.innerWidth
canvas.height = window.innerHeight


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randSign() {
	a = getRandomInt(1, 2)
	if (a == 1)
		return -1
	else return 1
}

var missiles = []		//moving bits

var GRAVITY = 0.07		//needs testing
function randColour() {
	return colours[getRandInt(0, colours.length-1)]
}
//-------------------------------FIREWORKS--------------------------

//fireworks are moving bit, killed after reaching 100 +- random in range 0-50
	
var firework = function() {
	this.xSpeed = getRandomInt(0, 3) * randSign()
	this.ySpeed = getRandomInt(6, 10) * -1
	this.xPos = getRandomInt((canvas.width/2)-50, (canvas.width/2)+50)
	this.yPos = canvas.height + 10
	this.colour = "#" + getRandomInt(0, 16777215).toString(16)
	this.alive = true
	this.radius = 3
}

firework.prototype.update = function() {
	if (this.alive) {
		this.xPos += this.xSpeed
		this.ySpeed += GRAVITY
		this.yPos += this.ySpeed
		if (Math.abs(this.ySpeed) < (0.2) && (this.alive)) {
			if (getRandomInt(0, 3) == 1) {
				this.alive = false
				this.explode()
			}
		}
	}
	else {
		this.explosion.update()
		}
}

firework.prototype.render = function() {
	if (this.alive) {
		ctx.fillStyle = this.colour
		draw(this)
	}
	else {
		var max = this.explosion.sparkList.length-1
		ctx.fillStyle = this.colour
		for (var k=0; k< max; k++) {
			this.explosion.sparkList[k].render()
		}
	}
}
firework.prototype.explode = function() {
	this.alive = false
	var x = this.xPos
	var y = this.yPos
	var c = this.colour
	this.explosion = new banger(x, y, c)
}

//-------------------------------BANGERS---------------------------
//sparks, used inside bangers
var spark = function(x, y, colour) {
	this.xPos = x
	//console.log(this.xPos)
	this.yPos = y
	this.colour = colour
	this.xSpeed = getRandomInt(0, 6) * randSign() + Math.random()
	this.ySpeed = getRandomInt(0, 6) * randSign() + Math.random()
	this.radius = 3 //getRandomInt(2, 4)
}
spark.prototype.update = function() {
	this.xPos += this.xSpeed
	this.ySpeed += GRAVITY
	this.yPos += this.ySpeed
	if (this.radius >= 0.05)
		this.radius -= 0.05
}
spark.prototype.render = function() {
	draw(this)
}
//bangers inside firework only after firework.explode()
var banger = function(x, y, colour) {
	this.n = getRandomInt(20, 80)
	this.sparkList = new Array(this.n)
	this.colour = colour
	
	for (var i=0; i < this.n-1; i++) { 
		this.sparkList[i] = new spark(x, y, colour)
	}
}
banger.prototype.update = function() {
	var max = this.sparkList.length-1
	for (var l=0; l < max; l++) {
		this.sparkList[l].update()
	}
}
//-----------------------------DRAWING--------------------------

function draw(object) {
	ctx.beginPath()
	ctx.arc(object.xPos, object.yPos, object.radius, 0, 2*Math.PI)
	ctx.fill()
}

//
//-------------------------------MAINLOOP-----------------------
function clearOldItems() {		//removes outdated missiles saving 10 recent ones
	var missilesCopy = []
	var max = missiles.length-1
	for (var i=max-11; i < max; i++) {
		missilesCopy[missilesCopy.length] = missiles[i]
	}
	missiles = missilesCopy
	//ctxconsole.log(missiles)
}


function main() {
	restart += 1
	if (restart == 600) {
		clearOldItems()
		restart = 0
	}
	
	ctx.fillStyle = "white"
	ctx.rect(0, 0, canvas.width, canvas.height)
	ctx.fill()
	ctx.fillStyle = "black"
	ctx.rect(0, 0, canvas.width, canvas.height)
	ctx.fill()
	
	var addNew = getRandomInt(40, 78)		//create new firework?
	if (addNew == 42) {
		missiles[missiles.length] = new firework()
	}
	var max = missiles.length-1
	for (var i=0; i < max; i++) {		//update and draw missiles
		missiles[i].update()
		missiles[i].render()
		}
}

function play() {
	restart = 0
	frameTime = 1000/60
	setInterval(main, frameTime)
}

play()
/*
main()
main()
main()
*/
