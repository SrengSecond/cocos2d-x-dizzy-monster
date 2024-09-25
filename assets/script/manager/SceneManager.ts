import {_decorator, Component, director, Node} from 'cc';
const {ccclass, property} = _decorator;

@ccclass('NavigationManager')
export class NavigationManager extends Component {
  start() {}

  update(deltaTime: number) {}

  loadGameplayScene() {
    director.loadScene('GameplayScene');
  }

  loadMenuScene() {
    director.loadScene('MenuScene');
  }

  loadGameOverScene() {
    director.loadScene('GameOverScene');
  }
}
