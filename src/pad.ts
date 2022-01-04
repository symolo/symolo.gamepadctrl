import { gamepadctrl } from "./gamepadctrl";

/**
 * @private
 * @abstract
 * baseclass for all pads
 */
 export abstract class base_gamepad {

  protected _controller: gamepadctrl;
  public get controller(): gamepadctrl { return this._controller; }

  private _index: number;
  public get index(): number {
    return this._index;
  }

  constructor(controller: gamepadctrl, pad: Gamepad) {
    this._controller = controller;
    this._index = pad.index;
  }

  public refresh(): void {

  }

  public state(): any {
    return {};
  }
}

/**
 * @public
 * simple implementation of an snes controller
 */
export class snes_gamepad extends base_gamepad {

  private _A: boolean = false;
  public get A(): boolean { return this._A; }
  private set A(v: boolean) { if (this._A != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "A" }); this._A = v; }

  private _B: boolean = false;
  public get B(): boolean { return this._B; }
  private set B(v: boolean) { if (this._B != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "B" }); this._B = v; }

  private _X: boolean = false;
  public get X(): boolean { return this._X; }
  private set X(v: boolean) { if (this._X != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "X" }); this._X = v; }

  private _Y: boolean = false;
  public get Y(): boolean { return this._Y; }
  private set Y(v: boolean) { if (this._Y != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Y" }); this._Y = v; }

  private _Start: boolean = false;
  public get Start(): boolean { return this._Start; }
  private set Start(v: boolean) { if (this._Start != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Start" }); this._Start = v; }

  private _Select: boolean = false;
  public get Select(): boolean { return this._Select; }
  private set Select(v: boolean) { if (this._Select != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Select" }); this._Select = v; }

  private _Up: boolean = false;
  public get Up(): boolean { return this._Up; }
  private set Up(v: boolean) { if (this._Up != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Up" }); this._Up = v; }

  private _Down: boolean = false;
  public get Down(): boolean { return this._Down; }
  private set Down(v: boolean) { if (this._Down != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Down" }); this._Down = v; }

  private _Left: boolean = false;
  public get Left(): boolean { return this._Left; }
  private set Left(v: boolean) { if (this._Left != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Left" }); this._Left = v; }

  private _Right: boolean = false;
  public get Right(): boolean { return this._Right; }
  private set Right(v: boolean) { if (this._Right != v) this.controller.fire(v ? 'button:down' : 'button:up', { padnumber: this.index, button: "Right" }); this._Right = v; }

  public refresh(): void {
    const state = navigator.getGamepads()[this.index];
    if (state) {
      this.X = state.buttons[0].pressed;
      this.A = state.buttons[1].pressed;
      this.B = state.buttons[2].pressed;
      this.Y = state.buttons[3].pressed;

      this.Start = state.buttons[9].pressed;
      this.Select = state.buttons[8].pressed;

      this.Up = (state.axes[1] == -1);
      this.Right = (state.axes[0] == 1);
      this.Down = (state.axes[1] == 1);
      this.Left = (state.axes[0] == -1);
    }
  }

  public state(): any {
    return {
      A: this._A,
      B: this._B,
      X: this._X,
      Y: this._Y,
      Start: this._Start,
      Select: this._Select,
      Up: this._Up,
      Right: this._Right,
      Down: this._Down,
      Left: this._Left
    };
  }
}