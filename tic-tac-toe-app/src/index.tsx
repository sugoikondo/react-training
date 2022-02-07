import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';

/**
 * マス。受け取った Props をそのまま表示するだけ。勝敗のロジックを持たない。
 */
class Square extends React.Component<SquareProps> {
  render() {
    return (
      <button className="square" onClick={ this.props.onClick }>
        {this.props.value}
      </button>
    );
  }
}

/**
 * マス(Square) の Props.
 */
type SquareProps = {
  value: 'O' | 'X' | null;
  onClick: () => void;
}

type BoardProps = {
  squares: BoardType,
  onClick: (index: number) => void
}

/**
 * ボード。9個のマスを持ち、O or X or null が入る。
 * 縦横斜めのいずれかの値が O or X でそろえば、勝利条件を満たす。
 */
type BoardType = Array<SquareProps['value']>
type BoardState = {
  squares: BoardType,
}

class Board extends React.Component<BoardProps> {
  renderSquare(index: number) {
    return <Square value={this.props.squares[index]} onClick={() => this.props.onClick(index)} />
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type Step = {
  squares: BoardType,
  xIsNext: boolean
}

type GameState = {
  history: Step[]
  xIsNext: boolean,
  stepNumber: number,
}

class Game extends React.Component<{}, GameState> {
  constructor(props: {}) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          xIsNext: true
        }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(index: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    squares[index] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          xIsNext: !this.state.xIsNext
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step: number) {

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={index => this.handleClick(index)}/>
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

// ========================================
function calculateWinner(squares: BoardType) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
