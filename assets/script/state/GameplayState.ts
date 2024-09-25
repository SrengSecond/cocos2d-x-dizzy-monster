import {Input} from 'cc';
import {State} from './State';
import {StateController} from './StateController';

export class GameplayState implements State {
  enter(stateController: StateController): void {
    // stateController.getNoButton &&
    //   stateController.getNoButton.node.on(Input.EventType.TOUCH_START, () =>
    //     this.handleTouchNo(stateController)
    //   );

    stateController.getYesButton &&
      stateController.getYesButton.node.on(
        Input.EventType.TOUCH_START,
        () =>
          // this.handleTouchYes(stateController)
          {
            stateController.changeState(stateController.gameOverState);
          },
        stateController
      );

    // Show the intro UI
    stateController.changeUI('GAMEPLAY');
  }

  update(stateController: StateController): void {
    // Update logic for game over state
  }

  exit(stateController: StateController): void {
    // stateController.getYesButton &&
    //   stateController.getYesButton.node.off(Input.EventType.TOUCH_START, () => {
    //     stateController.changeState(stateController.gameOverState);
    //   });
    // stateController.getNoButton &&
    //   stateController.getNoButton.node.off(Input.EventType.TOUCH_START);
    // Cleanup game over state
  }

  private handleTouchYes(stateController: StateController) {
    console.log('Yes button clicked');
    stateController.changeState(stateController.gameOverState);

    // stateController.changeState(stateController.introState);
  }

  private handleTouchNo(stateController: StateController) {}
}
