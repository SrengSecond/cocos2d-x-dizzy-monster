import {StateController} from './StateController';

export interface State {
  enter(stateController: StateController): void;
  update(stateController: StateController): void;
  exit(stateController: StateController): void;
}
