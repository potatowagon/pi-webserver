const Gpio = require('onoff').Gpio;

class Torch { 
    constructor() {
        this.torch = new Gpio(20, 'out');
        this.on = false;
    }
    switchOn() {
        this.torch.writeSync(1);
        this.on = true;
    }
    switchOff() {
        this.torch.writeSync(0);
        this.on = false;
    }
}

module.exports = Torch;