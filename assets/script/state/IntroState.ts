import {State} from './State';
import {GameplayController} from '../controller/GameplayController';

export class IntroState implements State {
  enter(gameplayController: GameplayController): void {
    // Initialize game over state
    gameplayController.changeUI('INTRO');

    // Listen for touch start event
    gameplayController.initIntroEvent();

    // Get the first random card
    gameplayController.getRandomIntroCard();
  }

  update(gameplayController: GameplayController): void {
    // Update logic for intro state
  }

  exit(gameplayController: GameplayController): void {
    gameplayController.clearIntroEvent();
  }
}
