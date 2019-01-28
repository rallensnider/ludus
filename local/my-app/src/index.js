import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class HelpButton extends React.Component {
    checkMode() {
        if (this.props.value === true) {
            return (
                <button className="help btn-floating btn-small waves-effect waves-light blue accent-1 grey-text text-darken-4" onClick={() => this.props.onClick()}>
                    <i className="material-icons">help</i>
                </button>
            );
        } else {
            return (
                <button className="help btn-floating btn-small waves-effect waves-dark blue darken-1 grey-text text-darken-3" onClick={() => this.props.onClick()}>
                    <i className="material-icons">help_outline</i>
                </button>
            );
        }
    }
    render () {
        return (
            <div className="row">
                <div className="col s2 offset-s10">
                    {this.checkMode()}
                </div>
            </div>
        );
    }
}

class Switcher extends React.Component {
    renderSwitcher() {
        return (
            <button className="toggle btn-floating btn-small waves-effect waves-light blue darken-4 grey-text text-darken-4" onClick={() => this.props.onClick()}>
                <i className="material-icons">swap_horiz</i>
            </button>
        );
    }

    render() {
        return (
            <div className="switcher-layout row">
                <div className="col s6">
                    {this.renderSwitcher()}
                </div>
            </div>
        );
    }
}

class Choice extends React.Component {
    renderChoice() {
        if (this.props.isHelpOn) {
            if (this.props.value === this.props.correct) {
                return (
                    <button className="pulse btn-large grey darken-2 waves-effect waves-light" onClick={() => this.props.onClick()}>
                        {this.props.value}
                    </button>
                );
            }
        }
        return (
            <button className="btn-large grey darken-3 waves-effect waves-light" onClick={() => this.props.onClick()}>
                {this.props.value}
            </button>
        );
    }

    render() {
        return (
            <div className="choice grey lighten-1 card-action">
                {this.renderChoice()}
            </div>
        );
    }
}

class Goal extends React.Component {
    render () {
        return (
            <div className="goal row blue-grey darken-3 deep-orange-text text-darken-4">
                <div className="col s12">
                    Find the <strong className="deep-orange-text text-accent-4">{this.props.value}</strong> ending…
                </div>
            </div>
        );
    }
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        const setupStates = this.setupBoard();
        this.state = {
            currentPlayer: props.owner,
            choices: setupStates.currentForms,
            correctChoice: setupStates.chosenForm,
            goal: setupStates.chosenGloss,
            tries: 0.00,
            correct: 0.00,
            isHelpMode: false,
        };
    }

    buildSlice(ofLength, fromSource) {
        var toSlice = [];
        for (var i = 0; i < ofLength; i++) {
            var randomIndex = Math.floor(Math.random() * (fromSource.length - 1));
            var currentEntry = fromSource[randomIndex];
            while (toSlice.includes(currentEntry)) {
                randomIndex = Math.floor(Math.random() * (fromSource.length - 1));
                currentEntry = fromSource[randomIndex];
            }
            toSlice.push(currentEntry);
        }
        return toSlice;
    }

    setupBoard() {
        const morphemeBase = [
            {"-a": "fem. nom. sg."},
            {"-ae": "fem. gen sg."},
            {"-ae": "fem. dat. sg."},
            {"-am": "fem. acc. sg."},
            {"-ā": "fem. abl. sg."},
            {"-ae": "fem. nom. pl."},
            {"-ārum": "fem. gen pl."},
            {"-īs": "fem. dat. pl."},
            {"-ās": "fem. acc. pl."},
            {"-īs": "fem. abl. pl."},
            {"-us": "mas. nom. sg."},
            {"-ī": "mas. gen. sg."},
            {"-ō": "mas. abl. sg."},
            {"-um": "mas. acc. sg."},
            {"-ō": "mas. dat. sg."},
            {"-ī": "mas. nom. pl."},
            {"-īs": "mas. dat. pl."},
            {"-ōs": "mas. acc. pl."},
            {"-īs": "mas. abl. pl."},
            {"-um": "neu. nom. sg."},
            {"-ī": "neu. gen. sg."},
            {"-ō": "neu. abl. sg."},
            {"-um": "neu. acc. sg."},
            {"-ō": "neu. dat. sg."},
            {"-a": "neu. nom. pl."},
            {"-īs": "neu. dat. pl."},
            {"-a": "neu. acc. pl."},
            {"-īs": "neu. abl. pl."},
        ];
        const renderedQuantity = 4; // must be less than morphemeBase.length
        const selectedSlice = this.buildSlice(renderedQuantity, morphemeBase);
        const forms = selectedSlice.flatMap(form => Object.keys(form));
        const goalNumber = Math.floor(Math.random() * (selectedSlice.length - 1));
        return ({
            currentForms: forms,
            chosenForm: forms[goalNumber],
            chosenGloss: Object.values(selectedSlice[goalNumber]),
        });
    }

    calcScore(correctTries, totalTries) {
        return (correctTries / totalTries).toFixed(2);
    }

    checkChoice(choice, correct) {
        var updatedCorrect = this.state.correct;
        const updatedTries = (this.state.tries + 1.00);
        if (choice === correct) {
            alert("You win!");
            const previousCorrect = updatedCorrect;
            updatedCorrect = (previousCorrect + 1.00);
            const resetupStates = this.setupBoard();
            this.setState((state, props) => ({
                choices: resetupStates.currentForms,
                correctChoice: resetupStates.chosenForm,
                goal: resetupStates.chosenGloss,
                tries: updatedTries,
                correct: updatedCorrect,
            }));
        }
        else {
            alert("Sorry, try again!");
            this.setState((state, props) => ({
                tries: updatedTries,
            }));
        }
        const newRatio = this.calcScore(updatedCorrect, updatedTries);
        return this.props.scoreKeeper(this.state.currentPlayer, newRatio);
    }

    renderChoices() {
        var choiceElements = [];
        for (var i = 0; i < this.state.choices.length - 1; i+=2) {
            const choiceAtCurrentIndex = this.state.choices[i];
            const choiceAtNextIndex = this.state.choices[i + 1];
            choiceElements.push(
                <div className="choice-column col s6">
                    <Choice value={choiceAtCurrentIndex} isHelpOn={this.state.isHelpMode} correct={this.state.correctChoice} onClick={() => this.checkChoice(choiceAtCurrentIndex, this.state.correctChoice)} />
                    <Choice value={choiceAtNextIndex} isHelpOn={this.state.isHelpMode} correct={this.state.correctChoice} onClick={() => this.checkChoice(choiceAtNextIndex, this.state.correctChoice)} />
                </div>
            );
        }
        const isChoicesListOdd = (this.state.choices.length % 2 !== 0);
        if (isChoicesListOdd) {
            const lastChoice = this.state.choices[(this.state.choices.length - 1)];
            choiceElements.push(
                <div className="choice-column col s6">
                    <Choice value={lastChoice} isHelpOn={this.state.isHelpMode} correct={this.state.correctChoice} onClick={() => this.checkChoice(lastChoice, this.state.correctChoice)} />
                </div>
            );
        }
        return (
            <div className="choice-layout row grey">
                {choiceElements}
            </div>
        );
    }

    renderScore() {
        const successRatio = this.props.score;
        return (
            <div className="header">
                <div className="greeting blue-grey blue-grey-darken-1 deep-orange-text text-accent-2">
                    Hello player {this.state.currentPlayer}!
                </div>
                <div className="score blue-grey blue-grey-darken-2 deep-orange-text text-accent-1">
                    Your success rate is: {successRatio}
                </div>
            </div>
        );
    }

    toggleHelp() {
        this.setState((state, props) => {
            return {isHelpMode: !(state.isHelpMode)};
        });
    }

    renderHelpButton() {
        return (
            <HelpButton value={this.state.isHelpMode} onClick={() => this.toggleHelp()} />
        );
    }

    handlePlayerSwitch(toPlayer) {
        this.setState((state, props) => {
            return {currentPlayer: toPlayer};
        });
    }

    renderSwitcher(isPlayer) {
        var toPlayer;
        if (isPlayer === this.state.playerOne) {
            toPlayer = this.state.playerTwo;
        } else {
            toPlayer = this.state.playerOne;
        }
        return (
            <Switcher onClick={() => this.handlePlayerSwitch(toPlayer)} />
        );
    }

    render () {
        return (
            <div className="board card container grey darken-2">
                <div className="card-content">
                    <div className="banner row grey darken-1 deep-orange-text text-darken-3">
                        <div className="col card-title s6">
                            Let’s Play <i>Ludus</i>!
                        </div>
                        <div className="col s6">
                            {this.renderScore()}
                        </div>
                    </div>
                    <Goal value={this.state.goal} />
                    {this.renderChoices()}
                </div>
                {this.renderSwitcher(this.state.currentPlayer)}
                {this.renderHelpButton()}
            </div>
        );
    }
}

