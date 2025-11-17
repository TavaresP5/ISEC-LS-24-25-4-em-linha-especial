import React from 'react';
import redToken from '../assets/red token.svg';
import blackToken from '../assets/black token.svg';

export const Slot = ({ ch, y, x, isSpecial, onMouseEnter }) => (
  <div
    className={`slot ${isSpecial ? 'special' : ''}`}
    x={x}
    y={y}
    onMouseEnter={onMouseEnter} // tive de adicionar isto para o hoover das colunas
  >
    {ch && (
      <img
        src={ch === 'X' ? redToken : blackToken}
        width='100%'
        height='100%'
      />
    )}
  </div>
);
