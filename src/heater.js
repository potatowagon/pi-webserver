const Gpio = require('onoff').Gpio;

class Heater { 
    constructor() {
        this.heater = new Gpio(26, 'out');
        this.on = true;
    }
    switchOn() {
        this.heater.writeSync(0);
        this.on = true;
    }
    switchOff() {
        this.heater.writeSync(1);
        this.on = false;
    }
}

module.exports = Heater;