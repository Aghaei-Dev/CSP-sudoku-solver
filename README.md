# 🧠 Sudoku Solver with CSP, MRV & LCV Heuristics

A JavaScript-based Sudoku solver using Constraint Satisfaction Problem (CSP) techniques. It supports optional heuristics like **Minimum Remaining Values (MRV)** and **Least Constraining Value (LCV)** to improve performance. the **Degree** heuristic isnt work here because we have a graph with degree 3 for all nodes. means all cells are equal

---

## 🧩 Features

- Solves both **9×9** and **16×16** Sudoku puzzles
- Optional support for:
  - **MRV (Minimum Remaining Values)** heuristic
  - **LCV (Least Constraining Value)** heuristic
- Uses **backtracking** and **forward checking**
- Tracks and displays **opened states** for space complexity insight and time complexity
- Provides readable output with `console.table()`

---

## 🚀 How to Run

Make sure you have **Node.js** installed.

```bash
node app.js
```

## 🛠️ Configuration

In `app.js`, you can change the heuristics like so:

```js
solveSudokuCSP(board, useMRV = false, useLCV = true)
```
> useMRV: Set to true to enable MRV (Minimum Remaining Values) heuristic.

> useLCV: Set to true to enable LCV (Least Constraining Value) heuristic.

## 🧠 Algorithm Details
- CSP (Constraint Satisfaction Problem): Assigns values to variables (cells) such that constraints (Sudoku rules) are satisfied.

- MRV (Minimum Remaining Values): Selects the variable with the fewest legal values.

- LCV (Least Constraining Value): Chooses the value that rules out the fewest options for neighboring variables.

## 👤 Author
### Aghaei-Dev
