import {_decorator, Button, Component, director, Input, Node} from 'cc';
const {ccclass, property} = _decorator;

@ccclass('MenuController')
export class MenuController extends Component {
  @property(Button)
  private playButton: Button | null = null;

  onLoad() {
    this.playButton?.node.on(
      Input.EventType.TOUCH_END,
      this.loadGameplayScene,
      this
    );
  }

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
