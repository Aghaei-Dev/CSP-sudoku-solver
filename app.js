// How to run ? Just Type `node app.js` in the terminal

function solveSudokuCSP(board, useMRV = false, useLCV = false) {
  const SIZE = board.length // 9 for 9×9 and 16 for 16×16 table
  const BOX_SIZE = Math.sqrt(SIZE) // 3 for 9×9 and 4 for 16×16 table. size of a cube

  let openedStates = 0 // Counter for opened states

  // Check if the board is valid
  function isBoardValid(board) {
    for (let col = 0; col < SIZE; col++) {
      for (let row = 0; row < SIZE; row++) {
        if (board[col][row] > SIZE || board[col][row] < 0 || isNaN(board[row][col])) {
          return false
        }
      }
    }
    return true
  }

  // Check if placing a number is valid
  function isValid(board, row, col, num) {
    // Same Row and Col
    for (let x = 0; x < SIZE; x++) {
      if (board[row][x] === num || board[x][col] === num) {
        return false
      }
    }

    // Box Checker
    const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE // Possible Numbers 0,3,6
    const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE // Possible Numbers 0,3,6
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        if (board[startRow + i][startCol + j] === num) {
          return false
        }
      }
    }
    return true
  }

  // Generate the domains (possible values for each cell).
  function initializeDomains(board) {
    const domains = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => new Set()))

    for (let row = 0; row < SIZE; row++) {
      for (let col = 0; col < SIZE; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= SIZE; num++) {
            if (isValid(board, row, col, num)) {
              domains[row][col].add(num)
            }
          }
        }
      }
    }
    return domains
  }

  // Find the cell to use next
  function selectCell(board, domains) {
    if (useMRV) {
      let minSize = Infinity
      let bestCell = null
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === 0) {
            const domainSize = domains[row][col].size

            if (domainSize < minSize) {
              minSize = domainSize
              bestCell = [row, col]
            }
          }
        }
      }
      return bestCell
    } else {
      // Basic BackTrack find the first empty cell
      for (let row = 0; row < SIZE; row++) {
        for (let col = 0; col < SIZE; col++) {
          if (board[row][col] === 0) {
            return [row, col]
          }
        }
      }
    }
  }

  // Sort the domain values by LCV heuristic
  function sortDomainByLCV(board, domains, row, col) {
    if (!useLCV) return Array.from(domains[row][col])

    const constraints = new Map()
    for (const num of domains[row][col]) {
      let count = 0

      // Check Row And Column
      for (let x = 0; x < SIZE; x++) {
        if (board[row][x] === 0 && domains[row][x].has(num)) count++
        if (board[x][col] === 0 && domains[x][col].has(num)) count++
      }

      // Check Cube
      const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
      const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE
      for (let i = 0; i < BOX_SIZE; i++) {
        for (let j = 0; j < BOX_SIZE; j++) {
          if (board[startRow + i][startCol + j] === 0 && domains[startRow + i][startCol + j].has(num)) count++
        }
      }

      constraints.set(num, count)
    }

    return Array.from(domains[row][col]).sort((a, b) => constraints.get(a) - constraints.get(b))
  }
  // Forward checking: update the domains after placing a number
  function updateDomains(domains, row, col, num) {
    domains[row][col].clear()
    for (let x = 0; x < SIZE; x++) {
      domains[row][x].delete(num)
      domains[x][col].delete(num)
    }

    const startRow = Math.floor(row / BOX_SIZE) * BOX_SIZE
    const startCol = Math.floor(col / BOX_SIZE) * BOX_SIZE
    for (let i = 0; i < BOX_SIZE; i++) {
      for (let j = 0; j < BOX_SIZE; j++) {
        domains[startRow + i][startCol + j].delete(num)
      }
    }
  }

  // Backtracking with CSP
  function backtrack(board, domains) {
    const cell = selectCell(board, domains)

    if (!cell) return true

    const [row, col] = cell
    const candidates = sortDomainByLCV(board, domains, row, col)

    for (const num of candidates) {
      if (isValid(board, row, col, num)) {
        board[row][col] = num

        openedStates++

        const newDomains = domains.map((rowDomains) => rowDomains.map((domain) => new Set(domain)))
        updateDomains(newDomains, row, col, num)

        if (backtrack(board, newDomains)) {
          return true
        }

        board[row][col] = 0
      }
    }

    return false
  }

  // Check table and initialize and solve the board
  if (isBoardValid(board)) {
    const domains = initializeDomains(board)

    if (backtrack(board, domains)) {
      console.log(
        `Solved ${useMRV && useLCV ? 'With MRV & LCV Heuristic' : useLCV ? 'With LCV Heuristic' : useMRV ? 'With MRV Heuristic' : ''}${
          !(useMRV || useLCV) ? 'Without a Heuristic Just Using Backtrack' : ''
        } :`
      )
      console.table(board)
      console.log('Space Complexity (Opened States):', openedStates)
    } else {
      console.log('\x1b[41m', 'No solution exists')
      console.log('Space Complexity (Opened States):', openedStates)
    }
  } else {
    console.log('\x1b[31m', "The Given Board Isn't Valid !")
  }
}

