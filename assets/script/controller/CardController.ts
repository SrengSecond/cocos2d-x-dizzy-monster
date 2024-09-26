import {
  _decorator,
  Component,
  instantiate,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  Animation,
} from 'cc';

const {ccclass, property} = _decorator;

@ccclass('CardControllerCard')
export class CardController extends Component {
  @property(Prefab)
  private cardPrefab: Prefab | null = null;

  @property(Node)
  public cardCotainer: Node | null = null;

  @property(Sprite)
  private introCardSprite: Sprite | null = null;

  // @property(Sprite)
  // private gameplayCardSprite: Sprite | null = null;

  @property([SpriteFrame])
  private airCardSprite: SpriteFrame[] = [];

  @property([SpriteFrame])
  private fireCardSprite: SpriteFrame[] = [];

  @property([SpriteFrame])
  private natureCardSprite: SpriteFrame[] = [];

  @property([SpriteFrame])
  private deadCardSprite: SpriteFrame[] = [];

  @property([SpriteFrame])
  private wildCardSprite: SpriteFrame[] = [];

  private _currentSpriteFrame: SpriteFrame | null = null;
  private _spriteFramePool: SpriteFrame[] = [];
  private _previousCardInstace: Node | null = null;

  public updateDifficulty(level: 'EASY' | 'MEDIUM' | 'HARD') {
    const {maxLength} = this.levelConfig(level);

    this._spriteFramePool.push(...this.airCardSprite.slice(0, maxLength));
    this._spriteFramePool.push(...this.fireCardSprite.slice(0, maxLength));
    this._spriteFramePool.push(...this.natureCardSprite.slice(0, maxLength));
    this._spriteFramePool.push(...this.deadCardSprite.slice(0, maxLength));
    this._spriteFramePool.push(...this.wildCardSprite.slice(0, maxLength));
  }

  public getRandomIntroCard(): SpriteFrame | null {
    // Get a random index from the card pool
    const randomIndex = Math.floor(
      Math.random() * this._spriteFramePool.length
    );

    // Update the current sprite frame - used for comparison
    this._currentSpriteFrame = this._spriteFramePool[randomIndex];

    // Update the card sprite
    this.introCardSprite &&
      (this.introCardSprite.spriteFrame = this._currentSpriteFrame);

    // Return the current sprite frame to be used for comparison
    return this._currentSpriteFrame;
  }

  public getRandomGameplayCard(): SpriteFrame | null {
    if (this._currentSpriteFrame) {
      const randomIndex = this.getRandomValueWithBias<SpriteFrame>(
        this._currentSpriteFrame,
        this._spriteFramePool
      );

      // Update the current sprite frame - used for comparison
      this._currentSpriteFrame = this._spriteFramePool[randomIndex];

      // Update the card sprite
      // this.gameplayCardSprite &&
      //   (this.gameplayCardSprite.spriteFrame = this._currentSpriteFrame);

      // Create a new card instance
      if (this.cardCotainer && this.cardPrefab) {
        const instance = instantiate(this.cardPrefab);
        const instanceSprite = instance.getComponentInChildren(Sprite);
        instanceSprite &&
          (instanceSprite.spriteFrame = this._currentSpriteFrame);

        this.cardCotainer.addChild(instance);
        this._previousCardInstace = instance;
      }

      // Return the current sprite frame to be used for comparison
      return this._currentSpriteFrame;
    } else {
      return null;
    }
  }

  public removePrevCardInstance() {
    const instace = this._previousCardInstace;
    this._previousCardInstace = null;

    if (instace && this.cardCotainer) {
      const instanceAnimation = instace?.getComponent(Animation);

      if (instanceAnimation) {
        console.log('Animation found', instanceAnimation);
        instanceAnimation.on(Animation.EventType.FINISHED, e => {
          console.log('Animation finished', e);
          instace?.destroy();
        });

        instanceAnimation.play('card-leave');
      }
    }
  }

  public removeLastCardInstance() {
    const instace = this._previousCardInstace;
    this._previousCardInstace = null;

    if (instace && this.cardCotainer) {
      instace?.destroy();
    }
  }

  public isMatched(card: SpriteFrame): boolean {
    return card === this._currentSpriteFrame;
  }

  private levelConfig(level: 'EASY' | 'MEDIUM' | 'HARD'): {
    maxLength: number;
  } {
    switch (level) {
      case 'EASY':
        return {maxLength: 2};
      case 'MEDIUM':
        return {maxLength: 4};
      case 'HARD':
        return {maxLength: 7};
    }
  }

  getRandomValueWithBias<T>(
    previousValue: T,
    values: T[],
    minBias = 0.25,
    maxBias = 0.5
  ): number {
    // Ensure the values array has more than one element
    if (values.length <= 1) {
      throw new Error('Values array must contain more than one element');
    }

    // Ensure the bias values are within the valid range
    if (minBias < 0 || maxBias > 1 || minBias > maxBias) {
      throw new Error(
        'Bias values must be between 0 and 1, and minBias must be less than or equal to maxBias'
      );
    }

    // Generate a random number between 0 and 1
    const random = Math.random();

    // Determine the threshold for selecting the same value based on the provided bias
    const threshold = minBias + Math.random() * (maxBias - minBias);

    // Find the index of the previous value
    const previousIndex = values.indexOf(previousValue);

    // If the random number is less than the threshold, return the index of the previous value
    if (random < threshold) {
      return previousIndex;
    }

    // Otherwise, select a different random index from the list
    let newIndex: number;
    do {
      newIndex = Math.floor(Math.random() * values.length);
    } while (newIndex === previousIndex);

    return newIndex;
  }
}
