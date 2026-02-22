export class MinisBlockly {

    constructor() {

    }

    public init(blocklyDiv : any) {
        this.blockly.Blocks['test_call'] = {
            init: function() {
              this.appendValueInput("NAME")
                  .setCheck("String")
                  .appendField("wywołaj playSound z nazwą");
              
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              this.setColour(230);
              this.setTooltip("Wywołuje wbudowaną funkcję playSound");
            }
          };
    
          this.blockly.Blocks['test_call2'] = {
            init: function() {
              this.appendValueInput("NAME")
                  .setCheck("String")
                  .appendField("wywołaj playSound z nazwą");
              
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              this.setColour(230);
              this.setTooltip("Wywołuje wbudowaną funkcję playSound");
            }
          };
    
          this.blockly.Blocks['test_call3'] = {
            init: function() {
              this.appendValueInput("NAME")
                  .setCheck("String")
                  .appendField("wywołaj playSound z nazwą");
              
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              this.setColour(230);
              this.setTooltip("Wywołuje wbudowaną funkcję playSound");
            }
          };
    
          this.blockly.Blocks['test_call4'] = {
            init: function() {
              this.appendValueInput("NAME")
                  .setCheck("String")
                  .appendField("wywołaj playSound z nazwą");
              
              this.setPreviousStatement(true);
              this.setNextStatement(true);
              this.setColour(230);
              this.setTooltip("Wywołuje wbudowaną funkcję playSound");
            }
          };
    
          //const Blockly = window.Blockly; // twoja zmodyfikowana wersja
          //Ardublockly.initLanguage();
    
          this.xmlTree = this.blockly.Xml.textToDom(this.TOOLBOX_XML);
    
          //workspaceRef.current =
          this.workspace = this.blockly.inject(blocklyDiv.current, {
            collapse: true,
            comments: true,
            css: true,
            disable: true,
            grid: false,
            maxBlocks: Infinity,
            //media: blocklyPath + '/media/',
            rtl: false,
            scrollbars: true,
            //sounds: true,
            sounds: false,
            toolbox: this.xmlTree,
            trashcan: true,
            zoom: {
              controls: true,
              wheel: false,
              startScale: 1.0,
              maxScale: 2,
              minScale: 0.2,
              scaleSpeed: 1.2
            }
          });

          console.log("Boards: " + this.getBlocklyArduinoBoards().join(", "));
          console.log("Selected board: " + this.getBlocklyArduinoBoard());
          this.changeBlocklyArduinoBoard("esp8266_wemos_d1");
    }

    public setBlockly(blockly: any) {
        this.blockly = blockly;
    }

    public getBlockly() : any{
        return this.blockly;
    }

    public dispose() {
        this.workspace.dispose();
    }

    public generateCode() : string {
        return this.blockly.Arduino.workspaceToCode(this.workspace);
    }

    public generateXml()  : string{
        var xmlDom = this.blockly.Xml.workspaceToDom(this.workspace);
        return this.blockly.Xml.domToPrettyText(xmlDom);
    }

    public loadFromXml(blocksXml : string) : boolean {
        var xmlDom = null;
        try {
            xmlDom = this.blockly.Xml.textToDom(blocksXml);
        } catch (e) {
            return false;
        }
        this.workspace.clear();
        var sucess = false;
        if (xmlDom) {
            sucess = this.loadBlocksfromXmlDom(xmlDom);
        }
        return sucess;
    }

    public changeBlocklyArduinoBoard(newBoard : string) {
      if (this.blockly.Arduino.Boards.selected !== this.blockly.Arduino.Boards[newBoard]) {
        this.blockly.Arduino.Boards.changeBoard(this.workspace, newBoard);
      }
    };

    public getBlocklyArduinoBoard() : string {
        return this.blockly.Arduino.Boards.selected;
    };

    public getBlocklyArduinoBoards() : string[] {
        return Object.keys(this.blockly.Arduino.Boards.profiles);
    };

    private loadBlocksfromXmlDom(blocksXmlDom : any) : boolean {
        try {
            this.blockly.Xml.domToWorkspace(blocksXmlDom, this.workspace);
        } catch (e) {
          return false;
        }
        return true;
      };

    private blockly : any = null;
    private workspace : any = null;
    private xmlTree : any = null;

    private readonly TOOLBOX_XML =
'<xml>' +
'  <sep></sep>' +
'  <category id="catLogic" name="Logic">' +
'    <block type="controls_if"></block>' +
'    <block type="logic_compare"></block>' +
'    <block type="logic_operation"></block>' +
'    <block type="logic_negate"></block>' +
'    <block type="logic_boolean"></block>' +
'    <block type="logic_null"></block>' +
'    <block type="logic_ternary"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catLoops" name="Loops">' +
'    <block type="controls_repeat_ext">' +
'      <value name="TIMES">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_whileUntil"></block>' +
'    <block type="controls_for">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'      <value name="BY">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="controls_flow_statements"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMath" name="Math">' +
'    <block type="math_number"></block>' +
'    <block type="math_arithmetic"></block>' +
'    <block type="math_single"></block>' +
'    <block type="math_trig"></block>' +
'    <block type="math_constant"></block>' +
'    <block type="math_number_property"></block>' +
'    <block type="math_change">' +
'      <value name="DELTA">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_round"></block>' +
'    <block type="math_modulo"></block>' +
'    <block type="math_constrain">' +
'      <value name="LOW">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="HIGH">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_int">' +
'      <value name="FROM">' +
'        <block type="math_number">' +
'          <field name="NUM">1</field>' +
'        </block>' +
'      </value>' +
'      <value name="TO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="math_random_float"></block>' +
'    <block type="base_map"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catText" name="Text">' +
'    <block type="text"></block>' +
'    <block type="text_join"></block>' +
'    <block type="text_append">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="text_length"></block>' +
'    <block type="text_isEmpty"></block>' +
//'    <!--block type="text_trim"></block Need to update block -->' +
//'    <!--block type="text_print"></block Part of the serial comms -->' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catVariables" name="Variables">' +
'    <block type="variables_get"></block>' +
'    <block type="variables_set"></block>' +
'    <block type="variables_set">' +
'      <value name="VALUE">' +
'        <block type="variables_set_type"></block>' +
'      </value>' +
'    </block>' +
'    <block type="variables_set_type"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catFunctions" name="Functions" custom="PROCEDURE"></category>' +
'  <sep></sep>' +
'  <category id="catInputOutput" name="Input/Output">' +
'    <block type="io_digitalwrite">' +
'      <value name="STATE">' +
'        <block type="io_highlow"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_digitalread"></block>' +
'    <block type="io_builtin_led">' +
'      <value name="STATE">' +
'        <block type="io_highlow"></block>' +
'      </value>' +
'    </block>' +
'    <block type="io_analogwrite"></block>' +
'    <block type="io_analogread"></block>' +
'    <block type="io_highlow"></block>' +
'    <block type="io_pulsein">' +
'      <value name="PULSETYPE">' +
'        <shadow type="io_highlow"></shadow>' +
'      </value>' +
'    </block>' +
'    <block type="io_pulsetimeout">' +
'      <value name="PULSETYPE">' +
'        <shadow type="io_highlow"></shadow>' +
'      </value>' +
'      <value name="TIMEOUT">' +
'        <shadow type="math_number">' +
'          <field name="NUM">100</field>' +
'        </shadow>' +
'      </value>'+
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catTime" name="Time">' +
'    <block type="time_delay">' +
'      <value name="DELAY_TIME_MILI">' +
'        <block type="math_number">' +
'          <field name="NUM">1000</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_delaymicros">' +
'      <value name="DELAY_TIME_MICRO">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="time_millis"></block>' +
'    <block type="time_micros"></block>' +
'    <block type="infinite_loop"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catAudio" name="Audio">' +
'    <block type="io_tone">' +
'      <field name="TONEPIN">0</field>' +
'      <value name="FREQUENCY">' +
'        <shadow type="math_number">' +
'          <field name="NUM">220</field>' +
'        </shadow>' +
'      </value>' +
'    </block>' +
'    <block type="io_notone"></block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catMotors" name="Motors">' +
'    <block type="servo_write">' +
'      <value name="SERVO_ANGLE">' +
'        <block type="math_number">' +
'          <field name="NUM">90</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="servo_read"></block>' +
'    <block type="stepper_config">' +
'      <field name="STEPPER_NUMBER_OF_PINS">2</field>' +
'      <field name="STEPPER_PIN1">1</field>' +
'      <field name="STEPPER_PIN2">2</field>' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">100</field>' +
'        </block>' +
'      </value>' +
'      <value name="STEPPER_SPEED">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'    <block type="stepper_step">' +
'      <value name="STEPPER_STEPS">' +
'        <block type="math_number">' +
'          <field name="NUM">10</field>' +
'        </block>' +
'      </value>' +
'    </block>' +
'  </category>' +
'  <sep></sep>' +
'  <category id="catComms" name="Comms">' +
'    <block type="serial_setup"></block>' +
'    <block type="serial_print"></block>' +
'    <block type="text_prompt_ext">' +
'      <value name="TEXT">' +
'        <block type="text"></block>' +
'      </value>' +
'    </block>' +
'    <block type="spi_setup"></block>' +
'    <block type="spi_transfer"></block>' +
'    <block type="spi_transfer_return"></block>' +
'  </category>' +
'  <category id="catMyBlocks" name="My Blocks">' +
'    <block type="test_call"></block>' +
'    <block type="test_call2"></block>' +
'    <block type="test_call3"></block>' +
'    <block type="test_call4"></block>' +
'  </category>' +
'</xml>';
}

