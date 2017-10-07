(function() {
    const directions = [
        { up: 87, down: 83, left: 65, right: 68 },
        { up: 38, down: 40, left: 37, right: 39 }
    ];

    function Snake(x, y, elements, id) {
        this.id = id;
        this.body = [... new Array(elements)].map(() => ({ x: x, y: y }));
        this.direction = directions[id].up;
    }
    Snake.prototype.move = function(dir) {
        if(this.body.length > 1) {
            this.body.unshift(this.body.splice(this.body.length-1, 1)[0]);
            this.body[0].x = this.body[1].x;
            this.body[0].y = this.body[1].y;
        }

        let invalid = true;
        while(invalid) {
            switch(dir) {
                case directions[this.id].up:
                    if(this.direction !== directions[this.id].down) {
                        this.body[0].y--;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case directions[this.id].down:
                    if(this.direction !== directions[this.id].up) {
                        this.body[0].y++;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case directions[this.id].left:
                    if(this.direction !== directions[this.id].right) {
                        this.body[0].x--;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case directions[this.id].right:
                    if(this.direction !== directions[this.id].left) {
                        this.body[0].x++;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                default:
                    dir = this.direction;
                    break;
            }
        }
    };
    Snake.prototype.grow = function() {
        this.body.push({
            x: this.body[this.body.length-1].x,
            y: this.body[this.body.length-1].y
        });
    };
    Snake.prototype.getHead = function() {
        return this.body[0];
    };
    Snake.prototype.collide = function(obj) {
        return this.getHead().x === obj.x && this.getHead().y === obj.y;
    };
    Snake.prototype.isDead = function() {
        // Snake bites own body
        for(let i = 1; i < this.body.length; i++){
            if(this.collide(this.body[i])) return true;
        }
        return false
    };

    function Game(cols, rows) {
        this.config = {
            board: { cols: cols, rows: rows },
            colors: { bg: '#6F6', snake: ['#69F', '#f83885'], food:'#F33' },
            initSnakeSize: 5,
            cellsize: 20,
            tickrate: 175
        };
        // Initialize key handler
        this.keyHandler = [];
        for(let i = 0; i < directions.length; i++) {
            this.keyHandler.push({
                key: directions[i].up,
                enabled: true
            });
        }
        this.points = 0;
        this.snakes = this.getSnakes(directions.length);
        this.food = null;
        this.spawnFood();
        // HTML elements
        this.canvas = document.getElementById('cvs');
        this.ctx = this.canvas.getContext('2d');
        this.score = document.getElementById('score');
        // Interval number of the game-loop-interval
        this.intervalNr = null;
    }
    Game.prototype.getSnakes = function(count) {
        const distance = 2;
        let snakes = [];
        while(snakes.length < count) {
            let snake = new Snake(
                Math.floor(Math.random() * (this.config.board.cols - 2 * distance) + distance), 
                Math.floor(Math.random() * (this.config.board.cols - 2 * distance) + distance), 
                this.config.initSnakeSize,
                snakes.length
            );
            if(snakes.length !== 0) {
                let invalid = false;
                snakes.forEach(e => {
                    if(Math.abs(snake.getHead().x - e.getHead().x) < distance || Math.abs(snake.getHead().y - e.getHead().y) < distance)
                        invalid = true;
                });
                if(invalid) continue;
            }
            snakes.push(snake);
        }
        return snakes;
    };
    Game.prototype.spawnFood = function() {
        this.food = {
            x: Math.floor(Math.random() * this.config.board.cols),
            y: Math.floor(Math.random() * this.config.board.rows)
        };
        this.snakes.forEach(snake => {
            snake.body.forEach(e => { 
                if(e.x === this.food.x && e.y === this.food.y) this.spawnFood(); 
            });
        });
    };
    Game.prototype.isGameOver = function() {
        // Snake bites border
        for(let i = 0; i < this.snakes.length; i++) {
            if(this.snakes[i].getHead().x < 0 || this.snakes[i].getHead().y < 0) return true;
            if(this.snakes[i].getHead().x >= this.config.board.cols || this.snakes[i].getHead().y >= this.config.board.rows) return true;
        }
        // Snake bites other snakes
        for(let i = 0; i < this.snakes.length; i++) {
            for(let j = 0; j < this.snakes.length; j++) {
                if(i !== j)
                    if(this.snakes[i].body.filter(e => this.snakes[j].collide(e)).length)
                        return true;
            }
            if(this.snakes[i].isDead()) return true; // Snake bites himself
        }
    }
    Game.prototype.processKeys = function(key) {
        for(let i = 0; i < directions.length; i++) {
            switch(key) {
                case directions[i].up:
                    if(this.keyHandler[i].enabled && this.keyHandler[i].key !== key) {
                        this.keyHandler[i].key = key;
                        this.keyHandler[i].enabled = false;
                    }
                    break;
                case directions[i].down:
                    if(this.keyHandler[i].enabled && this.keyHandler[i].key !== key) {
                        this.keyHandler[i].key = key;
                        this.keyHandler[i].enabled = false;
                    }
                    break;
                case directions[i].left:
                    if(this.keyHandler[i].enabled && this.keyHandler[i].key !== key) {
                        this.keyHandler[i].key = key;
                        this.keyHandler[i].enabled = false;
                    }
                    break;
                case directions[i].right:
                    if(this.keyHandler[i].enabled && this.keyHandler[i].key !== key) {
                        this.keyHandler[i].key = key;
                        this.keyHandler[i].enabled = false;
                    }
                    break;
            }
        }
    };
    Game.prototype.render = function() {
        // Scale canvas
        this.canvas.width = this.config.board.cols * this.config.cellsize;
        this.canvas.height = this.config.board.rows * this.config.cellsize;
        // Fill background
        this.ctx.fillStyle = this.config.colors.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw snake
        for(let i = 0; i < this.snakes.length; i++) {
            this.ctx.fillStyle = this.config.colors.snake[i];
            this.snakes[i].body.forEach(e => 
                this.ctx.fillRect(e.x * this.config.cellsize, e.y * this.config.cellsize, this.config.cellsize, this.config.cellsize)
            );
        }
        // Draw food
        this.ctx.fillStyle = this.config.colors.food;
        this.ctx.fillRect(this.food.x * this.config.cellsize, this.food.y * this.config.cellsize, this.config.cellsize, this.config.cellsize);
        // Refresh score
        score.innerHTML = this.points;
    };
    Game.prototype.loop = function() {
        for(let i = 0; i < this.snakes.length; i++) {
            this.snakes[i].move(this.keyHandler[i].key);
        }
        if(!this.isGameOver()) {
            for(let i = 0; i < this.snakes.length; i++) {
                if(this.snakes[i].collide(this.food)) {
                    this.snakes[i].grow();
                    this.points++;
                    this.spawnFood();
                }
                this.keyHandler[i].enabled = true;
            }
            this.render();
        }
        else {
            clearInterval(this.intervalNr);
            alert(`You lost!\nScore: ${ this.points }`);
        }
    };

    const game = new Game(20, 20);
    addEventListener('keydown', e => game.processKeys(e.keyCode));
    game.intervalNr = setInterval(() => game.loop(), game.config.tickrate);
})();