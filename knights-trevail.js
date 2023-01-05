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

        createKnightsTrevails(board);

        return board;

        function createKnightsTrevails (board) {
            let length = 0;
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

            board.forEach((element, index) => {
                ++length;
            });

            board.forEach((row, yIndex) => {
                row.forEach((square, xIndex) => {
                    
                    console.log(square);
                });
            });
        }

        function createSquare (x, y) {
            return {
                x,
                y,
                visted: false
            };
        }

    }

    return {
        createBoard
    }
})();

// INIT

Board.createBoard(8);