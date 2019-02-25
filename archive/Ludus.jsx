import React from 'react';
import ReactDOM from 'react-dom';
import './ludus.css';

class Game extends React.Component {
    render () {
        return (
            <div className="game">
            </div>
        );
    }
}


class Board extends React.Component {
    render () {
        return (
            <div className="board">
            </div>
        );
    }
}

class Goal extends React.Component {
    render () {
        return (
            <div className="goal">
            </div>
        );
    }
}

class Option extends React.Component {
    render () {
        return (
            <div className="option">
            </div>
        );
    }
}

ReactDOM.render (
    <Game />,
    document.getElementById('root')
);
