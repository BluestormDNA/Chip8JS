var chip8 = new Chip8;
var fileInput = document.getElementById('fileInput');
var lastRender = 0
var debug = false;
var canvas = document.getElementById("canvas")
var ctx = canvas.getContext("2d")
ctx.fillStyle = "white"

fileInput.addEventListener('change', function (e) {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    let rom = new Uint8Array(reader.result);
    chip8 = new Chip8();
    chip8.loadRom(rom);
    window.requestAnimationFrame(loop)
  }
  reader.readAsArrayBuffer(file);
});

function update(progress) {
  for (let i = 0; i < 9; i++) {
    chip8.run();
  }
  chip8.updateTimers();
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
  var progress = timestamp - lastRender
  update(progress)
  draw()

  if (debug) {
    showRegisters();
  }

  function showRegisters() {
    let regText = document.getElementById("registers")
    regText.innerHTML = `PC ${chip8.pc}<br>
                        Opcode ${chip8.opcode.toString(16)}<br>
                        SP ${chip8.stackPointer}<br>
                        I ${chip8.I}<br>
                        DelayTimer<br>
                        SoundTimer`
  }

  lastRender = timestamp
  window.requestAnimationFrame(loop)
}
