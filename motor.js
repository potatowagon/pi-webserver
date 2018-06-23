const Gpio = require('onoff').Gpio;

class Motor { 
    constructor() {
        this.motor = new Gpio(23, 'out');
    }
    startTurn() {
        console.log("on");
        console.log(this.motor.readSync())
        this.motor.writeSync(1);
        console.log(this.motor.readSync())
    }
    stopTurn() {
        console.log("off");
        console.log(this.motor.readSync())
        this.motor.writeSync(0);
        console.log(this.motor.readSync())
    }
}

module.exports = Motor;