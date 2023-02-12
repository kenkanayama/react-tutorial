import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  return (
  <button className="square" onClick={props.onClick}>
      {props.value}
  </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}//配列のi番目の要素
        onClick={() => this.props.onClick(i)}
      />
    );
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

class Game extends React.Component {
  //state初期化
  constructor(props) {
    super(props);
    this.state = {
      history: [{squares: Array(9).fill(null),}],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);// state管理している現在のhistoryを取得（すべての入力記録が入っているもの）（2次元配列ぽい構成）
    const current = history[history.length - 1];// 最新のhistoryの配列を取得（{squares: []}）
    const squares = current.squares.slice();// 最新のhistoryの配列を取得（[]）
    console.log("history", history);
    console.log("current", current);
    console.log("squares", squares);
    if (calculateWinner(squares) || squares[i]) {//勝者判定でnullじゃない場合、押下したSquareにすでに値が入っている場合は後続処理を行わない（何も更新するものはない）
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{squares: squares,}]),// state管理のhistoryに新しい配列を追加する（{squares: []}）
      stepNumber: history.length,// 手番を更新する
      xIsNext: !this.state.xIsNext,// bool値を逆にする
    })
    console.log("squares", squares);
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,// 手番を更新する。連動してBoardに渡す配列（どのSquareにnullかX,Oの値を入れるかの配列）が変わるので、ブラウザ上の表示も更新される
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const history = this.state.history;// state管理している現在のhistoryを取得（すべての入力記録が入っているもの）（2次元配列ぽい構成）
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNest ? 'X' : 'O')
    }
    return (
      <div className="game">
        <div className="game-board">
          {this.state.stepNumber}
          <Board
            squares={current.squares}//現在（最新の）の配列内の中身（[]）。各要素と要素数にマッピングされる箇所に値（Squareのprops.value）が入る
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        {this.state.history[this.state.history.length - 1].squares.join(',')}
      </div>
    );
  }
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return squares[a];
    }
  }
  return null;
}