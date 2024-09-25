import {
  _decorator,
  Button,
  Component,
  Input,
  Label,
  Node,
  SpriteFrame,
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

  private _prevCardSpriteFrame: SpriteFrame | null = null;
  private _currentCardSpriteFrame: SpriteFrame | null = null;

  start() {
    this.changeState(this.introState);
  }

  // Cocos Creator lifecycle method
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

  public initGameOverEvent() {}

  public clearIntroEvent() {
    this.introUI && this.introUI.off(Input.EventType.TOUCH_START);
  }

  public clearGameplayEvent() {
    this.yesButton && this.yesButton.node.off(Input.EventType.TOUCH_START);
    this.noButton && this.noButton.node.off(Input.EventType.TOUCH_START);
  }

  public clearGameOverEvent() {}

  public getRandomIntroCard() {
    if (this.cardController) {
      this.cardController.updateDifficulty('EASY');
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
    if (this.scoreValueLabel) {
      this._score++;
      this.scoreValueLabel.string = this._score.toString();
    }
  }

  private updateCountdown(countdown: number) {
    this.countdownValueLabel &&
      (this.countdownValueLabel.string = countdown.toString());
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

  public changeUI(State: 'INTRO' | 'GAMEPLAY' | 'GAMEOVER') {
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

      case 'GAMEOVER':
        this.gameplayUI && (this.gameplayUI.active = false);
        this.introUI && (this.introUI.active = false);
        this.gameOverUI && (this.gameOverUI.active = true);
        break;
    }
  }

  public handleClickYes() {
    console.log('Yes button clicked');
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched
      if (this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
      } else {
        // change game state to game over
        this.changeState(this.gameOverState);
      }
    }
  }

  public handleClickNo() {
    console.log('No button clicked');
    if (this.cardController && this._prevCardSpriteFrame) {
      // check if the card is matched
      if (!this.cardController.isMatched(this._prevCardSpriteFrame)) {
        // add score
        this.incrementScore();

        // pick another card
        this._prevCardSpriteFrame = this._currentCardSpriteFrame;
        this._currentCardSpriteFrame =
          this.cardController.getRandomGameplayCard();
      } else {
        // change game state to game over
        this.changeState(this.gameOverState);
      }
    }
  }

  public handleClickAnywhere() {
    this.changeState(this.gameplayState);
  }
}
