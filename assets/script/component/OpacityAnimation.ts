import {
  _decorator,
  CCFloat,
  Component,
  Node,
  tween,
  UIOpacity,
  Vec2,
  Vec3,
} from 'cc';
const {ccclass, property} = _decorator;

@ccclass('OpacityAnimation')
export class OpacityAnimation extends Component {
  private _UIOpacity: UIOpacity | null = null;
  private _intervalId: number | null = null;
  private _isFadingOut = true;

  @property(CCFloat)
  public duration = 0.25;

  onLoad() {
    this._UIOpacity = this.node.getComponent(UIOpacity);
    if (!this._UIOpacity) {
      this._UIOpacity = this.node.addComponent(UIOpacity);
    }
  }

  start() {
    if (this._UIOpacity) {
      const intervalDuration = this.duration * 1000; // Convert to milliseconds
      this._intervalId = setInterval(() => {
        if (this._isFadingOut) {
          this._UIOpacity!.opacity = 127.5;
        } else {
          this._UIOpacity!.opacity = 255;
        }
        this._isFadingOut = !this._isFadingOut;
      }, intervalDuration);
    }
  }

  onDestroy() {
    if (this._intervalId !== null) {
      clearInterval(this._intervalId);
    }
  }
}