class Dash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerOneScore: props.scoreOne,
            playerTwoScore: props.scoreTwo,
        };
    }

    render () {
        return (
            <div className="board card container grey lighten-2">
                <div className="card-content">
                    <div className="banner row grey darken-2 deep-orange-text text-accent-3">
                        <div className="col card-title s6">
                            Scoreboard
                        </div>
                    </div>
                    <div className="row grey darken-3 deep-orange-text text-accent-4">
                        <div className="col s6">
                            Player 1: {this.state.playerOneScore}
                        </div>
                        <div className="col s6">
                            Player 2: {this.state.playerTwoScore}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        const playerUuid1 = this.createGuid();
        const playerUuid2 = this.createGuid();
        const gameUuid = this.createGuid()
        this.state = {
            gameId: gameUuid,
            playerOneId: playerUuid1,
            playerOneScore: 0.00,
            playerTwoId: playerUuid2,
            playerTwoScore: 0.00,
        };
    }

    // ID Generator, thanks to
    // [Byron Salau](http://byronsalau.com/blog/how-to-create-a-guid-uuid-in-javascript/)
    createGuid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            // eslint-disable-next-line
            var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    incrementPlayerOneScore(toScore) {
        this.setState((state, props) => ({
            playerOneScore: toScore
        }));
    }

    incrementPlayerTwoScore(toScore) {
        this.setState((state, props) => ({
            playerTwoScore: toScore
        }));
    }

    updateScore(forPlayer, newScore) {
        if (forPlayer === this.state.playerTwoId) {
            this.incrementPlayerTwoScore(newScore);
        } else {
            this.incrementPlayerOneScore(newScore);
        }
    }

    render () {
        return (
            <div className="game container grey darken-3">
                <div className="row">
                    <div className="s12">
                        <Dash scoreOne={this.state.playerOneScore} scoreTwo={this.state.playerTwoScore} />
                        <Board owner={this.state.playerOneId} score={this.state.playerOneScore} scoreKeeper={(x, y) => this.updateScore(x, y)} />
                        <Board owner={this.state.playerTwoId} score={this.state.playerTwoScore} scoreKeeper={(x, y) => this.updateScore(x, y)} />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
