const Gpio = require('onoff').Gpio;

class Motor { 
    constructor() {
        this.motor = new Gpio(14, 'out');
    }
    startTurn() {
        console.log("on");
        this.motor.writeSync(1);
    }
    stopTurn() {
        console.log("off");
        this.motor.writeSync(0);
    }
}

module.exports = Motor;