import {_decorator, Button, Component, Node} from 'cc';
import {State} from './State';
import {IntroState} from './IntroState';
import {GameplayState} from './GameplayState';
import {GameOverState} from './GameOverstate';
const {ccclass, property} = _decorator;

@ccclass('StateController')
export class StateController extends Component {
  private _currentState: State | null = null;

  public introState = new IntroState();
  public gameplayState = new GameplayState();
  public gameOverState = new GameOverState();

  // 📦 UI Container
  @property(Node)
  private containerUI: Node | null = null;

  // 📦 UI Nodes
  @property(Node)
  private introUI: Node | null = null;
  @property(Node)
  private gameplayUI: Node | null = null;
  @property(Node)
  private gameOverUI: Node | null = null;

  // 📦 Gameplay Actions Nodes
  @property(Button)
  private yesButton: Button | null = null;
  @property(Button)
  private noButton: Button | null = null;

  get getContainerUI() {
    return this.containerUI;
  }

  get getYesButton() {
    return this.yesButton;
  }

  get getNoButton() {
    return this.noButton;
  }

  // Cocos Creator lifecycle method
  start() {
    this.changeState(this.introState);
  }

  update() {
    if (this._currentState) {
      this._currentState.update(this);
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
}
