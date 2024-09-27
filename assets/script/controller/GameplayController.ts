import {
  _decorator,
  Button,
  Component,
  Input,
  Label,
  Node,
  SpriteFrame,
  ProgressBar,
  director,
  Sprite,
  Color,
  Prefab,
  instantiate,
  Animation,
} from 'cc';
import {CardController} from './CardController';
import {IntroState} from '../state/IntroState';
import {GameplayState} from '../state/GameplayState';
import {GameOverState} from '../state/GameOverstate';
import {State} from '../state/State';
import {OverlayController} from './OverlayController';

const {ccclass, property} = _decorator;

@ccclass('GameplayController')
export class GameplayController extends Component {
  private _currentState: State | null = null;

  private _score = 0;
  private _countdown = 999;
  private _countdownInterval: number | null = null;

  public introState = new IntroState();
  public gameplayState = new GameplayState();
  public gameOverState = new GameOverState();

  // 📔 Another Class Refercence
  @property(CardController)
  public cardController: CardController | null = null;

  @property(OverlayController)
  public overlayController: OverlayController | null = null;

  // 📦 Gameplay Actions Nodes
  @property(Button)
  private noButton: Button | null = null;
  @property(Button)
  private yesButton: Button | null = null;
  @property(Button)
  private tryAgainButton: Button | null = null;
  @property(Button)
  private homeButton: Button | null = null;

  // 📦 UI Nodes
  @property(Node)
  private introUI: Node | null = null;
  @property(Node)
  private gameplayUI: Node | null = null;
  @property(Node)
  private gameOverUI: Node | null = null;

  // 📦 Prefab Nodes@property(Prefab)
  @property(Node)
  private checkMarkContainer: Node | null = null;
  @property(Prefab)
  private checkMarkPrefab: Prefab | null = null;
  @property(Prefab)
  private crossMarkPrefab: Prefab | null = null;

