import type { ProjectCompileData } from "./dto/ProjectCompile";

export class MinisProject {

    constructor(id :string, sketch : string) {
        this.id = id;
        this.name = "";
        this.sketch = sketch;
    }

    public getId() : string {
        return this.id;
    }

    public getName() : string {
        return this.name;
    }

    public getSketch() : string {
        return this.sketch;
    }

    public async loadSketch() : Promise<boolean> {
        const response = await fetch(`http://localhost:3000/project/sketch/source/${this.id}/${this.sketch}`);
        if (response.ok) {
            this.sketchSrc = await response.text();
            return true;
        }
        return false;
    }

    public getSketchSrc() : string | null {
        return this.sketchSrc;
    }

    public async compile(sketchBlocklySrc : string | null, sketchCppSrc : string) : Promise<boolean> {
        let data : ProjectCompileData = {
            sketchName: this.sketch,
            sketchCppSrc: sketchCppSrc
        };
        if (sketchBlocklySrc) {
            data.sketchBlocklySrc = sketchBlocklySrc;
        }
        const response = await fetch(`http://localhost:3000/project/sketch/compile/${this.id}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            return true;
        }
        return false;
    }

    public async getHexFile() : Promise<Blob | null> {
        const response = await fetch(`http://localhost:3000/project/hexfile/${this.id}`);
        
        if (response.ok) {
            const blob = await response.blob();
            return blob;
        }
        return null;
    }

    private id : string = "";
    private name : string = "";
    private sketch : string = "";
    private sketchSrc : string | null = null;
}