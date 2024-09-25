import {GameplayController} from '../controller/GameplayController';
import {State} from './State';

export class GameOverState implements State {
  enter(gameOverState: GameplayController): void {
    gameOverState.changeUI('GAMEOVER');
  }

  update(gameOverState: GameplayController): void {
    // Update logic for game over state
  }

  exit(gameOverState: GameplayController): void {
    // Cleanup game over state
  }
}
