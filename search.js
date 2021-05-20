// This is the A* pathfinding algorithm
// This works by finding the longest possible path between
// the snake's head and the snake's tail
// The snake will never get trapped because the snake's head
// will always have a way out after reaching the previous tail position
// Apple will be eaten when the snake is on the path

class Node {
    // This is the Node class used in the algorithm
    // Each position on the game board is given a node
    // Each Node has a parent and f, g and h values
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.parent = null;
        this.f = 0;
        this.g = 0;
        this.h = 0;
    }

    // To check if node positions are equal
    equals(other) {
        return this.x == other.x && this.y == other.y;
    }
}

class Search {
    constructor(snake, apple) {
        this.snake = snake;
        this.apple = apple;
    }

    // A maze array is created where:
    // snake head position: 1
    // snake tail position: 2
    // remaining snake body: -1
    // empty positions (including apple position): 0
    // we need to go from 1 to 2 while avoiding -1
    refreshMaze() {
        let maze = [];
        for (let i = 0; i < 20; i++) {
            let row = [];
            for (let j = 0; j < 40; j++) {
                row.push(0);
            }
            maze.push(row);
        }
        for (let i = 0; i < snake.body.length; i++) {
            maze[this.snake.body[i].y][this.snake.body[i].x] = -1;
        }
        const head_position = this.snake.getHeadPosition();
        const tail_position = this.snake.getTailPosition();
        maze[head_position.y][head_position.x] = 1;
        maze[tail_position.y][tail_position.x] = 2;
        return maze;
    }

    // Maze is created, start and end positions are found and astar search is performed
    getPath() {
        let maze = this.refreshMaze();
        let start, end;
        for (let i = 0; i < 40; i++) {
            for (let j = 0; j < 20; j++) {
                if (maze[j][i] == 1) {
                    start = { x: i, y: j };
                } else if (maze[j][i] == 2) {
                    end = { x: i, y: j };
                }
            }
        }
        let node_path = this.astar(maze, start, end);
        // Nodes are converted to p5.js vectors
        let vector_path = [];
        for (let i = 0; i < node_path.length; i++) {
            vector_path.push(createVector(node_path[i].x, node_path[i].y));
        }
        this.snake.path = vector_path;
    }

    // The main A* pathfinding algorithm
    // References: https://en.wikipedia.org/wiki/A*_search_algorithm
    // and https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2
    // g value is given by the distance from the start_node to current node
    // h value is given by the Manhattan distance between current node and end_node
    astar(maze, start, end) {
        let start_node = new Node(start.x, start.y);
        let end_node = new Node(end.x, end.y);
        let open_list = [];
        let closed_list = [];
        open_list.push(start_node);
        let possible_paths = [];
        const adjacent_squares = [
            [0, -1],
            [0, 1],
            [-1, 0],
            [1, 0],
        ];

        while (open_list.length > 0) {

            let current_node = open_list[0];
            let current_index = 0;
            let index = 0;

            for (let i = 0; i < open_list.length; i++) {
                if (open_list[i].f > current_node.f) {
                    current_node = open_list[i];
                    current_index = index;
                }
                index++;
            }

            open_list.splice(current_index, 1);
            closed_list.push(current_node);
            if (current_node.equals(end_node)) {
                let path = [];
                let current = current_node;
                while (current != null) {
                    path.push(current);
                    current = current.parent;
                }
                possible_paths.push(path.reverse());
            }

            let children = [];
            for (let i = 0; i < adjacent_squares.length; i++) {
                let node_position = [current_node.x + adjacent_squares[i][0], current_node.y + adjacent_squares[i][1]];
                if (node_position[0] <= 39 && node_position[0] >= 0) {
                    if (node_position[1] <= 19 && node_position[1] >= 0) {
                        if (maze[node_position[1]][node_position[0]] != -1) {
                            let new_node = new Node(node_position[0], node_position[1]);
                            children.push(new_node);
                        }
                    }
                }
            }

            for (let i = 0; i < children.length; i++) {
                let if_in_closed_list = false;
                for (let j = 0; j < closed_list.length; j++) {
                    if (children[i].equals(closed_list[j])) {
                        if_in_closed_list = true;
                    }
                }
                if (!if_in_closed_list) {
                    children[i].g = current_node.g + 2;
                    children[i].h = abs(children[i].x - end_node.x) + abs(children[i].y - end_node.y);
                    children[i].f = children[i].g + children[i].h;
                    let present = false;
                    for (let j = 0; j < open_list.length; j++) {
                        if (children[i].equals(open_list[j]) && children[i].g < open_list[j].g) {
                            present = true;
                        } else if (children[i].equals(open_list[j]) && children[i].g >= open_list[j].g) {
                            open_list[j] = children[i];
                            open_list[j].parent = current_node;
                        }
                    }
                    if (!present) {
                        children[i].parent = current_node;
                        open_list.push(children[i]);
                    }
                }
            }
        }
        let path = [];
        for (let i = 0; i < possible_paths.length; i++) {
            if (possible_paths[i].length > path.length) {
                path = possible_paths[i];
            }
        }
        return path;
    }
}
