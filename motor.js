const Gpio = require('onoff').Gpio;

class Motor { 
    constructor() {
        this.motor = new Gpio(14, 'out');
    }
    startTurn() {
        console.log("on");
        console.log(this.motor)
        this.motor.writeSync(1);
    }
    stopTurn() {
        console.log("off");
        console.log(this.motor)
        this.motor.writeSync(0);
    }
}

module.exports = Motor;