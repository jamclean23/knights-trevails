// Knight's Trevail project for Odin

// Module for chess board

const Board = (function () {
    
    function createNode (xValue, yValue, linkedNode) {

    }

    function createBoard (length) {
        // create an array of length*length squares
        // make a loop to account for columns, loop length times
        // within, make a loop to account for rows loop length times
        // 
        let board = [];
        for (let i = 0; i < length; i++) {
            let row = [];
            for (j = 0; j < length; j++) {
                let square = createSquare(j, i);
                row.push(square);
            }
            board.push(row);
        }

        createKnightsTrevails(board, length);

        return board;

        function createKnightsTrevails (board, length) {
            let potentialMoves = [
                {x: -1, y: -2},
                {x: -1, y: 2},
                {x: -2, y: -1},
                {x: -2, y: 1}, 
                {x: 1, y: -2 }, 
                {x: 1, y: 2}, 
                {x: 2, y: -1}, 
                {x: 2, y: 1}
            ];

            board.forEach((row, yIndex) => {
                row.forEach((square, xIndex) => {
                    potentialMoves.forEach((move) => {
                        
                        let potentialMove = validatePotentialMove(xIndex, yIndex, move.x, move.y, length);
                        if (potentialMove.valid === true) {
                            square.links.push(board[potentialMove.y][potentialMove.x]);
                        }


                    });
                });
            });

            function validatePotentialMove (xIndex, yIndex, moveX, moveY, length) {
                if (((xIndex + moveX >= 0) && (xIndex + moveX < length )) && ((yIndex + moveY >= 0) && (yIndex + moveY < length))) {
                    return {
                        x: xIndex + moveX,
                        y: yIndex + moveY,
                        valid: true
                    };
                }
                return {
                    valid: false
                };
            }
        }

        function createSquare (x, y) {
            return {
                x,
                y,
                links: [],
                visted: false
            };
        }

    }

    return {
        createBoard
    }
})();

// INIT

let newBoard = Board.createBoard(8);

console.log(newBoard);

// HTML CSS GENERATION

newBoard.reverse().forEach((row, yIndex) => {
    row.forEach((square, xIndex) => {
        const board = document.querySelector('.board');
        let div = document.createElement('div');
        div.innerText = 'x: ' + square.x + '\ny: ' + square.y;
        if (yIndex % 2 === 0) {
            if (!(xIndex % 2 === 0 )) {
                div.style.color = 'white';
                div.style.backgroundColor = 'black';
            }
        } else {
            if (xIndex % 2 === 0 ){
                div.style.color = 'white';
                div.style.backgroundColor = 'black';
            }
        }
        board.appendChild(div);
        square.position = div.getBoundingClientRect();
        let dot = document.createElement('div');
        dot.style.height = '5px';
        dot.style.width = '5px';
        dot.style.position = 'fixed';
        dot.style.backgroundColor = 'yellow';
        dot.style.left = square.position.left + square.position.width/2 + 'px';
        dot.style.top = square.position.top + square.position.height/2 + 'px';
        

        const html = document.querySelector('html');
        html.appendChild(dot);
        console.log(square.position.left);

    });
});
