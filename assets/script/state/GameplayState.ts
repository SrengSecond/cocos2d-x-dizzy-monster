import {State} from './State';
import {GameplayController} from '../controller/GameplayController';

export class GameplayState implements State {
  enter(gameplayController: GameplayController): void {
    // Initialize gameplay state
    gameplayController.changeUI('GAMEPLAY');

    // Listen for touch start event
    gameplayController.initGameplayEvent();

    // Get the first random card
    gameplayController.getRandomGameplayCard();

    // start countdown
    gameplayController.startCountdown();
  }

  update(gameplayController: GameplayController): void {
    // Update logic for game over state
  }

  exit(gameplayController: GameplayController): void {
    // stateController.gameplayController?.clearEvent();
    gameplayController.clearGameplayEvent();
  }
}
