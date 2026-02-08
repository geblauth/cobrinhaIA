const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const tileSize = 20
const tileCount = canvas.width / tileSize

let dx = 1
let dy = 0

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


    moveSnake()
    drawSnake()
    drawFood()
}

function moveSnake() {
    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    }

    snake.unshift(head)
    snake.pop()
}

setInterval(gameLoop,200)
drawGrid()
ctx.clearRect(0, 0, canvas.width, canvas.height)
drawSnake()
drawFood()

