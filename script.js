const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const nnCanvas = document.getElementById("nn")
const nnCtx = nnCanvas.getContext("2d")

const tileSize = 20
const tileCount = canvas.width / tileSize

let dx = 0
let dy = 0

let score =0
let gameRunning = true

let snake = [
    { x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }
]

let food = {
    x: 15, y: 10

}

function drawGrid() {
    ctx.strokeStyle = "#222"
    for (let i = 0; i < tileCount; i++) {
        ctx.beginPath()
        ctx.moveTo(i * tileSize, 0)
        ctx.lineTo(i * tileSize, canvas.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(0, i * tileSize)
        ctx.lineTo(canvas.width, i * tileSize)
        ctx.stroke()
    }
}

function drawSnake() {
    ctx.fillStyle = "lime"
    snake.forEach(part => {
        ctx.fillRect(
            part.x * tileSize,
            part.y * tileSize,
            tileSize,
            tileSize
        )
    })
}

function drawFood() {
    ctx.fillStyle = "red"
    ctx.fillRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize,
        tileSize
    )
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    aiDecision()
    moveSnake()

    checkFoodColision()
    checkSelfCollision()
    checkWallCollision()

    drawSnake()
    drawFood()
    drawNeuralNetwork()


}

function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    }

    snake.unshift(head)
    snake.pop()
}

function aiDecision() {
    const head = snake[0]

    if (food.x > head.x) {
        dx = 1
        dy = 0
    } else if (food.x < head.x) {
        dx = -1
        dy = 0
    } else if (food.y > head.y) {
        dx = 0
        dy = 1
    } else if (food.y < head.y) {
        dx = 0
        dy = -1
    }
}

function drawNeuralNetwork() {
    nnCtx.clearRect(0, 0, nnCanvas.width, nnCanvas.height)

    const inputs = [
        food.x - snake[0].x,
        food.y - snake[0].y
    ]

    const outputs = {
        left: inputs[0] < 0 ? Math.abs(inputs[0]) : 0,
        right: inputs[0] > 0 ? inputs[0] : 0,
        up: inputs[0] < 0 ? Math.abs(inputs[1]) : 0,
        down: inputs[0] > 0 ? inputs[1] : 0
    }

    nnCtx.fillStyle = "cyan"
    nnCtx.fillText("Input X: " + inputs[0], 20, 40)
    nnCtx.fillText("Input Y: " + inputs[1], 20, 70)

    nnCtx.fillStyle = "yellow"
    let y = 40
    for (let key in outputs) {
        nnCtx.fillText(`%{key}: ${outputs[key]}`, 220, y)
        y += 30
    }


    nnCtx.strokeStyle = "#444"
    nnCtx.beginPath()
    nnCtx.moveTo(100, 50)
    nnCtx.lineTo(200, 50)
    nnCtx.moveTo(100, 80)
    nnCtx.lineTo(200, 110)
    nnCtx.stroke()


}

function checkFoodColision() {
    const head = snake[0]

    if (head.x === food.x && head.y === food.y) {
        score++
        spawnFood()
        growSnake()
    }
}

function growSnake() { //Laele

    const tail = snake[snake.length - 1]
    snake.push({ x: tail.x, y: tail.y })
}

function spawnFood() {
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)

    }
}

function checkSelfCollision() {
    const head = snake[0]
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver()
        }
    }
}

function checkWallCollision() {
    const head = snake[0]

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver()
    }
}

function gameOver(){
    gameRunning = false

    alert(`Game Over! \n\n Score: ${score}`)
}



setInterval(gameLoop, 200)
drawGrid()
ctx.clearRect(0, 0, canvas.width, canvas.height)
drawSnake()
drawFood()

