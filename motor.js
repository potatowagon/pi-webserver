const Gpio = require('onoff').Gpio;

class Motor { 
    constructor() {
        this.motor = new Gpio(4, 'out');
    }
    startTurn() {
        this.motor.writeSync(1);
    }
    stopTurn() {
        this.motor.writeSync(0);
    }
}

module.exports = Motor;