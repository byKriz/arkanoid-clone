const canvas = document.querySelector('canvas');

// Contexto 1 - 2D
const ctx = canvas.getContext('2d');

// Recuperando los Spites
const $paddle = document.querySelector('#paddle');
const $bricks = document.querySelector('#bricks');

// Ajustando las dimensiones
canvas.width = 448
canvas.height = 400

// Variables del juego
let counter = 0;

// Variables de la Bola
const ballRadius = 3;

// Posicion de la Bola en el canvas
let ballPositionX = canvas.width / 2;
let ballPositionY = canvas.height - 30;

// Velocidad de la bola
let ballDirectionX = 1;
let ballDirectionY = -1;

// Variables de la barra
const paddleHeight = 10;
const paddleWidth = 50;

let paddlePositionX = (canvas.width - paddleWidth) / 2;
const paddlePositionY = canvas.height - paddleHeight - 15;

let rightPressed = false;
let leftPressed = false;

const PADDLE_SENSITIVITY = 4;

// Variables de los ladrillos
const brickRowsCount = 6;
const brickColumnsCount = 13;
const brickWidth = 32;
const brickHeight = 16;
const brickPadding = 0;
const brickOffsetTop = 80;
const brickOffsetLeft = 16;
const bricks = []

const BRICK_STATUS = Object.freeze({
    ACTIVE: 1,
    DESTROYED: 0
})

for (let column = 0; column < brickColumnsCount; column++) {
    bricks[column] = [];
    for (let row = 0; row < brickRowsCount; row++) {
        // calculos de la posicion del ladrillo
        const brickPositionX = column * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickPositionY = row * (brickHeight + brickPadding) + brickOffsetTop;

        // asignando ladrillos aleatorios
        const random = Math.floor(Math.random() * 8);

        // guardando la informacion de los ladrillos
        bricks[column][row] = {
            x: brickPositionX,
            y: brickPositionY,
            status: BRICK_STATUS.ACTIVE,
            color: random
        };
    }
}

console.log(bricks);





function drawBall() {
    ctx.beginPath();
    ctx.arc(ballPositionX, ballPositionY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}
function drawPaddle() {
    // ctx.fillStyle = '#09f';
    // ctx.fillRect(paddlePositionX, paddlePositionY, paddleWidth, paddleHeight)

    ctx.drawImage(
        $paddle,
        29,
        174,
        paddleWidth,
        paddleHeight,
        paddlePositionX,
        paddlePositionY,
        paddleWidth,
        paddleHeight,
    )

}

function drawBricks() {
    for (let column = 0; column < brickColumnsCount; column++) {
        for (let row = 0; row < brickRowsCount; row++) {
            // console.log({column, row});
            const currentBrick = bricks[column][row];
            // console.log(currentBrick.status);
            if (currentBrick.status === BRICK_STATUS.DESTROYED) continue;

            ctx.fillStyle = 'yellow';
            ctx.rect(
                currentBrick.brickPositionX,
                currentBrick.brickPositionY,
                brickWidth,
                brickHeight,
            )
            ctx.fill();

            //     const clipX = currentBrick.color * 32;
            //     ctx.drawImage(
            //         $bricks,
            //         clipX,
            //         0,
            //         brickWidth,
            //         brickHeight,
            //         currentBrick.brickPositionX,
            //         currentBrick.brickPositionY,
            //         brickWidth,
            //         brickHeight
            //     )
        }
    }
}

function collisionDetection() { }

function ballMovement() {
    // colision con las paredes

    // Paredes laterales
    if (ballPositionX + ballDirectionX > canvas.width - ballRadius || ballPositionX + ballDirectionX < 0) {
        ballDirectionX = -ballDirectionX
    }

    // Techo
    if (ballPositionY + ballDirectionY < 0) {
        ballDirectionY = -ballDirectionY
    }

    // La pelota toca la barra
    const isBallSameXasPaddle =
        ballPositionX > paddlePositionX && ballPositionX < paddlePositionX + paddleWidth

    const isBallTouchingPaddle =
        ballPositionY + ballDirectionY > paddlePositionY

    if (isBallSameXasPaddle && isBallTouchingPaddle) {
        ballDirectionY = -ballDirectionY
    }

    // La pelota cae
    else if (ballPositionY + ballDirectionY > canvas.height - ballRadius) {
        console.log('Game Over');
        document.location.reload()
    }

    ballPositionX += ballDirectionX
    ballPositionY += ballDirectionY
}
function paddleMovement() {
    if (rightPressed && paddlePositionX < canvas.width - paddleWidth) {
        paddlePositionX += PADDLE_SENSITIVITY
    } else if (leftPressed && paddlePositionX > 0) {
        paddlePositionX -= PADDLE_SENSITIVITY
    }
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function initEvents() {
    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key === "Right" || key === "ArrowRight") {
            rightPressed = true
        } else if (key === "Left" || key === "ArrowLeft") {
            leftPressed = true
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key === "Right" || key === "ArrowRight") {
            rightPressed = false
        } else if (key === "Left" || key === "ArrowLeft") {
            leftPressed = false
        }
    }
}


// Loop Infinito para el repintado del canvas (recursividad?)
function draw() {
    // console.log({ rightPressed, leftPressed });
    cleanCanvas();

    // Elementos que se dibujan por pantalla
    drawBall()
    drawPaddle()
    drawBricks()

    collisionDetection()
    ballMovement()
    paddleMovement()

    // Colisiones y Movimientos

    // Aqui se activa el refresco de pantalla para el repintado del canvas
    window.requestAnimationFrame(draw); // esto causa la recursividad
}
draw();
initEvents();
