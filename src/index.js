import React from 'react';
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

class Board extends React.Component {
  createBoard(nbRow, nbCol) {
    const board = [];

    for (let row = 0; row < nbRow; row++) {
      const cols = [];
      for (let col = 0; col < nbCol; col++) {
        const index = (row * nbCol) + col;
        cols.push(this.renderSquare(index));
      }
      board.push(<div key={row} className="board-row">{cols}</div>);
    }

    return board;
  }

  renderSquare(i) {
    let isWinner = false;

    for (let index = 0; index < this.props.winnerLine.length && isWinner === false; index++) {
      if (this.props.winnerLine[index] === i) {
        isWinner = true;
      }
    }

    return (
      <Square
        key={i}
        winner={isWinner}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        {this.createBoard(3, 3)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: null,
      }],
      stepNumber: 0,
      moveOrder: 'Ascending',
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = this.moveLocation(i);

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleMoveOrder() {
    const order = this.state.moveOrder === 'Ascending' ? 'Descending' : 'Ascending';
    this.setState({
      moveOrder: order,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  moveLocation(i) {
    const col = (i % 3) + 1;
    const row = (i / 3 >> 0) + 1;

    return {col: col, row: row};
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const stepNumber = this.state.stepNumber;
    const moveOrder = this.state.moveOrder;
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
          <button className={className} onClick={() => this.jumpTo(move)}>{desc} {location}</button>
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
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerLine={winnerLine}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div><button onClick={() => this.handleMoveOrder()}>{moveOrder}</button></div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
