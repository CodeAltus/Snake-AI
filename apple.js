class Apple {
    // Creating the apple object
    constructor() {
        // A list of all possible apple positions is created called boxes
        this.boxes = [];
        for (let i = 0; i < 40; i++) {
            for (let j = 0; j < 20; j++) {
                this.boxes.push(createVector(i, j));
            }
        }
        this.generate([createVector(0, 0), createVector(1, 0), createVector(2, 0)]);
    }

    generate(snake_body) {
        // This function is called when the apple is eaten
        // A list of empty boxes is created by taking boxes
        // and removing position where the snake body is present
        const empty_boxes = this.boxes.filter(function (value) {
            for (let i = 0; i < snake_body.length; i++) {
                if (value.x == snake_body[i].x && value.y == snake_body[i].y) {
                    return false;
                }
            }
            return true;
        });

        // If there are no empty boxes (snake wins!) then false is returned
        // and the program is terminated
        if (empty_boxes.length == 0) {
            return false;
        }

        // Otherwise, a random apple position is created
        const random_position = empty_boxes[int(random(0, empty_boxes.length))];
        this.x = random_position.x;
        this.y = random_position.y;
        return true;
    }

    show() {
        fill(255, 0, 0);
        strokeWeight(0);
        rect(this.x * 30 + 10, this.y * 30, 10, 10);
        rect(this.x * 30, this.y * 30 + 10, 10, 10);
        rect(this.x * 30 + 20, this.y * 30 + 10, 10, 10);
        rect(this.x * 30 + 10, this.y * 30 + 20, 10, 10);
    }
}
