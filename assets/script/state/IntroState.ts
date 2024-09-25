import {Input} from 'cc';
import {State} from './State';
import {StateController} from './StateController';

export class IntroState implements State {
  enter(stateController: StateController): void {
    // Listen for touch start event
    stateController.getContainerUI &&
      stateController.getContainerUI.on(
        Input.EventType.TOUCH_START,
        () => this.handleStart(stateController),
        stateController
      );

    // Initialize game over state
    stateController.changeUI('INTRO');

    // Show the intro UI
  }

  update(stateController: StateController): void {}

  exit(stateController: StateController): void {
    stateController.getContainerUI &&
      stateController.getContainerUI.off(Input.EventType.TOUCH_START);
  }

  private handleStart(stateController: StateController) {
    stateController.changeState(stateController.gameplayState);
  }
}
