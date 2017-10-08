(function() {
    const direction = { up: 87, down: 83, left: 65, right: 68 };

    function Snake(x, y, elements) {
        this.body = [... new Array(elements)].map(() => ({ x: x, y: y }));
        this.direction = direction.up;
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
                case direction.up:
                    if(this.direction !== direction.down) {
                        this.body[0].y--;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case direction.down:
                    if(this.direction !== direction.up) {
                        this.body[0].y++;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case direction.left:
                    if(this.direction !== direction.right) {
                        this.body[0].x--;
                        this.direction = dir;
                        invalid = false;
                    } else { dir = this.direction; }
                    break;
                case direction.right:
                    if(this.direction !== direction.left) {
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
    Snake.prototype.isDead = function(board) {
        // Snake bites own body
        for(let i = 1; i < this.body.length; i++){
            if(this.getHead().x === this.body[i].x && this.getHead().y === this.body[i].y)
                return true;
        }
        //Snake bites border
        if(this.getHead().x < 0 || this.getHead().y < 0) return true;
        if(this.getHead().x >= board.cols || this.getHead().y >= board.rows) return true;
        // Otherwise snake is alive ;)
        return false
    };
    Snake.prototype.getHead = function() {
        return this.body[0];
    }

    function Game(cols, rows) {
        this.config = {
            board: { cols: cols, rows: rows },
            colors: { bg: '#6F6', snake: '#69F', food:'#F33' },
            initSnakeSize: 5,
            cellsize: 20,
            tickrate: 175
        };
        this.keyHandler = {
            key: direction.up,
            enabled: true,
        };
        this.points = 0;
        this.snake = new Snake(Math.round(this.config.board.cols/2), Math.round(this.config.board.rows/2), this.config.initSnakeSize);
        this.food = null;
        this.spawnFood();
        // HTML elements
        this.canvas = document.getElementById('cvs');
        this.ctx = this.canvas.getContext('2d');
        this.score = document.getElementById('score');
        // Interval number of the game-loop-interval
        this.intervalNr = null;
    }
    Game.prototype.spawnFood = function() {
        this.food = {
            x: Math.floor(Math.random() * this.config.board.cols),
            y: Math.floor(Math.random() * this.config.board.rows)
        };
        const collisions = this.snake.body.filter((e) => e.x === this.food.x && e.y === this.food.y);
        if(collisions.length) this.spawnFood();
    };
    Game.prototype.render = function() {
        // Scale canvas
        this.canvas.width = this.config.board.cols * this.config.cellsize;
        this.canvas.height = this.config.board.rows * this.config.cellsize;
        // Fill background
        this.ctx.fillStyle = this.config.colors.bg;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // Draw snake
        this.ctx.fillStyle = this.config.colors.snake;
        this.snake.body.forEach((e) => 
            this.ctx.fillRect(e.x * this.config.cellsize, e.y * this.config.cellsize, this.config.cellsize, this.config.cellsize)
        );
        // Draw food
        this.ctx.fillStyle = this.config.colors.food;
        this.ctx.fillRect(this.food.x * this.config.cellsize, this.food.y * this.config.cellsize, this.config.cellsize, this.config.cellsize);
        // Refresh score
        score.innerHTML = this.points;
    };
    Game.prototype.loop = function() {
        this.snake.move(this.keyHandler.key);
        if(!this.snake.isDead(this.config.board)) {
            if(this.snake.getHead().x === this.food.x && this.snake.getHead().y === this.food.y) {
                this.snake.grow();
                this.points++;
                this.spawnFood();
            }
            this.render();
            this.keyHandler.enabled = true;
        }
        else {
            clearInterval(this.intervalNr);
            alert(`You lost!\nScore: ${this.points}`);
        }
    };

    const game = new Game(20, 20);
    addEventListener('keydown', (e) => {
        if(game.keyHandler.enabled && e.keyCode !== game.keyHandler.key) {
            game.keyHandler.key = e.keyCode;
            game.keyHandler.enabled = false;
        }
    });
    game.intervalNr = setInterval(() => game.loop(), game.config.tickrate);
})();