const Gpio = require('onoff').Gpio;

class Torch { 
    constructor() {
        this.torch = new Gpio(20, 'out');
        this.on = false;
    }
    switchOn() {
        console.log("torch on");
        this.torch.writeSync(1);
        this.on = true;
    }
    switchOff() {
        console.log("torch off");
        this.torch.writeSync(0);
        this.on = false;
    }
}

module.exports = Torch;