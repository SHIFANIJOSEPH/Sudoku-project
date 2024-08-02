document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const generateBtn = document.getElementById('generate');
    const solveBtn = document.getElementById('solve');
    const clearBtn = document.getElementById('clear');
    const checkBtn = document.getElementById('check');
    const difficultySelect = document.getElementById('difficulty');

    const SIZE = 9;
    let board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    let solution = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));

    function createGrid() {
        for (let i = 0; i < SIZE; i++) {
            for (let j = 0; j < SIZE; j++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.addEventListener('input', () => {
                    const value = parseInt(input.value);
                    if (isNaN(value) || value < 1 || value > 9) {
                        input.value = '';
                        board[i][j] = 0;
                    } else {
                        board[i][j] = value;
                    }
                });
                cell.appendChild(input);
                grid.appendChild(cell);
            }
        }
    }

    function clearGrid() {
        const cells = document.querySelectorAll('.cell input');
        cells.forEach(cell => {
            cell.value = '';
            cell.disabled = false;
            cell.parentElement.classList.remove('error');
        });
        board = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
    }

    function setGrid(puzzle) {
        const cells = document.querySelectorAll('.cell input');
        cells.forEach((cell, index) => {
            const row = Math.floor(index / SIZE);
            const col = index % SIZE;
            if (puzzle[row][col] !== 0) {
                cell.value = puzzle[row][col];
                cell.disabled = true;
            } else {
                cell.value = '';
                cell.disabled = false;
            }
            cell.parentElement.classList.remove('error');
        });
    }

    function isValid(board, row, col, num) {
        for (let x = 0; x < SIZE; x++) {
            if (board[row][x] === num || board[x][col] === num || 
                board[3 * Math.floor(row / 3) + Math.floor(x / 3)][3 * Math.floor(col / 3) + x % 3] === num) {
                return false;
            }
        }
        return true;
    }

    function solve(board) {
        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                if (board[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(board, row, col, num)) {
                            board[row][col] = num;
                            if (solve(board)) {
                                return true;
                            }
                            board[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function removeCells(board, count) {
        while (count > 0) {
            const row = Math.floor(Math.random() * SIZE);
            const col = Math.floor(Math.random() * SIZE);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                count--;
            }
        }
    }

    function generatePuzzle(difficulty) {
        let puzzle = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
        solve(puzzle);
        solution = puzzle.map(row => row.slice()); // Store the solution
        let count;
        switch (difficulty) {
            case 'easy':
                count = 20;
                break;
            case 'medium':
                count = 40;
                break;
            case 'hard':
                count = 60;
                break;
            default:
                count = 20;
        }
        removeCells(puzzle, count);
        setGrid(puzzle);
        board = puzzle;
    }

    function updateBoardFromInputs() {
        const inputs = document.querySelectorAll('.cell input');
        inputs.forEach((input, index) => {
            const row = Math.floor(index / SIZE);
            const col = index % SIZE;
            board[row][col] = parseInt(input.value) || 0;
        });
    }

    function validateSolution() {
        updateBoardFromInputs();
        const cells = document.querySelectorAll('.cell input');
        let hasErrors = false;

        cells.forEach(cell => cell.parentElement.classList.remove('error'));

        for (let row = 0; row < SIZE; row++) {
            for (let col = 0; col < SIZE; col++) {
                const value = board[row][col];
                if (value !== solution[row][col]) {
                    hasErrors = true;
                    cells[row * SIZE + col].parentElement.classList.add('error');
                }
            }
        }

        if (hasErrors) {
            console.log("Validation failed. Errors in the following cells:");
            cells.forEach((cell, index) => {
                if (cell.parentElement.classList.contains('error')) {
                    const row = Math.floor(index / SIZE);
                    const col = index % SIZE;
                    console.log(`Cell (${row}, ${col}): ${board[row][col]}`);
                }
            });
        } else {
            console.log("Validation successful!");
        }

        return !hasErrors;
    }

    generateBtn.addEventListener('click', () => {
        const difficulty = difficultySelect.value;
        generatePuzzle(difficulty);
    });

    solveBtn.addEventListener('click', () => {
        solve(board);
        setGrid(board);
    });

    clearBtn.addEventListener('click', clearGrid);

    checkBtn.addEventListener('click', () => {
        const isValid = validateSolution();
        if (isValid) {
            alert('The Sudoku solution is correct!');
        } else {
            alert('The Sudoku solution is incorrect. Please check your inputs.');
        }
    });

    createGrid();
});
