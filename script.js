

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;

//tucnak
let tucnakWidth = 88;
let tucnakHeight = 100;
let tucnakX = 50;
let tucnakY = boardHeight - tucnakHeight;
let tucnakImg;

let tucnak = {
    x : tucnakX,
    y : tucnakY,
    width : tucnakWidth,
    height : tucnakHeight
}

//ledovec
let ledovecArray = [];

let ledovec1Width = 37;
let ledovec2Width = 70;
let ledovec3Width = 110;

let ledovecHeight = 70;
let ledovecX = 700;
let ledovecY = boardHeight - ledovecHeight;

let ledovec1Img;
let ledovec2Img;
let ledovec3Img;

//physics
let velocityX = -8; //ledovec moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial tucnaksaur
    // context.fillStyle="green";
    // context.fillRect(tucnak.x, tucnak.y, tucnak.width, tucnak.height);

    tucnakImg = new Image();
    tucnakImg.src = "./img/tucnak.png";
    tucnakImg.onload = function() {
        context.drawImage(tucnakImg, tucnak.x, tucnak.y, tucnak.width, tucnak.height);
    }

    ledovec1Img = new Image();
    ledovec1Img.src = "./img/ledovec1.png";

    ledovec2Img = new Image();
    ledovec2Img.src = "./img/ledovec2.png";

    ledovec3Img = new Image();
    ledovec3Img.src = "./img/ledovec3.png";

    requestAnimationFrame(update);
    setInterval(placeledovec, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", movetucnak);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //tucnak
    velocityY += gravity;
    tucnak.y = Math.min(tucnak.y + velocityY, tucnakY); //apply gravity to current tucnak.y, making sure it doesn't exceed the ground
    context.drawImage(tucnakImg, tucnak.x, tucnak.y, tucnak.width, tucnak.height);

    //ledovec
    for (let i = 0; i < ledovecArray.length; i++) {
        let ledovec = ledovecArray[i];
        ledovec.x += velocityX;
        context.drawImage(ledovec.img, ledovec.x, ledovec.y, ledovec.width, ledovec.height);

        if (detectCollision(tucnak, ledovec)) {
            gameOver = true;
            tucnakImg.src = "./img/tucnakdead.png";
            tucnakImg.onload = function() {
                context.drawImage(tucnakImg, tucnak.x, tucnak.y, tucnak.width, tucnak.height);
            }
        }
    }

    //score
    context.fillStyle="black";
    context.font="20px courier";
    score++;
    context.fillText(score, 5, 20);
}

function movetucnak(e) {
    if (gameOver) {
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && tucnak.y == tucnakY) {
        //jump
        velocityY = -10;
    }
    else if (e.code == "ArrowDown" && tucnak.y == tucnakY) {
        //duck
    }

}

function placeledovec() {
    if (gameOver) {
        return;
    }

    //place ledovec
    let ledovec = {
        img : null,
        x : ledovecX,
        y : ledovecY,
        width : null,
        height: ledovecHeight
    }

    let placeledovecChance = Math.random(); //0 - 0.9999...

    if (placeledovecChance > .90) { //10% you get ledovec3
        ledovec.img = ledovec3Img;
        ledovec.width = ledovec3Width;
        ledovecArray.push(ledovec);
    }
    else if (placeledovecChance > .70) { //30% you get ledovec2
        ledovec.img = ledovec2Img;
        ledovec.width = ledovec2Width;
        ledovecArray.push(ledovec);
    }
    else if (placeledovecChance > .50) { //50% you get ledovec1
        ledovec.img = ledovec1Img;
        ledovec.width = ledovec1Width;
        ledovecArray.push(ledovec);
    }

    if (ledovecArray.length > 5) {
        ledovecArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}