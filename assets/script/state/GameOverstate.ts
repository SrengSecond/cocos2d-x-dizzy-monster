import {State} from './State';
import {StateController} from './StateController';

export class GameOverState implements State {
  enter(stateController: StateController): void {
    console.log('Game Over State');
    stateController.changeUI('GAMEOVER');
  }

  update(stateController: StateController): void {
    // Update logic for game over state
  }

  exit(stateController: StateController): void {
    // Cleanup game over state
  }
}
