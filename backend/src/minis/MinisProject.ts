import path from "path";
import fs from "fs";

import { ArduinoCli } from "./ArduinoCli.js";
import type { ProjectCompileData } from "../dto/ProjectCompile.js";

export enum EditMode {
    BLOCKLY = "blockly",
    CPP = "cpp"
};

export interface MinisProjectInfo {
    name: string;
    editMode: EditMode;
    deviceLibUrl : string;
}

export class MinisProject {

    constructor(id: string) {
        this.id = id;
        this.dir = path.join(process.cwd(), "..","data", "projects", id).toString();
        this.containerDir = path.join("/data/projects", id).toString();
        this.sketchDir = path.join(this.dir, "sketches").toString();
        this.containerSketchesDir = path.join(this.containerDir, "sketches").toString();
        this.infoPath = path.join(this.dir, "MinisProject.json").toString();
        this.info = this.loadInfo();
        //this.sketchBlocklyPath = path.join(this.dir, "sketch.blockly").toString();
        this.inputSketchCppPath = path.join(this.dir, id + ".ino").toString();
        this.containerInputSketchCppPath = path.join(this.containerDir, id + ".ino").toString();
        this.containerCustomConfigPath = path.join(this.containerDir, "custom-config.yaml").toString();
        this.containerOutputDir = path.join(this.containerDir, "output").toString();
        this.containerHexFilePath = path.join(this.containerOutputDir, this.id + ".ino.hex").toString();
        this.outputDir = path.join(this.dir, "output").toString();
        this.hexFilePath = path.join(this.outputDir, this.id + ".ino.hex").toString();
    }

    public getId() : string {
        return this.id;
    }

    public getInfo() : MinisProjectInfo {
        return this.info;
    }

    public getDir() : string {
        return this.dir;
    }

    private loadInfo() : MinisProjectInfo {
        const info = fs.readFileSync(this.infoPath, "utf8");
        return JSON.parse(info);
    }

    public loadSketch(name : string) : string  | undefined{
        let sketchPath = path.join(this.sketchDir, name).toString();
        if (!fs.existsSync(sketchPath)) {
            return undefined;
        }
        return fs.readFileSync(sketchPath, "utf8");
    }

    public saveSketch(name : string, sketchSrc: string) {
        let sketchPath = path.join(this.sketchDir, name).toString();
        fs.writeFileSync(sketchPath, sketchSrc);
    }

    public loadSketchCpp() : string | undefined {
        if (!fs.existsSync( this.inputSketchCppPath)) {
            return undefined;
        }
        return fs.readFileSync(this.inputSketchCppPath, "utf8");
    }

    public saveSketchCpp(sketch: string) {
        fs.writeFileSync(this.inputSketchCppPath, sketch);
    }

    public getSketchList() : string[] {
        let result : string[] = [];
        for (let file of fs.readdirSync(this.sketchDir)) {
            result.push(file);
        }
        return result;
    }

    public getHexFilePath() : string {
        return this.hexFilePath;
    }

    public compile(compileData : ProjectCompileData) : number {
        if (compileData.sketchBlocklySrc) {
            this.saveSketch(compileData.sketchName, compileData.sketchBlocklySrc);
        } else {
            this.saveSketch(compileData.sketchName, compileData.sketchCppSrc);
        }

        this.saveSketchCpp(compileData.sketchCppSrc);
        
        return ArduinoCli.compile(this.containerInputSketchCppPath, this.containerCustomConfigPath, this.containerOutputDir);
    }

    private info : MinisProjectInfo;
    private id : string;
    private dir : string;
    private containerDir : string;
    private sketchDir : string;
    private containerSketchesDir : string;
    private infoPath : string;
    //private sketchBlocklyPath : string;
    private inputSketchCppPath : string;
    private containerInputSketchCppPath : string;
    private containerCustomConfigPath : string;
    private containerOutputDir : string;
    private containerHexFilePath : string;
    private outputDir : string;
    private hexFilePath : string;
}