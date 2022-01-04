import { gamepadctrl } from "../gamepadctrl";

function runtest() {

  const playaGround = document.createElement('div');
  playaGround.id = 'playground';
  playaGround.setAttribute("style", "position: absolute;top:10px; left:10px; border:1px solid black; height:210px;width:210px;");

  const playaDiv = document.createElement('div');
  playaDiv.id = 'playa';
  playaDiv.setAttribute("style", "position: absolute;top:10px; left:10px; background-color: green; height:10px;width:10px;");

  playaGround.appendChild(playaDiv);
  document.body.appendChild(playaGround);


  if (playaDiv) {
    console.log("controller are available?", gamepadctrl.isAvailable() ? "yes" : "no");

    var controller = new gamepadctrl();

    controller
      .on('button:up', (_, args) => {
        if (args.button == "X") playaDiv.style.backgroundColor = 'blue';
        if (args.button == "Y") playaDiv.style.backgroundColor = 'green';
        if (args.button == "A") playaDiv.style.backgroundColor = 'red';
        if (args.button == "B") playaDiv.style.backgroundColor = 'yellow';
      })
      .on('button:down', (_, args) => {
        console.log(args);
      });

    const myGameLoop = () => {
      let states = controller.getStates();

      if (states[0]) {
        let currentPos = { x: parseInt(playaDiv.style.left), y: parseInt(playaDiv.style.top) };
        let nextPos = { x: currentPos.x, y: currentPos.y };

        if (states[0].Up) nextPos.y -= 1;
        if (states[0].Down) nextPos.y += 1;
        if (states[0].Left) nextPos.x -= 1;
        if (states[0].Right) nextPos.x += 1;

        if (
          nextPos.x > 0 && nextPos.x < 200 &&
          nextPos.y > 0 && nextPos.y < 200
        ) {
          playaDiv.style.left = nextPos.x + "px";
          playaDiv.style.top = nextPos.y + "px";
        }
      }

      window.requestAnimationFrame(myGameLoop);
    }

    myGameLoop();
  }
};

runtest();