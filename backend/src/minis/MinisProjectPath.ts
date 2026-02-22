import path from "path";
import { Minis } from "./Minis.js";

export class MinisProjectPath {

    constructor(id: string, deviceLib : string) {
        this.hostDir = path.join(Minis.getInstance().getConfig().dataDir, "projects", id).toString();
        this.hostSketchDir = path.join(this.hostDir, "sketches").toString();
        this.hostInfoPath = path.join(this.hostDir, "MinisProject.json").toString();
        this.hostInputSketchCppPath = path.join(this.hostDir, id + ".ino").toString();
        this.hostCustomConfigPath = path.join(this.hostDir, "custom-config.yaml").toString();
        this.hostOutputDir = path.join(this.hostDir, "output").toString();
        this.hostHexFilePath = path.join(this.hostOutputDir, id + ".ino.hex").toString();

        this.hostDeviceDir = path.join(this.hostDir, "libraries", deviceLib).toString();
        this.hostDeviceInfoPath = path.join(this.hostDeviceDir, "config", "MinisDevice.json").toString();
        this.hostDeviceBlocklyJs = path.join(this.hostDeviceDir, "config", "Blockly.js").toString();
        this.hostDeviceMonacoJs = path.join(this.hostDeviceDir, "config", "Monaco.js").toString();

        this.containerDir = path.join("/data/projects", id).toString();
        this.containerSketchesDir = path.join(this.containerDir, "sketches").toString();
        this.containerInputSketchCppPath = path.join(this.containerDir, id + ".ino").toString();
        this.containerCustomConfigPath = path.join(this.containerDir, "custom-config.yaml").toString();
        this.containerOutputDir = path.join(this.containerDir, "output").toString();
        this.containerHexFilePath = path.join(this.containerOutputDir, id + ".ino.hex").toString();
    }

    readonly hostDir : string;
    readonly hostSketchDir : string;
    readonly hostInputSketchCppPath : string;
    readonly hostInfoPath : string;
    readonly hostCustomConfigPath : string;
    readonly hostOutputDir : string;
    readonly hostHexFilePath : string;
    readonly hostDeviceDir : string;
    readonly hostDeviceInfoPath : string;
    readonly hostDeviceBlocklyJs : string;
    readonly hostDeviceMonacoJs : string;

    readonly containerDir : string;
    readonly containerSketchesDir : string;
    readonly containerInputSketchCppPath : string;
    readonly containerCustomConfigPath : string;
    readonly containerOutputDir : string;
    readonly containerHexFilePath : string;
}

