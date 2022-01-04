/**
 * @internal
 * Types for hnadling events
 *
 */
declare type EventCallback<T> = (sender: any, event: T) => void;

declare class eventhandler<T> {
    private _evtsubs;
    private _inevt;
    on<K extends keyof T>(event: K, callback: EventCallback<T[K]>): this;
    fire<K extends keyof T>(event: K, args: T[K]): void;
    off<K extends keyof gamepad_event>(event: K, callback: EventCallback<K>): void;
}

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
export declare interface gamepad_event {
    'pad:connected': {
        padnumber: number;
    };
    'pad:disconnected': {
        padnumber: number;
    };
    'button:down': {
        padnumber: number;
        button: any;
    };
    'button:up': {
        padnumber: number;
        button: any;
    };
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
export declare class gamepadctrl {
    static isAvailable(): boolean;
    private _padtype;
    private _padList;
    isActive: boolean;
    constructor();
    unload(): void;
    private gamepadLoop;
    getStates(): Array<any>;
}

/**
 * @public
 */
export declare interface gamepadctrl extends eventhandler<gamepad_event> {
}

export { }
