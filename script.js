const canvas = document.getElementById("game")
const ctx = canvas.getContext("2d")

const nnCanvas = document.getElementById("nn")
const nnCtx = nnCanvas.getContext("2d")

const tileSize = 20
const tileCount = canvas.width / tileSize

let dx
let dy

let snake


let food
let score
let gameRunning = true

class Node {
    constructor(x, y, g, h, parent = null) {
        this.x = x
        this.y = y
        this.g = g
        this.h = h
        this.f = g + h
        this.parent = parent
    }
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
    if (!snake) return

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
    if (!food) return

    ctx.fillStyle = "red"
    ctx.fillRect(
        food.x * tileSize,
        food.y * tileSize,
        tileSize,
        tileSize
    )
}

function gameLoop() {
    if (!gameRunning || !snake || !food) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    aiDecision()
    moveSnake()
    checkWallCollision()
    checkSelfCollision()
    checkFoodColision()
    drawSnake()
    drawFood()
    drawNeuralNetwork()













}

function moveSnake() {
    if (!snake || snake.length === 0) return

    const head = {
        x: snake[0].x + dx,
        y: snake[0].y + dy
    }

    snake.unshift(head)
    snake.pop()
}

function aiDecision() {
    if (!food || snake.length ===0 || !snake) return

    const head = snake[0]
    const path = aStar(head, food)

    if(path && path.length >1){
        const next = path[1]
        dx = next.x - head.x
        dy = next.y - head.y
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

function gameOver() {
    gameRunning = false

    alert(`Game Over! \n\n Score: ${score}`)
    resetGame()

}

function resetGame() {

    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ]
    food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)

    }

    dx = 1
    dy = 0

    score = 0
    gameRunning = true
    gameLoop()

}

function isOppositeDirection(newDx, newDy) {

    return dx === -newDx && dy === -newDy
}

function heuristic(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2)
}

function isCellBlocked(x, y) {
    if (x < 0 || x >= tileCount || y < 0 || y >= tileCount) {
        return true
    }

    if(!snake || snake.length ===0) return false
    
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true
        }
    }

    return false
}

function aStar(start, goal) {
    const openList = []
    const closedList = []

    openList.push(
        new Node(
            start.x,
            start.y,
            0,
            heuristic(start.x, start.y, goal.x, goal.y)
        )
    )

    while (openList.length > 0) {

        let currentIndex = 0

        for (let i = 1; i < openList.length; i++) {
            if (openList[i].f < openList[currentIndex].f) {
                currentIndex = i
            }
        }

        const current = openList.splice(currentIndex, 1)[0]
        closedList.push(current)

        if (current.x === goal.x && current.y === goal.y) {
            const path = []
            let temp = current
            while (temp) {
                path.push({ x: temp.x, t: temp.y })
                temp = temp.parent
            }
            return path.reverse()
        }

        const neighbords = [
            { x: current.x + 1, y: current.y },
            { x: current.x - 1, y: current.y },
            { x: current.x, y: current.y + 1 },
            { x: current.x, y: current.y - 1 }
        ]

        for (const n of neighbords) {
            if (isCellBlocked(n.x, n.y)) continue

            if (closedList.some(c => c.x === n.x && c.y === n.y)) continue

            const g = current.g + 1
            const h = heuristic(n.x, n.y, goal.x, goal.y)
            const existing = openList.find(o => o.x === n.x && o.y === n.y)

            if (!existing) {
                openList.push(new Node(n.x, n.y, g, h, current))
            } else if(g< existing.g){
                existing.g = g
                existing.f = g+h
                existing.parent = current
            }
        }



    }

    return null


}

setInterval(gameLoop, 200)
ctx.clearRect(0, 0, canvas.width, canvas.height)
resetGame();
setInterval(gameLoop, 200);

