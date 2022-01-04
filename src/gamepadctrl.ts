import { base_gamepad, snes_gamepad } from "./pad";


/**
 * @internal
 * Types for hnadling events
 * 
 */
type EventCallback<T> = (sender: any, event: T) => void;

/**
 * List of all Events the creates
 * 
 * All events that created
 * use it like so
 * ```js
 * var controller = new gamepadctrl();
 * controller.on('button:up', (_, args) => {
 *   if (args.button == "X") playaDiv.style.backgroundColor = 'blue';
 * }
 * ```
 * @public
 */
export interface gamepad_event {
  'pad:connected': {
    padnumber: number
  },
  'pad:disconnected': {
    padnumber: number
  },
  'button:down': {
    padnumber: number,
    button: any
  },
  'button:up': {
    padnumber: number,
    button: any
  }
}


class controllerfactory {
  /**
   * factory for create a pad by type
   * @param type name of the type to create
   * @param pad the current system gamepad
   * @returns a new symolo.pad
   */
  public static getPadByType(type: string, pad: Gamepad, controller: gamepadctrl): base_gamepad {
    if (type == "snes") return new snes_gamepad(controller, pad);
    throw "pad type: " + type + " not registred";
  }
}

/**
 * class for manage pads 
 * dont forget to call unload if nessesary 
 * ```js
 * var controller = new gamepadctrl();
 * controller.unload();
 * controller = null;
 * ```
 * @public
 */
export class gamepadctrl {

  static isAvailable(): boolean { return !!navigator.getGamepads() }

  private _padtype: string = "snes";

  private _padList: Array<base_gamepad>;

  public isActive: boolean = false;

  constructor() {
    this._padList = new Array<base_gamepad>();

    window.addEventListener('gamepadconnected', (e: GamepadEventInit) => {
      // console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
      //   e.gamepad.index, e.gamepad.id,
      //   e.gamepad.buttons.length, e.gamepad.axes.length);

      const padToAdd = controllerfactory.getPadByType(this._padtype, e.gamepad, this as unknown as gamepadctrl);
      this._padList.push(padToAdd);
    });
    window.addEventListener('gamepaddisconnected', (e: GamepadEventInit) => {
      // console.log("Gamepad disconnected at index %d: %s. %d buttons, %d axes.",
      //   e.gamepad.index, e.gamepad.id,
      //   e.gamepad.buttons.length, e.gamepad.axes.length);
      const toRemove = this._padList.find(i => i.index == e.gamepad.index);
      if (toRemove)
        this._padList.splice(this._padList.indexOf(toRemove));
    });

    this.isActive = true;
    this.gamepadLoop();
  }

  public unload(): void {
    this.isActive = false;
  }

  private gamepadLoop(): void {
    this._padList.forEach(pad => pad.refresh());

    if (this.isActive)
      window.requestAnimationFrame(this.gamepadLoop.bind(this));
  }

  public getStates(): Array<any> {
    const result: Array<any> = [];
    this._padList.forEach(pad => {
      result.push(pad.state());
    });
    return result;
  }
}

class eventhandler<T> {
  private _evtsubs: any;
  private _inevt: { [key: string]: boolean };

  on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): this {
    if (typeof callback === "undefined") debugger;
    if (!this._evtsubs) this._evtsubs = {};
    if (typeof this._evtsubs[event] === "undefined") {
      this._evtsubs[event] = [];
    }
    // avoid duplicate registration
    if (this._evtsubs[event].indexOf(callback) === -1) {
      this._evtsubs[event].push(callback);
    }
    return this; // for chaining
  }

  fire<K extends keyof T>(event: K, args: T[K]): void {
    try {
      if (!this._evtsubs) return;
      if (typeof (this._evtsubs as any)[event] === "undefined") return;
      if (!this._inevt) this._inevt = {};
      if (this._inevt[event as string] === true) return;
      this._inevt[event as string] = true;
      const subscribers = (this._evtsubs as any)[event];
      for (let i = 0; i < subscribers.length; i++) {
        subscribers[i](this, args);
      }
    } catch (exc) {
      throw exc;
    } finally {
      this._inevt[event as string] = false;
    }
  }

  off<K extends keyof gamepad_event>(event: K, callback: EventCallback<K>): void {
    if (typeof (this._evtsubs as any)[event] !== "undefined") {
      (this._evtsubs as any)[event] = (this._evtsubs as any)[event]
        .filter((toFilter: any) => {
          return toFilter !== callback;
        });
    }
  }
}

/** 
* @public
*/
export interface gamepadctrl extends eventhandler<gamepad_event> { }

// Apply the mixins into the base class via
// the JS at runtime
applyMixins(gamepadctrl, [eventhandler]);

// This can live anywhere in your codebase:
function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null)
      );
    });
  });
}

