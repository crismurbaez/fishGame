// BUGS
//cuando se cambia el tamano de la pantalla no se registra la posición del mouse correctamente

//canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '50px Georgia';
let gameSpeed = 1;


//mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
console.log(canvasPosition);

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
    console.log(mouse.x, mouse.y);
})
canvas.addEventListener('mouseup', function () {
    mouse.click = false;
})

//player
const playerLeft = new Image();
playerLeft.src = 'fish_swim_left.png';
const playerRight = new Image();
playerRight.src = 'fish_swim_right.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.framex = 0;
        this.framey = 0;
        this.frame = 0;
        this.spriteWidth = 498;
        this.spriteHeight = 327;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        let theta = Math.atan2(dy, dx)
        this.angle = theta;
        if (mouse.x != this.x) {
            this.x -= dx / 15;
        }
        if (mouse.y != this.y) {
            this.y -= dy / 15;
        }
    }
    draw() {
        if (mouse.click) {
            ctx.lineWidth = 0.2;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radius, 10);

        ctx.save()
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle)
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.framex * this.spriteWidth, this.framey * this.spriteHeight,
                this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45,
                this.spriteWidth / 4, this.spriteHeight / 4)
        } else {
            ctx.drawImage(playerRight, this.framex * this.spriteWidth, this.framey * this.spriteHeight,
                this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 45,
                this.spriteWidth / 4, this.spriteHeight / 4)
        }
        ctx.restore();

    }
}
const player = new Player();


//bubles
const bubblesArray = [];
const bubbleImage = new Image();
bubbleImage.src = 'bubble.png'
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
    }
    draw() {
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(bubbleImage, this.x - 65, this.y - 65, this.radius * 2.6, this.radius * 2.6)
    }
}

const bubblePop1 = document.createElement('audio');
bubblePop1.src = 'bubble1.mp3'
const bubblePop2 = document.createElement('audio');
bubblePop2.src = 'bubble3.mp3'

function handleBubbles() {
    if (gameFrame % 50 == 0) {  //funciona en los marcos 50, 100, 150, 200
        bubblesArray.push(new Bubble());
        console.log(bubblesArray.length)
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update();
        bubblesArray[i].draw();

        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
            bubblesArray.splice(i, 1);
            i--;
        } else if (bubblesArray[i]) {
            if (bubblesArray[i]?.distance < bubblesArray[i]?.radius + player.radius) {
                (console.log('collision'));
                if (!bubblesArray[i].counted) {
                    if (bubblesArray[i].sound == 'sound1') {
                        bubblePop1.play();
                        console.log('sound1')
                    } else {
                        bubblePop2.play();
                        console.log('sound2')
                    }
                    score++;
                    bubblesArray[i].counted = true;
                    bubblesArray.splice(i, 1);
                    i--;
                }

            }
        }

    }
}

//Repeating Backgrounds
const background = new Image();
background.src = 'background1.png';

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height,
}

function handleBackground() {
    BG.x1 -= gameSpeed;
    if (BG.x1 < -BG.width) BG.x1 = BG.width;
    BG.x2 -= gameSpeed;
    if (BG.x2 < -BG.width) BG.x2 = BG.width;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}

//animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    handleBubbles();
    player.update();
    player.draw();
    ctx.fillStyle = 'black';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
})