import {GameplayController} from '../controller/GameplayController';
import {State} from './State';

export class GameOverState implements State {
  enter(gameOverState: GameplayController): void {
    // Initialize game over state
    gameOverState.changeUI('GAME_OVER');

    // Listen for touch start event
    gameOverState.initGameOverEvent();

    // Update game over result
    gameOverState.updateGameOverResult();
  }

  update(gameOverState: GameplayController): void {
    // Update logic for game over state
  }

  exit(gameOverState: GameplayController): void {
    gameOverState.clearGameOverEvent();
  }
}
