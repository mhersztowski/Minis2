import dotenv from 'dotenv';

export enum ArduinoCliMode {
    STANDALONE = 'STANDALONE',
    DOCKER = 'DOCKER'
}

export class MinisConfig {

    public constructor() {
        dotenv.config();

        if (process.env.DATA_DIR == null) {
            throw new Error('DATA_DIR is not set');
        } else {
            this.dataDir = process.env.DATA_DIR;
        }

        if (process.env.ARDUINO_CLI_MODE == null) {
            throw new Error('DATAARDUINO_CLI_MODE_DIR is not set');
        } else {
            this.arduinoCliMode = process.env.ARDUINO_CLI_MODE;
        }

        if (this.arduinoCliMode == ArduinoCliMode.STANDALONE) {

            if (process.env.ARDUINO_CLI_STANDALONE_PATH == null) {
                throw new Error('ARDUINO_CLI_STANDALONE_PATH is not set');
            } else {
                this.arduinoCliStandalonePath = process.env.ARDUINO_CLI_STANDALONE_PATH;
            }
        }
        this.log();
    }

    public log() {
        console.log("dataDir: " + this.dataDir);
        console.log("arduinoCliMode: " + this.arduinoCliMode);
        console.log("arduinoCliStandalonePath: " + this.arduinoCliStandalonePath);
    }

    public readonly dataDir: string;
    public readonly arduinoCliMode : string;
    public readonly arduinoCliStandalonePath: string = process.env.ARDUINO_CLI_PATH || '';
}