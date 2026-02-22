export interface MinisBoardInfo {
    name: string;
    arduino_fqbn: string;
    blockly_board : string;
}

export let MinisBoardList : MinisBoardInfo[] = [
    {
        name: "arduino:avr:uno",
        arduino_fqbn: "arduino:avr:uno",
        blockly_board: "uno"
    },
    {
        name: "arduino:esp8266:wemos_d1_mini_pro",
        arduino_fqbn: "esp8266:esp8266:d1_mini_pro",
        blockly_board: "esp8266_wemos_d1"
    }
];

