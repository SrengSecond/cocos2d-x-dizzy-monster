import {GameplayController} from '../controller/GameplayController';

export interface State {
  enter(stateController: GameplayController): void;
  update(stateController: GameplayController): void;
  exit(stateController: GameplayController): void;
}
