# symolo.gamepadctrl

simple lib for using a gamepad

## using it

### simple webpage

```html
<script src='../dist/gamepadctrl.js'></script>
<script>
  var controller = new gamepadctrl();
  ...    
</script>
```

### typescript

```ts
import { gamepadctrl } from "./gamepadctrl";
...
let controller = new gamepadctrl();

```

## gamepadctrl

### properties

type | name | returns | description
--- | --- | --- | ---
`static` | isAvailable | boolean | is the gamepadcontroller available
`public` | isActive | boolean | pad will be watched

```js
console.log("controller are available?", gamepadctrl.isAvailable() ? "yes" : "no");
```

### methods

Signature | Description
--- | ---
`getStates(): any[]` | get the states of all gamepads currently connected
`on<K>(event: K, callback: EventCallback<gamepad_event[K]>): gamepadctrl` | bind an event
`fire<K>(event: K, args: gamepad_event[K]): void` | fire an event
`off<K>(event: K, callback: EventCallback<K>): void` | unbind an event
`unload(): void` | unloads the controller and stop the padwatching

## example

```ts
console.log("controller are available?", gamepadctrl.isAvailable() ? "yes" : "no");

let controller = new gamepadctrl();

controller
  .on('button:up', (_, args) => onsole.log('button:up', args))
  .on('button:down', (_, args) => onsole.log('button:down', args));

const myGameLoop = () => {
  const states = controller.getStates();
  console.log('current states', states);
  window.requestAnimationFrame(myGameLoop);
}

myGameLoop();
```

## building it

first install dependencies:

```sh
npm install
```

testing and development:

```sh
npm test
```

after that browse to: [http://localhost:1234](http://localhost:1234)

to create a production build:

```sh
npm run build
```
