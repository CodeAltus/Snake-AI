class Snake {
    // Creating the snake object
    constructor() {
        this.body = [];
        // The snake starts with a length of 3 from the top-left corner
        // Max length for the snake is 800 pixels --> perfection!
        for (let i = 0; i < 3; i++) {
            this.body[i] = createVector(i, 0);
        }
        this.x_dir = 1;
        this.y_dir = 0;
        this.path = [];
        this.tail_position = this.getTailPosition();
    }

    // Updating the snake position
    update(apple) {
        // The path is refreshed using A* if the head reached the previous tail position
        // or when the snake's length reached 600 pixels out of 800 pixels
        if ((this.getHeadPosition().x == this.tail_position.x && this.getHeadPosition().y == this.tail_position.y) || this.body.length > 600) {
            this.tail_position = createVector(0, 0);
            this.tail_position.x = this.getTailPosition().x;
            this.tail_position.y = this.getTailPosition().y;
            search.getPath();
        }

        // The direction of the snake set using the path generated from A*
        for (let i = 0; i < this.path.length; i++) {
            let head = this.getHeadPosition();
            if (head.x == this.path[i].x && head.y == this.path[i].y) {
                let next_head = this.path[i + 1];
                if (next_head.x - head.x == 1) {
                    this.right();
                } else if (next_head.x - head.x == -1) {
                    this.left();
                } else if (next_head.y - head.y == 1) {
                    this.down();
                } else if (next_head.y - head.y == -1) {
                    this.up();
                } else {
                    console.log("Something is wrong");
                    noLoop();
                }
            }
        }

        // Collision with wall logic
        if (this.getHeadPosition().x == 39 && this.x_dir == 1) {
            noLoop();
            console.log("Collision with wall");
        } else if (this.getHeadPosition().x == 0 && this.x_dir == -1) {
            noLoop();
            console.log("Collision with wall");
        } else if (this.getHeadPosition().y == 19 && this.y_dir == 1) {
            noLoop();
            console.log("Collision with wall");
        } else if (this.getHeadPosition().y == 0 && this.y_dir == -1) {
            noLoop();
            console.log("Collision with wall");
        } else {
            // Collision logic with the snake body
            for (let i = 0; i < this.body.length - 1; i += 1) {
                if (this.getHeadPosition().x == this.body[i].x && this.getHeadPosition().y - this.body[i].y == 1 && this.y_dir == -1) {
                    noLoop();
                    console.log("Collision with body");
                } else if (this.getHeadPosition().x == this.body[i].x && this.getHeadPosition().y - this.body[i].y == -1 && this.y_dir == 1) {
                    noLoop();
                    console.log("Collision with body");
                } else if (this.getHeadPosition().y == this.body[i].y && this.getHeadPosition().x - this.body[i].x == 1 && this.x_dir == -1) {
                    noLoop();
                    console.log("Collision with body");
                } else if (this.getHeadPosition().y == this.body[i].y && this.getHeadPosition().x - this.body[i].x == -1 && this.x_dir == 1) {
                    noLoop();
                    console.log("Collision with body");
                }
            }

            // The snake body is elongated at its head using the direction
            this.body.push(createVector(this.getHeadPosition().x + this.x_dir, this.getHeadPosition().y + this.y_dir));

            // A new apple position is generated when the snake is about
            // to eat the apple
            if (
                (this.getHeadPosition().x == apple.x && this.getHeadPosition().y - apple.y == 0 && this.y_dir == -1) ||
                (this.getHeadPosition().x == apple.x && this.getHeadPosition().y - apple.y == 0 && this.y_dir == 1) ||
                (this.getHeadPosition().y == apple.y && this.getHeadPosition().x - apple.x == 0 && this.x_dir == -1) ||
                (this.getHeadPosition().y == apple.y && this.getHeadPosition().x - apple.x == 0 && this.x_dir == 1)
            ) {
                if (!apple.generate(this.body)){
                    snake.show();
                    noLoop();
                }
            }
            // If apple is not eaten then the snake tail is cut
            // to keep the same snake length
            else {
                this.body.splice(0, 1);
            }
        }
    }

    getHeadPosition() {
        return this.body[this.body.length - 1];
    }

    getTailPosition() {
        return this.body[0];
    }

    // Direction is changed
    changeDirection(x_dir, y_dir) {
        if (!(abs(this.x_dir - x_dir) == 2 || abs(this.y_dir - y_dir) == 2)) {
            this.x_dir = x_dir;
            this.y_dir = y_dir;
        }
    }

    // Direction functions
    up() {
        this.changeDirection(0, -1);
    }

    down() {
        this.changeDirection(0, 1);
    }

    left() {
        this.changeDirection(-1, 0);
    }

    right() {
        this.changeDirection(1, 0);
    }

    show() {
        fill(0, 164, 239);
        strokeWeight(0);
        rect(this.body[0].x * 30, this.body[0].y * 30, 30, 30);
        stroke(51);
        strokeWeight(2);
        let backToggle = -1;
        let frontToggle = 1;
        // This looks quite overwhelming but basically lines are drawn where
        // boxes do not have a common border
        // This draws an outline around the snake which has the same colour as the background
        // This makes the snake look nice
        for (let i = 0; i < this.body.length; i++) {
            strokeWeight(0);
            rect(this.body[i].x * 30, this.body[i].y * 30, 30, 30);
            stroke(51);
            strokeWeight(2);
            if (i == 0) {
                backToggle = 1;
            } else {
                backToggle = -1;
            }
            if (i == this.body.length - 1) {
                frontToggle = -1;
            } else {
                frontToggle = 1;
            }
            if (!(this.body[i].x == this.body[i + backToggle].x && this.body[i].y - this.body[i + backToggle].y == 1)) {
                if (!(this.body[i].x == this.body[i + frontToggle].x && this.body[i].y - this.body[i + frontToggle].y == 1)) {
                    line(this.body[i].x * 30, this.body[i].y * 30, this.body[i].x * 30 + 30, this.body[i].y * 30);
                }
            }
            if (!(this.body[i].x == this.body[i + backToggle].x && this.body[i].y - this.body[i + backToggle].y == -1)) {
                if (!(this.body[i].x == this.body[i + frontToggle].x && this.body[i].y - this.body[i + frontToggle].y == -1)) {
                    line(this.body[i].x * 30, this.body[i].y * 30 + 30, this.body[i].x * 30 + 30, this.body[i].y * 30 + 30);
                }
            }
            if (!(this.body[i].y == this.body[i + backToggle].y && this.body[i].x - this.body[i + backToggle].x == -1)) {
                if (!(this.body[i].y == this.body[i + frontToggle].y && this.body[i].x - this.body[i + frontToggle].x == -1)) {
                    line(this.body[i].x * 30 + 30, this.body[i].y * 30, this.body[i].x * 30 + 30, this.body[i].y * 30 + 30);
                }
            }
            if (!(this.body[i].y == this.body[i + backToggle].y && this.body[i].x - this.body[i + backToggle].x == 1)) {
                if (!(this.body[i].y == this.body[i + frontToggle].y && this.body[i].x - this.body[i + frontToggle].x == 1)) {
                    line(this.body[i].x * 30, this.body[i].y * 30, this.body[i].x * 30, this.body[i].y * 30 + 30);
                }
            }
        }
    }
}
