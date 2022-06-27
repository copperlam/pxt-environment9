/**
 * Custom blocks
 */
//% weight=90 color=#ff7a4b icon="\uf8f6" block="Environment"
namespace Environment {


    export enum DHT11Type {
        //% block="temperature(℃)" enumval=0
        DHT11_temperature_C,

        //% block="temperature(℉)" enumval=1
        DHT11_temperature_F,

        //% block="humidity(0~100)" enumval=2
        DHT11_humidity,
    }
    /**
     * get dht11 temperature and humidity Value
     * @param dht11pin describe parameter here, eg: DigitalPin.P15     */
    //% advanced=true
    //% blockId="readdht11" block="value of dht11 %dht11type| at pin %dht11pin"
    export function temperature(dht11type: DHT11Type, dht11pin: DigitalPin): number {
        pins.digitalWritePin(dht11pin, 0)
        basic.pause(18)
        let i = pins.digitalReadPin(dht11pin)
        pins.setPull(dht11pin, PinPullMode.PullUp);

        while (pins.digitalReadPin(dht11pin) == 1);
        while (pins.digitalReadPin(dht11pin) == 0);
        while (pins.digitalReadPin(dht11pin) == 1);

        let value = 0;
        let counter = 0;
        let error = 0;

        for (let i = 0; i <= 32 - 1; i++) {
            while (pins.digitalReadPin(dht11pin) == 0) {
                //check if the wait is too long, 1000 is arbituary
                counter++;
                if (counter == 1000) {
                    error = 1;
                }
            }
            counter = 0
            while (pins.digitalReadPin(dht11pin) == 1) {
                counter += 1;
            }
            if (counter > 3) {
                value = value + (1 << (31 - i));
                //check if the wait is too long, 1000 is arbituary
                if (counter >= 1000) {
                    error = 2;
                }
            }
        }
        if (error == 1) {
            return 1001;
        }
        else if (error == 2) {
            return 1002;
        }
        else {
            switch (dht11type) {
                case 0:
                    return (value & 0x0000ff00) >> 8
                    break;
                case 1:
                    return ((value & 0x0000ff00) >> 8) * 9 / 5 + 32
                    break;
                case 2:
                    return value >> 24
                    break;
                default:
                    return 0;
            }
        }