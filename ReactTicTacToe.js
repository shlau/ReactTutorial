function Square(props) {
  let divStyle;
  let isWinner;
  const winningSet = props.winningSet
  props.currInd === props.lastClicked ?
  divStyle = {border: 'solid'} : divStyle = {border: ''}
  if(winningSet) {
    isWinner = winningSet.includes(props.currInd);
    isWinner ? divStyle = {border:'solid',borderColor:'blue'} : divStyle = {border: ''};
  }
  return (
    <button className="square" onClick={props.onClick} style={divStyle}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key = {i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        currInd={i}
        lastClicked = {this.props.lastClicked}
        winningSet = {this.props.winningSet}
      />
    );
  }
  
  createBoard = () => {
    let grid = [];
    for(i = 0; i < 3;i++) {
      let row = [];
      for(j = 0; j < 3; j++) {
        row.push(this.renderSquare(i*3+j))
      }
      grid.push(<div key={i} className="board-row">{row}</div>)
    }
    return grid
  }

  render() {
    return (
      <div>
        {this.createBoard()}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastClicked: -1
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      reversed: false,
      winningSet: [-1,-1,-1]
    };
  }

  handleClick(i) {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];
    let squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          lastClicked: i
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }
  handleOrderClick() {
    this.setState({reversed: !this.state.reversed})
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    let moves = history.map((step, move) => {
      const row = Math.floor(step.lastClicked/3)
      const col = step.lastClicked - row*3
      const desc = move ?
        'Go to move #' + move + '(' + row  + ',' + col + ')':
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });
    if(this.state.reversed) {
      moves = moves.reverse();
    }
    let status;
  
    if (winner) {
      status = "Winner: " + current.squares[winner[0]];
    }
    else if(current.squares.length === 9 && !current.squares.includes(null)) {
      status = "Draw";
    }else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
            lastClicked={current.lastClicked}
            winningSet = {winner}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
        <div>
        <button onClick={() => this.handleOrderClick()}>Change order</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
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
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

      return lines[i];
    }
  }
  return null;
}
