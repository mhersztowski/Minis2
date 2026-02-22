import { MinisProject } from './MinisProject';
import { MinisBlockly } from './MinisBlockly';
import { MinisMonacoEditor } from './MinisMonacoEditor';

export class Minis {

    private constructor() {
        this.minisProject = new MinisProject("project1", "FarbotArduino_3_1.blockly");
        this.minisBlockly = new MinisBlockly();
        this.monaco = new MinisMonacoEditor();
    }

    static getInstance() {
        if (!Minis.instance) {
            Minis.instance = new Minis();
        }
        return Minis.instance;
    }

    public createProject(id : string, sketch : string) {
        this.minisProject = new MinisProject(id, sketch);
    }

    public getBlockly() : MinisBlockly{
        return this.minisBlockly;
    }

    public getProject() : MinisProject {
        return this.minisProject;
    }

    private static instance: Minis;

    private minisProject: MinisProject;
    private minisBlockly: MinisBlockly;

    public readonly monaco: MinisMonacoEditor;
}