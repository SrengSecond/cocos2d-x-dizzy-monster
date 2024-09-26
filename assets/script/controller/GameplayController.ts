import {
  _decorator,
  Button,
  Component,
  Input,
  Label,
  Node,
  SpriteFrame,
  ProgressBar,
} from 'cc';
import {CardController} from './CardController';
import {IntroState} from '../state/IntroState';
import {GameplayState} from '../state/GameplayState';
import {GameOverState} from '../state/GameOverstate';
import {State} from '../state/State';

const {ccclass, property} = _decorator;

@ccclass('GameplayController')
export class GameplayController extends Component {
  private _currentState: State | null = null;

  private _score = 0;
  private _countdown = 3;
  private _countdownInterval: number | null = null;

  public introState = new IntroState();
  public gameplayState = new GameplayState();
  public gameOverState = new GameOverState();

  // 📔 Another Class Refercence
  @property(CardController)
  public cardController: CardController | null = null;

  // 📦 Gameplay Actions Nodes
  @property(Button)
  private noButton: Button | null = null;
  @property(Button)
  private yesButton: Button | null = null;
  @property(Button)
  private tryAgainButton: Button | null = null;

  // 📦 UI Nodes
  @property(Node)
  private introUI: Node | null = null;
  @property(Node)
  private gameplayUI: Node | null = null;
  @property(Node)
  private gameOverUI: Node | null = null;

  // 💬 Label Actions Nodes
  @property(Label)
  private scoreValueLabel: Label | null = null;
  @property(Label)
  private countdownValueLabel: Label | null = null;
  @property(ProgressBar)
  private countdownProgressBar: ProgressBar | null = null;

  @property(Label)
  private gameOverScoreValueLabel: Label | null = null;
  @property(Label)
  private gameOverHighScoreValueLabel: Label | null = null;
  @property(Label)
  private gameOverRankLabel: Label | null = null;

  private _prevCardSpriteFrame: SpriteFrame | null = null;
  private _currentCardSpriteFrame: SpriteFrame | null = null;

  // Cocos Creator lifecycle method
  start() {
    this.changeState(this.introState);
  }

  update() {
    if (this._currentState) {
      this._currentState.update(this);
    }
  }

  public initIntroEvent() {
    this.introUI &&
      this.introUI.on(
        Input.EventType.TOUCH_START,
        this.handleClickAnywhere,
        this
      );
  }

  public initGameplayEvent() {
    this.yesButton &&
      this.yesButton.node.on(
        Input.EventType.TOUCH_START,
        this.handleClickYes,
        this
      );

    this.noButton &&
      this.noButton.node.on(
        Input.EventType.TOUCH_START,
        this.handleClickNo,
        this
      );
  }

  public initGameOverEvent() {
    this.tryAgainButton &&
      this.tryAgainButton.node.on(
        Input.EventType.TOUCH_START,
        this.handleClickTryAgain,
        this
      );
  }

  public clearIntroEvent() {
    this.introUI && this.introUI.off(Input.EventType.TOUCH_START);
  }

  public clearGameplayEvent() {
    this.yesButton && this.yesButton.node.off(Input.EventType.TOUCH_START);
    this.noButton && this.noButton.node.off(Input.EventType.TOUCH_START);
  }

  public clearGameOverEvent() {
    this.tryAgainButton &&
      this.tryAgainButton.node.off(Input.EventType.TOUCH_START);
  }

  public getRandomIntroCard() {
    if (this.cardController) {
      this.updateDifficulty('EASY');
      this._prevCardSpriteFrame = this.cardController.getRandomIntroCard();
    }
  }

  public getRandomGameplayCard() {
    if (this.cardController) {
      this._currentCardSpriteFrame =
        this.cardController.getRandomGameplayCard();
    }
  }

  private incrementScore() {
    this._score++;
    this.updateScore(this._score);
  }

  private resetScore() {
    this._score = 0;
    this.updateScore(this._score);
  }

  private updateScore(score: number) {
    this.scoreValueLabel && (this.scoreValueLabel.string = score.toString());
    if (score > 20) {
      this.updateDifficulty('MEDIUM');
    } else if (score > 40) {
      this.updateDifficulty('HARD');
    }
  }

  private updateCountdown(countdown: number) {
    this.countdownValueLabel &&
      (this.countdownValueLabel.string = countdown.toString());
  }
  private updateCircleCountdown(countdown: number) {
    this.countdownProgressBar &&
      (this.countdownProgressBar.progress = countdown / this._countdown);
  }

