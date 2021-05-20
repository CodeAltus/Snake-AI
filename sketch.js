// Creating the snake, apple and A* search algorithm
let snake;
let apple;
let search;

// Setting up everything
function setup() {
    createCanvas(1200, 600);
    snake = new Snake();
    apple = new Apple();
    search = new Search(snake, apple);
    search.getPath();
    frameRate(200);
}

function draw() {
    background(51);
    snake.show();
    apple.show();
    snake.update(apple);
}