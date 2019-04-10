var chip8 = new Chip8;
var fileInput = document.getElementById('fileInput');
var lastRender = 0
const CHIP8_SPEED = 500; //500hz chip8 speed
const TIMER_SPEED = 1/60;  //60hz chip8 timer speed
var timer = 0;
var debug = false;
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
ctx.fillStyle = "white"

fileInput.addEventListener('change', function (e) {
  let file = fileInput.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    let rom = new Uint8Array(reader.result);
    chip8 = new Chip8();
    chip8.loadRom(rom);
    window.requestAnimationFrame(loop)
  }
  reader.readAsArrayBuffer(file);
});

function update(delta) {
  let cycles = delta * CHIP8_SPEED;
  timer += delta;
  for (let i = 0; i < cycles; i++) {
    chip8.run();
  }

  while (timer >= TIMER_SPEED) { //1s elapsed as timers update 60hz
    timer -= TIMER_SPEED;
    chip8.updateTimers();
  }

  showRegisters(delta, cycles, timer);// test delta
}

function draw() {
  if (chip8.drawFlag == false) return;
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 64; x++) {
      if (chip8.gfx[(y * 64) + x] == 0) {
        ctx.clearRect(x * 10, y * 10, 10, 10)
      } else {
        ctx.fillRect(x * 10, y * 10, 10, 10)
      }
    }
  }
  chip8.drawFlag == false;
}

function loop(timestamp) {
  let delta = (timestamp - lastRender) / 1000;
  update(delta)
  draw()

  if (debug) {
    //showRegisters();
  }

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}

function showRegisters(delta, cycles, timer) {
  let regText = document.getElementById("registers")
  regText.innerHTML = `PC ${chip8.pc}<br>
                      Opcode ${chip8.opcode.toString(16)}<br>
                      SP ${chip8.stackPointer}<br>
                      I ${chip8.I}<br>
                      DelayTimer<br>
                      SoundTimer<br>
                      Delta ${delta}<br>
                      cycles ${cycles}<br>
                      timer ${timer}<br>`
}
