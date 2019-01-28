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
  
  setupBoard() {
    const forms = {
      "-a": "nom. sg.",
      "-ae": "gen sg.",
      "-ārum": "gen pl.",
      "-am": "acc. sg.",
      "-ā": "abl. sg.",
      "-ās": "acc. pl.",
      "-īs": "abl. pl.",
    };
    const goalNumber = Math.floor(Math.random() * (Object.keys(forms).length - 1));
    
    const forms2 = [
      {"-a": "nom. sg."},
      {"-ae": "gen sg."},
      {"-ārum": "gen pl."},
      {"-am": "acc. sg."},
      {"-ā": "abl. sg."},
      {"-ās": "acc. pl."},
      {"-īs": "abl. pl."},
    ];
    const renderedQuantity = 2;
    const sliceStart = Math.floor(Math.random() * (selectedForms2.length - renderedQuantity)); // can be 0
    console.log("TEST: slice randomly begins @… " + sliceStart);
    // was a clunky +1, to ensure non-zero length for the result
    // but in fact is a constant equivalent to the desired number of choices rendered…
    const sliceEnd = sliceStart + renderedQuantity;
    console.log("TEST: random slice end is… " + sliceEnd);
    const selectedForms2 = forms2.slice(sliceStart, sliceEnd);
    console.log("TEST: selected forms 2 var entries are … " + selectedForms2);
    const goalNumber2 = Math.floor(Math.random() * (selectedForms2.length - 1));
    console.log("TEST: new goal number is… " + goalNumber2);
    const testMember = selectedForms2[goalNumber2];
    console.log("TEST: entry " + goalNumber2 + " of selected forms 2 is… " + testMember);
    const testForm = Object.keys(testMember);
    console.log("TEST: form is… " + testForm);
    const testGloss = Object.values(testMember);
    console.log("TEST: gloss is… " + testGloss);
    
    return ({
      currentForms: Object.keys(forms), 
      chosenForm: Object.keys(forms)[goalNumber], 
      chosenGloss: Object.values(forms)[goalNumber],
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
    const isChoicesListOdd = (this.state.choices.length % 2 != 0);
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
    // console.log("LOG: ID1 is " + playerUuid1);
    const playerUuid2 = this.createGuid();
    // console.log("LOG: ID2 is " + playerUuid2);
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
