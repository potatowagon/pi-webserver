const Gpio = require('onoff').Gpio;

class Motor { 
    constructor() {
        this.motor = new Gpio(21, 'out');
        this.turning = false;
    }
    startTurn() {
        console.log("on");
        console.log(this.motor.readSync())
        this.motor.writeSync(1);
        console.log(this.motor.readSync())
        this.turning = true;
    }
    stopTurn() {
        console.log("off");
        console.log(this.motor.readSync())
        this.motor.writeSync(0);
        console.log(this.motor.readSync())
        this.turning = false;
    }
}

module.exports = Motor;