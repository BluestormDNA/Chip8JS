class Chip8 {

    constructor() {
        this.opcode = 0;
        this.pc = 0x200;
        this.stackPointer = 0;
        this.V = new Uint8Array(16);
        this.I = 0;
        this.stack = new Uint16Array(16);
        this.memory = new Uint8Array(4096);
        this.gfx = new Uint8Array(64 * 32);
        this.drawFlag = false;
        this.soundTimer = 0;
        this.delayTimer = 0;
        this.initMemory();
        this.dev = 0
    }

    initMemory() {
        for (let i = 0; i < Chip8.FONTSET.length; i++) {
            this.memory[i] = Chip8.FONTSET[i];
        }
    }

    beep(){
        let sound = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        sound.play();
    }

    loadRom(rom) {
        for (let i = 0; i < rom.length; i++) {
            this.memory[i + 0x200] = rom[i];
        }
    }

    run() {
        this.fetch();
        this.execute();
    }

    fetch() {
        this.opcode = this.memory[this.pc++] << 8 | this.memory[this.pc++];
    }

    execute() {
        switch (this.opcodeHeader()) {
            case 0x0:
                this.execute0x0();
                break;
            case 0x1: //1nnn Flow  goto nnn;  Jumps to address nnn.
                this.pc = this.nnn;
                break;
            case 0x2: //2nnn Flow  *(0xnnn)()  Calls subroutine at nnn. 
                this.stack[this.stackPointer++] = this.pc;
                this.pc = this.nnn;
                break;
            case 0x3: //3XNN Cond  if(Vx==NN)  Skips the next instruction if VX equals NN.
                if (this.V[this.x] == this.kk) {
                    this.pc += 2;
                }
                break;
            case 0x4://4XNN Cond  if(Vx!=NN)  Skips the next instruction if VX doesn't equal NN. (Usually the next instruction is a jump to skip a code block)
                if (this.V[this.x] != this.kk) {
                    this.pc += 2;
                }
                break;
            case 0x5: //5XY0 	Cond 	if(Vx==Vy) 	Skips the next instruction if VX equals VY.
                if (this.V[this.x] == this.V[this.y]) {
                    this.pc += 2;
                }
                break;
            case 0x6://6XNN 	Const 	Vx = NN 	Sets VX to NN. 
                this.V[this.x] = this.kk;
                break;
            case 0x7://7XNN  Const Vx += NN  Adds NN to VX. (Carry flag is not changed)
                this.V[this.x] = (this.V[this.x] + this.kk) & 0xFF;
                break;
            case 0x8:
                this.execute0x8();
                break;
            case 0x9: //9XY0 	Cond 	if(Vx!=Vy) 	Skips the next instruction if VX doesn't equal VY.
                if (this.V[this.x] != this.V[this.y]) {
                    this.pc += 2;
                }
                break;
            case 0xA: //Annn MEM  I = nnn  Sets I to the address nnn. 
                this.I = this.nnn;
                break;
            case 0xB: //Bnnn Flow  PC=V0+nnn  Jumps to the address nnn plus V0. 
                this.pc = this.V[0] + this.nnn;
                break;
            case 0xC: //CXNN Rand  Vx=rand()&NN  Sets VX to the result of a bitwise and operation on a random number (Typically: 0 to 255) and NN. 
                this.V[this.x] = (Math.random() * 256) & this.kk;
                break;
            case 0xD: //DXYN Disp  draw(Vx,Vy,N)  Draws a sprite at coordinate (VX, VY) that has a width of 8 pixels and a height of N pixels. Each row of 8 pixels is read as bit-coded starting from memory location I; I value doesn’t change after the execution of this instruction. As described above, VF is set to 1 if any screen pixels are flipped from set to unset when the sprite is drawn, and to 0 if that doesn’t happen    
                this.V[0xF] = 0;
                for (let line = 0; line < this.n; line++) {
                    for (let bit = 0; bit < 8; bit++) {
                        if ((this.memory[this.I + line] & (0x80 >> bit)) != 0) {
                            let p = ((this.V[this.x] + bit) + ((this.V[this.y] + line) * 64)) % 2048;
                            this.V[0xF] |= (this.gfx[p] == 1) ? 1 : 0;
                            this.gfx[p] ^= 1;
                        }
                    }
                }
                this.drawFlag = true;
                break;
            case 0xE:
                this.execute0xE();
                break;
            case 0xF:
                this.execute0xF();
                break;
            default:
                this.warnUnsupportedOpcode();
        }
    }

    execute0x0() {
        switch (this.opcode & 0xF0FF) {
            case 0x00E0: //00E0 Display  disp_clear()  Clears the screen. 
                this.gfx.fill(0);
                break;
            case 0x00EE: //00EE Flow  return;  Returns from a subroutine. 
                this.pc = this.stack[--this.stackPointer];
                break;
            default: //0nnn This instruction is only used on the old computers on which Chip-8 was originally implemented. It is ignored by modern interpreters.
                this.warnUnsupportedOpcode();
        }
    }

    execute0x8() {
        switch (this.opcode & 0xF00F) {
            case 0x8000: //8XY0 Assign  Vx=Vy  Sets VX to the value of VY. 
                this.V[this.x] = this.V[this.y];
                break;
            case 0x8001: //8XY1 BitOp  Vx=Vx|Vy  Sets VX to VX or VY. (Bitwise OR operation) 
                this.V[this.x] |= this.V[this.y];
                break;
            case 0x8002: //8XY2 BitOp  Vx=Vx&Vy  Sets VX to VX and VY. (Bitwise AND operation) 
                this.V[this.x] &= this.V[this.y];
                break;
            case 0x8003: //8XY3 BitOp  Vx=Vx^Vy  Sets VX to VX xor VY. 
                this.V[this.x] ^= this.V[this.y];
                break;
            case 0x8004: //8XY4 Math  Vx += Vy  Adds VY to VX. VF is set to 1 when there's a carry, and to 0 when there isn't. 
                this.V[0xF] = ((this.V[this.x] + this.V[this.y]) > 255) ? 1 : 0;
                this.V[this.x] = (this.V[this.x] + this.V[this.y]) & 0xFF;
                break;
            case 0x8005: //8XY5 Math  Vx -= Vy  VY is subtracted from VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
                this.V[0xF] = (this.V[this.x] > this.V[this.y]) ? 1 : 0;
                this.V[this.x] = (this.V[this.x] - this.V[this.y]) & 0xFF;
                break;
            case 0x8006: //8XY6 BitOp  Vx>>=1  Stores the least significant bit of VX in VF and then shifts VX to the right by 1.
                this.V[0xF] = this.V[this.x] & 0x1;
                this.V[this.x] >>= 1 & 0xFF;
                break;
            case 0x8007: //8XY7  Math  Vx=Vy-Vx  Sets VX to VY minus VX. VF is set to 0 when there's a borrow, and 1 when there isn't.
                this.V[0xF] = (this.V[this.y] > this.V[this.x]) ? 1 : 0;
                this.V[this.x] = (this.V[this.y] - this.V[this.x]) & 0xFF;
                break;
            case 0x800E: //8XYE BitOp  Vx<<=1  Stores the most significant bit of VX in VF and then shifts VX to the left by 1.
                this.V[0xF] = (this.V[this.x] & 0x80) >> 7;
                this.V[this.x] <<= 1;
                break;
            default:
                this.warnUnsupportedOpcode();
        }
    }

    execute0xE() {
        switch (this.opcode & 0xF0FF) {
            case 0xE09E: //EX9E KeyOp  if(key==Vx)  Skips the next instruction if the key stored in VX is pressed.
                //if (keyboard.getKey == this.V[x]) {
                //    pc += 2;
                //}
                break;
            case 0xE0A1: //EXA1 KeyOp  if(key!=Vx)  Skips the next instruction if the key stored in VX isn't pressed.
                //if (keyboard.getKey != this.V[x]) {
                //    pc += 2;
                //}
                break;
        }
    }

    execute0xF() {
        switch (this.opcode & 0xF0FF) {
            case 0xF007: //FX07 Timer  Vx = get_delay  Sets VX to the value of the delay timer. 
                this.V[this.x] = this.delayTimer;
                break;
            case 0xF00A: //FX0A KeyOp  Vx = get_key  A key press is awaited, and then stored in VX. (Blocking Operation. All instruction halted until next key event)
                ///while (keyboard.getKey == -1) {
                //}
                //this.V[x] = keyboard.getKey;
                break;
            case 0xF015: //FX15 Timer  delay_timer(Vx)  Sets the delay timer to VX. 
                this.delayTimer = this.V[this.x];
                break;
            case 0xF018: //FX18 Sound  sound_timer(Vx)  Sets the sound timer to VX. 
                this.soundTimer = this.V[this.x];
                break;
            case 0xF01E: //FX1E MEM  I +=Vx  Adds VX to I.
                this.I += this.V[this.x];
                break;
            case 0xF029: //FX29 MEM  I=sprite_addr[Vx]  Sets I to the location of the sprite for the character in VX. Characters 0-F (in hexadecimal) are represented by a 4x5 font. 
                this.I = this.V[this.x] * 5;
                break;
            case 0xF033: //FX33 BCD  set_BCD(Vx);  *(I+0)=BCD(3);  *(I+1)=BCD(2);  *(I+2)=BCD(1); Stores the binary-coded decimal representation of VX, with the most significant of three digits at the address in I, the middle digit at I plus 1, and the least significant digit at I plus 2. (In other words, take the decimal representation of VX, place the hundreds digit in memory at location in I, the tens digit at location I+1, and the ones digit at location I+2.)
                this.memory[this.I] = this.V[this.x] / 100;
                this.memory[this.I + 1] = (this.V[this.x] / 10) % 10;
                this.memory[this.I + 2] = this.V[this.x] % 10;
                break;
            case 0xF055: //FX55 	MEM 	reg_dump(Vx,&I) 	Stores V0 to VX (including VX) in memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified. 
                for (let i = 0; i <= this.x; i++) {
                    this.memory[this.I + i] = this.V[0 + i];
                }
                break;
            case 0xF065: //FX65 MEM  reg_load(Vx,&I)  Fills V0 to VX (including VX) with values from memory starting at address I. The offset from I is increased by 1 for each value written, but I itself is left unmodified.
                for (let i = 0; i <= this.x; i++) {
                    this.V[0 + i] = this.memory[this.I + i];
                }
                break;
            default:
                this.warnUnsupportedOpcode();
        }
    }

    updateTimers() {
        this.delayTimer = (this.delayTimer > 0) ? this.delayTimer - 1 : 0
        if(this.soundTimer > 0){
            this.beep();
            this.soundTimer--;
        }
    }

    opcodeHeader() {
        return (this.opcode & 0xF000) >> 12;
    }

    get x() {
        return (this.opcode & 0x0F00) >> 8;
    }

    get y() {
        return (this.opcode & 0x00F0) >> 4;
    }

    get n() {
        return this.opcode & 0x000F;
    }

    get kk() {
        return this.opcode & 0x00FF;
    }

    get nnn() {
        return this.opcode & 0x0FFF;
    }

    static get FONTSET() {
        return [
            0xF0, 0x90, 0x90, 0x90, 0xF0, // 0
            0x20, 0x60, 0x20, 0x20, 0x70, // 1
            0xF0, 0x10, 0xF0, 0x80, 0xF0, // 2
            0xF0, 0x10, 0xF0, 0x10, 0xF0, // 3
            0x90, 0x90, 0xF0, 0x10, 0x10, // 4
            0xF0, 0x80, 0xF0, 0x10, 0xF0, // 5
            0xF0, 0x80, 0xF0, 0x90, 0xF0, // 6
            0xF0, 0x10, 0x20, 0x40, 0x40, // 7
            0xF0, 0x90, 0xF0, 0x90, 0xF0, // 8
            0xF0, 0x90, 0xF0, 0x10, 0xF0, // 9
            0xF0, 0x90, 0xF0, 0x90, 0x90, // A
            0xE0, 0x90, 0xE0, 0x90, 0xE0, // B
            0xF0, 0x80, 0x80, 0x80, 0xF0, // C
            0xE0, 0x90, 0x90, 0x90, 0xE0, // D
            0xF0, 0x80, 0xF0, 0x80, 0xF0, // E
            0xF0, 0x80, 0xF0, 0x80, 0x80  // F
        ];
    }
}