  public updateGameOverResult() {
    // Update the result score
    this.gameOverScoreValueLabel &&
      (this.gameOverScoreValueLabel.string = this._score.toString());

    // Check & Update if a player previous a high score
    this.gameOverHighScoreValueLabel &&
      (this.gameOverHighScoreValueLabel.string = this.findBestScore(
        this._score
      ).toString());

    // Reset the gameplay score
    this.resetScore();
  }

  private findBestScore(currentScore: number): number {
    // if a user has the best score
    const bestScore = localStorage.getItem('BEST_SCORE');
    if (bestScore && parseInt(bestScore)) {
      // check if the current score is higher than the best score
      if (currentScore > parseInt(bestScore)) {
        // Replace the best score with the current score
        localStorage.setItem('BEST_SCORE', this._score.toString());
        return this._score;
      } else {
        return parseInt(bestScore);
      }
    } else {
      // if the user doesn't have the best score yet - set the current score as the best score
      localStorage.setItem('BEST_SCORE', this._score.toString());
      return this._score;
    }
  }

  // Custom method
  public changeState(newState: State) {
    if (this._currentState) {
      this._currentState.exit(this);
    }

    this._currentState = newState;

    if (this._currentState) {
      this._currentState.enter(this);
    }
  }

  public changeUI(State: 'INTRO' | 'GAMEPLAY' | 'GAME_OVER') {
    console.log('Change UI:', State);
    // Remove the current UI
    switch (State) {
      case 'INTRO':
        this.gameOverUI && (this.gameOverUI.active = false);
        this.gameplayUI && (this.gameplayUI.active = false);
        this.introUI && (this.introUI.active = true);
        break;

      case 'GAMEPLAY':
        this.introUI && (this.introUI.active = false);
        this.gameOverUI && (this.gameOverUI.active = false);
        this.gameplayUI && (this.gameplayUI.active = true);
        break;

      case 'GAME_OVER':
        this.gameplayUI && (this.gameplayUI.active = false);
        this.introUI && (this.introUI.active = false);
        this.gameOverUI && (this.gameOverUI.active = true);
        break;
    }
  }

  private handleClickYes() {
    console.log('Yes button clicked');
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched
      if (this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // reset countdown
        this.restartCountdown();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
      } else {
        // Stop countdown
        this.stopCountdown();

        // change game state to game over
        this.changeState(this.gameOverState);
      }
    }
  }

  private handleClickNo() {
    console.log('No button clicked');
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched
      if (!this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // reset countdown
        this.restartCountdown();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
      } else {
        // Stop countdown
        this.stopCountdown();

        // change game state to game over
        this.changeState(this.gameOverState);
      }
    }
  }

  public handleClickAnywhere() {
    this.changeState(this.gameplayState);
  }

  private handleClickTryAgain() {
    this.changeState(this.introState);
  }

  private updateDifficulty(level: 'EASY' | 'MEDIUM' | 'HARD') {
    // Update the card difficulty
    this.cardController && this.cardController.updateDifficulty(level);

    // Update the countdown based on the difficulty level
    switch (level) {
      case 'EASY':
        this._countdown = 3;
        break;
      case 'MEDIUM':
        this._countdown = 2;
        break;
      case 'HARD':
        this._countdown = 1;
        break;
    }
  }

  // public startCountdown() {
  //   let countdown = this._countdown;
  //   this.updateCountdown(this._countdown);
  //
  //   this._countdownInterval = setInterval(() => {
  //     countdown--;
  //     this.updateCountdown(countdown);
  //     console.log('Countdown:', countdown);
  //
  //     if (countdown <= 0 && this._countdownInterval) {
  //       clearInterval(this._countdownInterval);
  //       this.changeState(this.gameOverState);
  //     }
  //   }, 1000);
  // }

  public startCountdown() {
    let countdown = this._countdown;
    let countdownMs = this._countdown * 1000; // Convert to milliseconds
    // this.updateCountdown(countdown);
    // this.updateCircleCountdown(countdownMs / 1000);

    this._countdownInterval = setInterval(() => {
      countdownMs -= 100; // Decrease by 100 milliseconds
      const newCountdown = Math.floor(countdownMs / 1000); // Convert to seconds

      this.updateCircleCountdown(countdownMs / 1000);

      if (newCountdown !== countdown) {
        countdown = newCountdown;
        this.updateCountdown(countdown + 1);
      }

      console.log('Countdown:', countdown, 'CountdownMs:', countdownMs);

      if (countdownMs <= 0 && this._countdownInterval) {
        clearInterval(this._countdownInterval);
        this.changeState(this.gameOverState);
      }
    }, 100);
  }

  private stopCountdown() {
    this._countdownInterval && clearInterval(this._countdownInterval);
  }

  private restartCountdown() {
    this.stopCountdown();
    this.startCountdown();
  }
}