  // 💬 Label Actions Nodes
  @property(Label)
  private scoreValueLabel: Label | null = null;
  @property(Label)
  private countdownValueLabel: Label | null = null;
  @property(ProgressBar)
  private countdownProgressBar: ProgressBar | null = null;
  @property(Label)
  private rankValueLable: Label | null = null;

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
        Input.EventType.TOUCH_END,
        this.handleClickAnywhere,
        this
      );
  }

  public initGameplayEvent() {
    this.yesButton &&
      this.yesButton.node.on(
        Input.EventType.TOUCH_END,
        this.handleClickYes,
        this
      );

    this.noButton &&
      this.noButton.node.on(
        Input.EventType.TOUCH_END,
        this.handleClickNo,
        this
      );
  }

  public initGameOverEvent() {
    this.tryAgainButton &&
      this.tryAgainButton.node.on(
        Input.EventType.TOUCH_END,
        this.handleClickTryAgain,
        this
      );

    this.homeButton &&
      this.homeButton.node.on(
        Input.EventType.TOUCH_END,
        this.handleClickHome,
        this
      );
  }

  public clearIntroEvent() {
    this.introUI && this.introUI.off(Input.EventType.TOUCH_END);
  }

  public clearGameplayEvent() {
    this.yesButton && this.yesButton.node.off(Input.EventType.TOUCH_END);
    this.noButton && this.noButton.node.off(Input.EventType.TOUCH_END);
  }

  public clearGameOverEvent() {
    this.tryAgainButton &&
      this.tryAgainButton.node.off(Input.EventType.TOUCH_END);

    this.homeButton && this.homeButton.node.off(Input.EventType.TOUCH_END);
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
    const percent = countdown / this._countdown;

    this.countdownProgressBar && (this.countdownProgressBar.progress = percent);

    // const progressbarSprite = this.countdownProgressBar?.getComponent(Sprite);

    // if (progressbarSprite) {
    //   // Calculate the progress ratio
    //   const progressRatio = percent;
    // }
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

    // Pick the rank based on the score
    this.rankValueLable &&
      (this.rankValueLable.string = this.pickRank(this._score));

    // Reset the gameplay score
    this.resetScore();
  }

  public handleGameOver(by: 'TIME_OUT' | 'WRONG_ANSWER') {
    // Stop countdown
    this.stopCountdown();

    const gameOverReason = by.split('_')?.join(' ')?.toLocaleLowerCase();

    this.overlayController && this.overlayController.open(gameOverReason);

    setTimeout(() => {
      // remove the last card
      this.cardController && this.cardController.removeLastCardInstance();

      this.overlayController && this.overlayController.reset();

      this.removeCheckMark();

      // change game state to game over
      this.changeState(this.gameOverState);
    }, 1500);
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
        this.introUI && (this.introUI.active = false);
        this.gameplayUI && (this.gameplayUI.active = false);
        this.gameOverUI && (this.gameOverUI.active = true);
        break;
    }
  }

  private handleClickYes() {
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched

      if (this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // reset countdown
        this.restartCountdown();

        // Show the check mark
        this.showCheckMark(true);

        // remove the current card
        this.cardController.removePrevCardInstance();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
        // this.removeCheckMark();
      } else {
        // this.cardController.showCheckMark(false);
        this.handleGameOver('WRONG_ANSWER');

        // Show the check mark
        this.showCheckMark(false);
      }
    }
  }

  private handleClickNo() {
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched
      if (!this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // reset countdown
        this.restartCountdown();

        // Show the check mark
        this.showCheckMark(true);

        // remove the current card
        this.cardController.removePrevCardInstance();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
        // this.removeCheckMark();
      } else {
        this.showCheckMark(false);
        this.handleGameOver('WRONG_ANSWER');
      }
    }
  }

  public handleClickAnywhere() {
    this.changeState(this.gameplayState);
  }

  private handleClickTryAgain() {
    this.changeState(this.introState);
  }

  private handleClickHome() {
    director.loadScene('MenuScene');
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

  public startCountdown() {
    let countdown = this._countdown;
    let countdownMs = this._countdown * 1000; // Convert to milliseconds
    // this.updateCountdown(countdown);
    // this.updateCircleCountdown(countdownMs / 1000);

    this._countdownInterval = setInterval(() => {
      countdownMs -= 10; // Decrease by 100 milliseconds
      const newCountdown = Math.floor(countdownMs / 1000); // Convert to seconds

      this.updateCircleCountdown(countdownMs / 1000);

      if (newCountdown !== countdown) {
        countdown = newCountdown;
        this.updateCountdown(countdown + 1);
      }

      // console.log('Countdown:', countdown, 'CountdownMs:', countdownMs);

      if (countdownMs <= 0 && this._countdownInterval) {
        this.handleGameOver('TIME_OUT');
      }
    }, 10);
  }

  private stopCountdown() {
    this._countdownInterval && clearInterval(this._countdownInterval);
  }

  private restartCountdown() {
    this.stopCountdown();
    this.startCountdown();
  }

  private pickRank(score: number): string {
    if (score > 60) {
      return 'S';
    } else if (score <= 60 && score > 50) {
      return 'A';
    } else if (score <= 50 && score > 40) {
      return 'B';
    } else if (score <= 40 && score > 30) {
      return 'C';
    } else if (score <= 30 && score > 10) {
      return 'D';
    } else if (score <= 10 && score > 0) {
      return 'E';
    } else {
      return 'F';
    }
  }

  public showCheckMark(isChecked: boolean) {
    if (
      this.checkMarkContainer &&
      this.checkMarkPrefab &&
      this.crossMarkPrefab
    ) {
      const instance = instantiate(
        isChecked ? this.checkMarkPrefab : this.crossMarkPrefab
      );

      this.checkMarkContainer.addChild(instance);

      const instanceAnimation = instance.getComponent(Animation);

      instanceAnimation &&
        instanceAnimation.on(
          Animation.EventType.FINISHED,
          () => {
            setTimeout(
              () => {
                instance.destroy();
              },
              isChecked ? 300 : 1000
            );
          },
          instanceAnimation
        );
    }
  }

  private removeCheckMark() {
    if (this.checkMarkContainer) {
      this.checkMarkContainer.removeAllChildren();
    }
  }
}