// work with both 9×9 and 16×16 table
const board = [
  [5, 0, 0, 0, 0, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 1, 9],
]
// const board = [
//   [1, 0, 0, 4, 0, 0, 7, 0, 9, 0, 0, 12, 0, 14, 0, 0],
//   [0, 0, 7, 0, 0, 2, 0, 4, 0, 14, 15, 0, 9, 0, 11, 0],
//   [9, 0, 0, 0, 0, 14, 0, 0, 0, 0, 3, 0, 0, 6, 7, 0],
//   [0, 14, 0, 16, 9, 0, 11, 0, 5, 0, 0, 0, 1, 0, 3, 4],
//   [0, 0, 4, 3, 6, 5, 8, 0, 0, 0, 12, 11, 14, 0, 0, 0],
//   [6, 5, 0, 0, 0, 0, 4, 3, 0, 13, 0, 0, 10, 0, 0, 11],
//   [0, 9, 0, 0, 14, 13, 0, 0, 2, 1, 0, 0, 6, 0, 0, 0],
//   [0, 13, 0, 15, 0, 0, 0, 11, 0, 5, 0, 0, 0, 1, 4, 3],
//   [3, 0, 1, 0, 7, 0, 5, 6, 0, 0, 0, 10, 15, 0, 0, 14],
//   [0, 0, 5, 6, 0, 0, 1, 0, 15, 0, 13, 0, 11, 0, 0, 0],
//   [11, 12, 9, 0, 15, 16, 0, 14, 0, 0, 0, 2, 0, 0, 5, 6],
//   [15, 0, 0, 0, 11, 0, 0, 0, 0, 0, 0, 6, 3, 4, 0, 0],
//   [0, 3, 0, 0, 8, 0, 0, 5, 0, 11, 10, 0, 0, 15, 0, 13],
//   [0, 0, 0, 0, 0, 3, 0, 1, 16, 15, 14, 0, 0, 0, 10, 0],
//   [12, 0, 0, 0, 16, 0, 14, 0, 0, 7, 0, 0, 8, 0, 6, 0],
//   [16, 0, 0, 13, 0, 11, 0, 0, 0, 0, 6, 5, 0, 0, 2, 0],
// ]

console.time('Elapsed Time')
console.log('\x1b[7m AI Project: MR.sohofi \x1b[35m Sudoku Solver With CSP And MRV Or LCV Heuristic \x1b[36m Aghaei-Dev \x1b[0m')
console.log('Unsolved:')
console.table(board)
solveSudokuCSP(board, false, true)
console.timeEnd('Elapsed Time')
