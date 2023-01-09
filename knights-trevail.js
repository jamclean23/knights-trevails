// Knight's Trevail project for Odin

// Module for chess board

const Board = (function () {

    function createBoard (length) {
        // create an array of length*length squares
        // make a loop to account for columns, loop length times
        // within, make a loop to account for rows loop length times
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
                ancestry: [],
                visited: false
            };
        }

    }

    function findRoute(currentX, currentY, destinationX, destinationY, board) {
        console.log('Source: ' + currentX + '-'+ currentY + ',' + '\nDestination: ' + destinationX + '-' + destinationY);

        let origin = findSquare(currentX, currentY, board);
        let destination = findSquare(destinationX, destinationY, board);
        if (typeof origin === 'object' && typeof destination === 'object') {
            return breadthSearch(origin, destination);
        }

        return 'Not Found';
        
        // Bread-first search of origin's children for destination


        function breadthSearch (origin, destination ) {
            let queue = [];
            queue.push(origin);
            let found = false;
            let counter = 0;
            let result = 'Not found';

            while (queue.length && found === false && counter < 1000) {
                counter++;

                // Dequeue parent
                let current = queue.shift();
                current.ancestry.push(current);

                // Check if found
                if (current === destination) {
                    result = current;
                    found = true;
                }
                
                // Enqueue children
                if (current.visited === false) {
                    current.links.forEach((link) => {
                        if (link.visited === false) {
                            link.ancestry = [...current.ancestry];
                            queue.push(link);
                        }

                    });
                }
                current.visited = true;
            }
            return result.ancestry;
        }

        function findSquare(x, y, board) {
            let result = 'Not found';
            board.forEach((row, yIndex) => {
                row.forEach((square, xIndex) => {
                    if (square.x === x && square.y === y) {
                        result = square;
                    }
                });
            });
            return result;

        }
    }

    return {
        createBoard,
        findRoute
    }
})();



// INIT

let newBoard = Board.createBoard(8);

// HTML CSS GENERATION

updateLines();
getUserInput(0, 0, 5, 5, newBoard);
const button = document.querySelector('.inputContainer button');
button.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input');

    getUserInput(+inputs[0].value, +inputs[1].value, +inputs[2].value, +inputs[3].value, newBoard);
    // getUserInput(0, 0, 5, 5, newBoard);

});
console.log('---\nBOARD:');
console.log(newBoard);

// FUNCTIONS FOR HTML GENERATION

function getUserInput (originX = 0, originY = 0, destinationX = 5, destinationY = 5, newBoard) {
    newBoard.forEach((row, yIndex) => {
        row.forEach((square, xIndex) => {
            square.visited = false;
            square.ancestry = [];
        })
    });
    console.clear();
    let route = Board.findRoute(originX, originY, destinationX, destinationY, newBoard);
    let result = '---\nShortest Path Found: ' + (route.length - 1) + ' moves\nMOVES:' + route.reduce((string, element) => {
        return string += ' [' + element.x + ',' + element.y + '] '
        }, '');
    console.log(result);
    updateCircles(route);

    function updateCircles (route) {
        // Clear old circles
        const circles = document.querySelectorAll('.board > div');
        circles.forEach((circle) => {
            circle.classList.remove('start');
            circle.classList.remove('route');
            circle.classList.remove('finish');
        });

        // Add classes to route circles
        route.forEach((square, index) => {
            if (index === 0){
                square.divSquare.classList.add('start');
            } else if (index === route.length - 1) {
                square.divSquare.classList.add('finish');
            } else {
                square.divSquare.classList.add('route');
            }
        });
    }
}

function updateLines () {

    const divs = document.querySelectorAll('.square');


    // Set Board size in css
    const root = document.querySelector(':root');
    root.style.setProperty('--boardSize', newBoard.length);
    
    // Find coordinates of squares and update
    newBoard.reverse().forEach((row, yIndex) => {
        row.forEach((square, xIndex) => {
            const board = document.querySelector('.board');
            let div = document.createElement('div');
            div.classList.add('square');
            div.x = square.x;
            div.y = square.y;
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
            square.divSquare = div;
            square.divSquare.position = div.getBoundingClientRect();
    
        });
    });

    // Remove any existing svgs
    let svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
        svg.remove();
    });

    // Create Svgs
    newBoard.forEach((row, yIndex) => {
        row.forEach((parentSquare, xIndex) => {
            const html = document.querySelector('html');
            parentSquare.links.forEach((link, index) => {
    
                divs.forEach((linkSquareDiv) => {
                    if (linkSquareDiv.x == link.x && linkSquareDiv.y == link.y) {
                        link.divSquare = linkSquareDiv;
                        
                    }
                });
        
                let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                svg.style.position = 'fixed';
    
                let line = document.createElementNS('http://www.w3.org/2000/svg','line');
                line.setAttribute('style', 'stroke:rgba(255,255,0,.3);stroke-width:4');
    
                html.appendChild(svg);
                svg.appendChild(line);
    
                // find the distance between parent node and linked node and set as width of svg
                let xDistance = Math.abs(parentSquare.divSquare.position.left - link.divSquare.position.left);
                svg.setAttribute('width', xDistance);
                let yDistance = Math.abs(parentSquare.divSquare.position.top - link.divSquare.position.top);
                svg.setAttribute('height', yDistance);
    
                // align to the correct node and draw line
                svg.style.position = 'fixed';
    
                let startingX;
                let startingY;
                let endingX;
                let endingY;
    
                // x axis
                if (parentSquare.divSquare.position.left < link.divSquare.position.left) {
                    startingX = 0;
                    endingX = xDistance;
                    svg.style.left = parentSquare.divSquare.position.left + parentSquare.divSquare.position.width/2;
                } else {
                    startingX = xDistance;
                    endingX = 0
                    svg.style.left = parentSquare.divSquare.position.left + parentSquare.divSquare.position.width/2 - xDistance;
                }
    
                //y axis
                if (parentSquare.divSquare.position.top < link.divSquare.position.top) {
                    startingY = 0;
                    endingY = yDistance;
                    svg.style.top = parentSquare.divSquare.position.top + parentSquare.divSquare.position.height/2;
                } else {
                    startingY = yDistance;
                    endingY = 0;
                    svg.style.top = parentSquare.divSquare.position.top + parentSquare.divSquare.position.height/2 - yDistance;  
                }
    
                line.setAttribute('x1', startingX);
                line.setAttribute('y1', startingY);
                line.setAttribute('y2', endingY);
                line.setAttribute('x2', endingX);
    
    
            });
        });
    });
}
