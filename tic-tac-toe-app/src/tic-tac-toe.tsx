import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // 一旦名称のズレには目を瞑る…

/**
 * マス(Square) の Props.
 */
 type SquareProps = {
  value: 'O' | 'X' | null;
  onClick: () => void;
}

/**
 * マス。受け取った Props をそのまま表示するだけ。勝敗のロジックを持たない。
 */
export const Square = (props: SquareProps) => {
  return (
    <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
  )
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

export const Board = (props: BoardProps) => {

  const renderSquare = (index: number) => {
    return <Square value={props.squares[index]} onClick={() => props.onClick(index)} />
  }

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  )
}

type Step = {
  squares: BoardType,
  xIsNext: boolean
}

const Game = () => {
  const [history, setHistory] = useState<Step[]>([{
    squares: Array(9).fill(null),
    xIsNext: true
  }])
  const [xIsNext, setXIsNext] = useState(true)
  const [stepNumber, setStepNumber] = useState(0)
  
  const handleClick = (index: number) => {
    const newHistory = history.slice(0, stepNumber + 1)
    const current = newHistory[newHistory.length - 1]
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[index]) {
      return;
    }
    squares[index] = xIsNext ? "X" : "O";
    setHistory(newHistory.concat([
      {
        squares: squares,
        xIsNext: !xIsNext
      }
    ]))
    setStepNumber(newHistory.length)
    setXIsNext(!xIsNext)
  }

  const jumpTo = (step: number) => {
    setStepNumber(step)
    setXIsNext((step % 2) === 0)
  }

  const current = history[stepNumber]
  const winner = calculateWinner(current.squares)
  const moves = history.map((_, move) => {
    const desc = move ?
      'Go to move #' + move :
      'Go to game start';
    return (
      <li>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    )
  })

  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O')

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={current.squares} onClick={index => handleClick(index)}/>
      </div>
      <div className="game-info">
        <div>{ status }</div>
        <ol>{ moves }</ol>
      </div>
    </div>
  )
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

export default Game