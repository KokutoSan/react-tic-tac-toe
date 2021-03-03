import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const className = props.winner ? 'square square-winner' : 'square';
  return (
    <button
      className={className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function Board(props) {
  function createBoard(props, nbRow, nbCol) {
    const board = [];

    for (let row = 0; row < nbRow; row++) {
      const cols = [];
      for (let col = 0; col < nbCol; col++) {
        const index = (row * nbCol) + col;
        cols.push(renderSquare(props, index));
      }
      board.push(<div key={row} className="board-row">{cols}</div>);
    }

    return board;
  }

  function renderSquare(props, i) {
    const isWinner = props.winnerLine.includes(i);

    return (
      <Square
        key={i}
        winner={isWinner}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  }

  return (
    <div>
      {createBoard(props, 3, 3)}
    </div>
  );
}

function Game(props) {
  const [history, setHistory] = useState([{squares: Array(9).fill(null),
                                    location: null,}]);
  const [stepNumber, setStepNumber] = useState(0);
  const [moveOrder, setMoveOrder] = useState('Ascending');
  const [xIsNext, setXIsNext] = useState(true);

  function handleClick(i) {
    const history_step = history.slice(0, stepNumber + 1);
    const current = history_step[history_step.length - 1];
    const squares = current.squares.slice();
    const location = moveLocation(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(history_step.concat([{
        squares: squares,
        location: location,
      }]));
    setStepNumber(history_step.length);
    setXIsNext(!xIsNext);
  }

  function handleMoveOrder() {
    const order = moveOrder === 'Ascending' ? 'Descending' : 'Ascending';
    setMoveOrder(order);
  }

  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  function moveLocation(i) {
    const col = (i % 3) + 1;
    const row = (i / 3 >> 0) + 1;

    return {col: col, row: row};
  }

  console.log(history);
  const current = history[stepNumber];
  console.log(current);
  const winner = calculateWinner(current.squares);
  const moves = history.map((step, move) => {
    const location = step.location ?
      '(' + step.location.col + ',' + step.location.row +')' :
      '';
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    const className = move === stepNumber ?
      'button-move-selected' :
      '';
    return (
      <li key={move}>
        <button className={className} onClick={() => jumpTo(move)}>{desc} {location}</button>
      </li>
    );
  });

  if ( moveOrder === 'Descending' ) {
    moves.reverse();
  }

  let status;
  let winnerLine = [];

  if (winner) {
    status = 'Winner: ' + winner.square;
    winnerLine = winner.line;
  } else if (stepNumber >= 9) {
    status = 'Draw: no one wins'
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          winnerLine={winnerLine}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div><button onClick={() => handleMoveOrder()}>{moveOrder}</button></div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {square: squares[a], line: lines[i]};
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
