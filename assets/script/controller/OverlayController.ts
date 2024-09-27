import {_decorator, Component, Label, Node, Animation} from 'cc';
const {ccclass, property} = _decorator;

@ccclass('OverlayController')
export class OverlayController extends Component {
  @property(Node)
  private overlayBackground: Node | null = null;
  @property(Label)
  private overlayLabel: Label | null = null;

  private _animation: Animation | null = null;

  onLoad() {
    if (this.overlayLabel)
      this._animation = this.overlayLabel.getComponent(Animation);
  }

  open(title: string) {
    if (this.overlayBackground && this.overlayLabel && this._animation) {
      this.overlayBackground.active = true;
      this.overlayLabel.node.active = true;
      this.overlayLabel.string = title;
      this._animation.play('overlay-label');
      //   this._animation?.on(Animation.EventType.FINISHED, callback, this);
    }
  }

  reset() {
    if (this.overlayBackground && this.overlayLabel) {
      this.overlayBackground.active = false;
      this.overlayLabel.node.active = false;
      this.overlayLabel.string = '';
    }

    // this._animation?.off(Animation.EventType.FINISHED);
  }
}
