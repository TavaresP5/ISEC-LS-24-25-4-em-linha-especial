import React, { useState, useEffect, useRef } from "react";
import { Slot } from "./Slot";
import redToken from '../assets/red token.svg';
import blackToken from '../assets/black token.svg';

export const Board = () => {
  const emptyBoard = Array(6).fill().map(() => Array(7).fill(''));
  const [board, setBoard] = useState(emptyBoard);
  const [currPlayer, setCurrPlayer] = useState('X');
  const [oppPlayer, setOppPlayer] = useState('O');
  const [playerNames, setPlayerNames] = useState({ X: "Player 1", O: "Player 2" });
  const [gameOver, setGameOver] = useState(false);
  const [victories, setVictories] = useState({ X: 0, O: 0 });
  const [playTime, setPlayTime] = useState(0);
  const [vsBot, setVsBot] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [liveTime, setLiveTime] = useState('10.0');
  const lastPlayTimeRef = useRef(Date.now());
  const turnTimeout = useRef(null);
  const [specialCells, setSpecialCells] = useState([]);
  const currPlayerRef = useRef(currPlayer);
  const [notification, setNotification] = useState('');
  const [highlightedColumn, setHighlightedColumn] = useState(null);
  const [animatingPieces, setAnimatingPieces] = useState([]);

  useEffect(() => {
    currPlayerRef.current = currPlayer;
  }, [currPlayer]);

  useEffect(() => {
    if (!vsBot || gameOver) return;
    if (currPlayer === 'X' && animatingPieces.length === 0) {
      startTurnTimer();
    }
  }, [currPlayer, animatingPieces, vsBot, gameOver]);

  useEffect(() => {
    if (vsBot && currPlayer === 'O' && !gameOver && animatingPieces.length === 0) {
      clearTimeout(turnTimeout.current);
      setTimeout(() => {
        makeRandomMove();
      }, 800);
    }
  }, [currPlayer, vsBot, gameOver, animatingPieces]);

  const toggleBotMode = () => {
    const newVsBot = !vsBot;
    setVsBot(newVsBot);
    solicitarNomes(newVsBot);
    resetGame();
  };

  const solicitarNomes = (botMode) => {
    const nomeX = prompt("Nome do Jogador 1:");
    if (botMode) {
      setPlayerNames({ X: nomeX || 'Jogador 1', O: 'BOT' });
    } else {
      const nomeO = prompt("Nome do Jogador 2:");
      setPlayerNames({
        X: nomeX || 'Jogador 1',
        O: nomeO || 'Jogador 2'
      });
    }
  };

  const resetGame = () => {
    clearInterval(turnTimeout.current);
    setBoard(emptyBoard);
    setGameOver(false);
    setCurrPlayer('X');
    setOppPlayer('O');
    currPlayerRef.current = 'X';
    lastPlayTimeRef.current = Date.now();
    setLiveTime('10.0');
    setPlayTime(0);
    setNotification('');
    setHighlightedColumn(null);
    setAnimatingPieces([]);
    generateSpecialCells();

    if (vsBot) {
      setTimeout(() => {
        makeRandomMove();
      }, 500);
    } else {
      startTurnTimer();
    }
  };

  const makeRandomMove = () => {
    const colOptions = [];
    for (let col = 0; col < 7; col++) {
      if (board[0][col] === '') colOptions.push(col);
    }
    if (colOptions.length === 0) {
      setGameOver(true);
      clearTimeout(turnTimeout.current);
      return;
    }
    const randCol = colOptions[Math.floor(Math.random() * colOptions.length)];
    handleMove(randCol);

    if (colOptions.length === 0) {
  setGameOver(true);
  setNotification("🤝 O jogo terminou em empate!");
  clearTimeout(turnTimeout.current);
  return;
}

  };

  const checkWin = (row, column, ch, boardRef) => {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    const numRows = boardRef.length;
    const numCols = boardRef[0].length;

    const countInDirection = (dx, dy) => {
      let count = 1;
      for (let dir of [1, -1]) {
        let r = row + dir * dx;
        let c = column + dir * dy;
        while (r >= 0 && r < numRows && c >= 0 && c < numCols && boardRef[r][c] === ch) {
          count++;
          r += dir * dx;
          c += dir * dy;
        }
      }
      return count >= 4;
    };

    return directions.some(([dx, dy]) => countInDirection(dx, dy));
  };

  const handleMouseEnter = (column) => {
    if (!gameOver && !(vsBot && currPlayer === 'O')) {
      setHighlightedColumn(column);
    }
  };

  const handleMouseLeave = () => {
    setHighlightedColumn(null);
  };

  const handleClick = (e) => {
    if (gameOver || (vsBot && currPlayer === 'O') || animatingPieces.length > 0) return;
    const column = parseInt(e.target.getAttribute('x'));
    if (!isNaN(column)) {
      handleMove(column);
    }
  };

  const handleMove = (column) => {
  let row = -1;
  for (let i = board.length - 1; i >= 0; i--) {
    if (board[i][column] === '') {
      row = i;
      break;
    }
  }
  if (row === -1) return;

  clearTimeout(turnTimeout.current);

  const animationId = `${Date.now()}-${column}`;
  setAnimatingPieces(prev => [...prev, { id: animationId, column, row, player: currPlayer }]);

  setTimeout(() => {
    const newBoard = board.map(row => [...row]);
    newBoard[row][column] = currPlayer;
    setBoard(newBoard);

    const now = Date.now();
    const timeSpent = ((now - lastPlayTimeRef.current) / 1000).toFixed(1);
    setPlayTime(timeSpent);
    setMoveHistory(prev => [...prev, { player: currPlayer, time: timeSpent }]);
    lastPlayTimeRef.current = now;

    const win = checkWin(row, column, currPlayer, newBoard);
    if (win) {
      setGameOver(true);
      setVictories(prev => ({ ...prev, [currPlayer]: prev[currPlayer] + 1 }));
      setAnimatingPieces([]);
      return;
    }

    const cellKey = `${row}-${column}`;
    const isSpecial = specialCells.includes(cellKey);

    if (isSpecial) {
      setNotification(`🎁 ${currPlayer === 'X' ? playerNames.X : playerNames.O} acertou uma casa especial! Joga novamente!`);
      setTimeout(() => setNotification(''), 2000);
      setSpecialCells(prev => prev.filter(cell => cell !== cellKey));
    } else {
      const next = currPlayer === 'X' ? 'O' : 'X';
      setCurrPlayer(next);
      setOppPlayer(currPlayer);
    }

    // ADICIONADO: Verificação de empate
    const isBoardFull = newBoard.every(row => row.every(cell => cell !== ''));
    if (isBoardFull && !win) {
      setGameOver(true);
      setNotification("🤝 O jogo terminou em empate!");
    }

    setAnimatingPieces(prev => prev.filter(piece => piece.id !== animationId));

    if (!gameOver && !(vsBot && currPlayer === 'O')) {
      startTurnTimer();
    }
  }, 1500);
};


  const startTurnTimer = () => {
    clearInterval(turnTimeout.current);
    if (gameOver || (vsBot && currPlayer === 'O')) return;

    let currentTime = 10.0;
    setLiveTime(currentTime.toFixed(1));

    const interval = setInterval(() => {
      currentTime -= 0.1;

      if (currentTime <= 0) {
        clearInterval(interval);
        turnTimeout.current = null;
        setLiveTime('0.0');

        if (!gameOver) {
          const expired = currPlayerRef.current;
          const expiredName = expired === 'X' ? playerNames.X : playerNames.O;
          alert(`${expiredName} demorou demais! Perde a vez.`);
          const next = expired === 'X' ? 'O' : 'X';
          setCurrPlayer(next);
          setOppPlayer(expired);
          lastPlayTimeRef.current = Date.now();

          if (!(vsBot && next === 'O')) {
            setTimeout(() => startTurnTimer(), 100);
          }
        }
      } else {
        setLiveTime(currentTime.toFixed(1));
      }
    }, 100);

    turnTimeout.current = interval;
  };

  const generateSpecialCells = () => {
    const specials = new Set();
    while (specials.size < 5) {
      const i = Math.floor(Math.random() * 4) + 2;
      const j = Math.floor(Math.random() * 7);
      specials.add(`${i}-${j}`);
    }
    setSpecialCells([...specials]);
  };

  return (
    <div className="container">
      <div className="sidebar">
        <div className="scoreboard">
          <div id="center">
            <h2>Placar</h2>
          </div>
          <p>🛸 {playerNames.X} : {victories.X}</p>
          <p>🪐 {playerNames.O} : {victories.O}</p>
          <div className="containerButtons">
            <button onClick={() => {
              if (!vsBot) solicitarNomes(false);
              resetGame();
            }}>
              🔄 Jogar
            </button>
            <button onClick={toggleBotMode}>
              {vsBot ? "👥 2 Jogadores" : "🤖 Jogar com o Bot"}
            </button>
          </div>
        </div>
        <div className="container2">
          <div className="roundtimes">
            <div id="center">
              <h2>Últimas Jogadas</h2>
            </div>
            <p>⏳ Tempo atual da jogada: {liveTime}s</p>
            <p>⏱️ Tempo da última jogada: {playTime}s</p>
          </div>
        </div>
      </div>

      <div style={{ position: 'relative' }}>
        {notification && <div className="notification">{notification}</div>}
        {gameOver && <h1 style={{ color: '#fff' }}>🎉 {currPlayer === 'X' ? playerNames.X : playerNames.O} venceu!</h1>}
        <h2 id='playerDisplay'>{currPlayer === 'X' ? playerNames.X : playerNames.O} Move</h2>

        <div className="hover-row">
          {[...Array(7)].map((_, col) => (
            <div
              key={col}
              className="hover-slot"
              onMouseEnter={() => handleMouseEnter(col)}
              onMouseLeave={handleMouseLeave}
            >
              {highlightedColumn === col && (
                <img
                  src={currPlayer === 'X' ? redToken : blackToken}
                  alt="Hover Token"
                  className="hover-token"
                />
              )}
            </div>
          ))}
        </div>

        <div id='board' onClick={handleClick} onMouseLeave={handleMouseLeave}>
          {board.map((row, i) =>
            row.map((ch, j) => (
              <Slot
                key={`${i}-${j}`}
                ch={ch}
                y={i}
                x={j}
                isSpecial={specialCells.includes(`${i}-${j}`)}
                isHighlighted={highlightedColumn === j}
                onMouseEnter={() => handleMouseEnter(j)}
              />
            ))
          )}

          {animatingPieces.map(piece => (
            <div
              key={piece.id}
              className="slot animating"
              style={{
                position: 'absolute',
                left: `${piece.column * (70 + 19.3) + 30.5}px`,
                top: '20px',
                width: '70px',
                height: '70px',
                animation: `slide-down 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
                zIndex: 0,
                '--final-row': piece.row,
              }}
            >
              <img
                src={piece.player === 'X' ? redToken : blackToken}
                width='100%'
                height='100%'
                alt={piece.player === 'X' ? 'Red Token' : 'Black Token'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
