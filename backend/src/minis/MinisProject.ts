import path from "path";
import fs from "fs";

import type { ProjectCompileData } from "../dto/ProjectCompile.js";
import { Minis } from "./Minis.js";
import { ArduinoCliMode } from "./MinisConfig.js";
import { MinisProjectPath } from "./MinisProjectPath.js";
import { MinisDevice } from "./MinisDevice.js";


export interface MinisProjectInfo {
    name: string;
    deviceLib : string;
}

export class MinisProject {

    constructor(id: string) {
        this.id = id;
        this.info = this.loadInfo();
        this.path = new MinisProjectPath(id, this.info.deviceLib);
        this.device = new MinisDevice(this);
    }

    public getId() : string {
        return this.id;
    }

    public getDir() : string {
        return this.path.hostDir;
    }

    private loadInfo() : MinisProjectInfo {
        let projectInfoPath = path.join(Minis.getInstance().getConfig().dataDir, "projects", this.id, "MinisProject.json").toString();
        const info = fs.readFileSync(projectInfoPath, "utf8");
        return JSON.parse(info);
    }

    public loadSketch(name : string) : string  | undefined{
        let sketchPath = path.join(this.path.hostSketchDir, name).toString();
        if (!fs.existsSync(sketchPath)) {
            return undefined;
        }
        return fs.readFileSync(sketchPath, "utf8");
    }

    public saveSketch(name : string, sketchSrc: string) {
        let sketchPath = path.join(this.path.hostSketchDir, name).toString();
        fs.writeFileSync(sketchPath, sketchSrc);
    }

    public loadSketchCpp() : string | undefined {
        if (!fs.existsSync( this.path.hostInputSketchCppPath)) {
            return undefined;
        }
        return fs.readFileSync(this.path.hostInputSketchCppPath, "utf8");
    }

    public saveSketchCpp(sketch: string) {
        fs.writeFileSync(this.path.hostInputSketchCppPath, sketch);
    }

    public getSketchList() : string[] {
        let result : string[] = [];
        for (let file of fs.readdirSync(this.path.hostSketchDir)) {
            result.push(file);
        }
        return result;
    }

    public getHexFilePath() : string {
        return this.path.hostHexFilePath;
    }

    public compile(compileData : ProjectCompileData) : number {
        if (compileData.sketchBlocklySrc) {
            this.saveSketch(compileData.sketchName, compileData.sketchBlocklySrc);
        } else {
            this.saveSketch(compileData.sketchName, compileData.sketchCppSrc);
        }

        this.saveSketchCpp(compileData.sketchCppSrc);

        let result : number = 0;
        result = Minis.getInstance().getArduinoCli().compile(this);
        console.log("Compile result: " + result);
        return result;
    }

    public upload(port: string) : number {
        let result : number = 0;
        result = Minis.getInstance().getArduinoCli().upload(port, this);
        console.log("Upload result: " + result);
        return result;
    }

    private id : string;
    readonly info : MinisProjectInfo;
    readonly path : MinisProjectPath;
    readonly device : MinisDevice;
}