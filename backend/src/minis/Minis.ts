import { MinisProject } from "./MinisProject.js";

export class Minis {
    private constructor() {
        this.projects = [];
    }

    public init() {
        let project = new MinisProject("project1");
        this.projects.push(project);
        //const status = project.compile();
        //console.log("Status compile: " + status.toString());
    }

    public static getInstance() : Minis {
        if (!Minis.instance) {
            Minis.instance = new Minis();
        }
        return Minis.instance;
    }

    public getProjects() : MinisProject[] {
        return this.projects;
    }

    public getProject(id: string) : MinisProject | undefined {
        return this.projects.find(project => project.getId() === id);
    }

    public createProject(id: string) : MinisProject {
        const project = new MinisProject(id);
        this.projects.push(project);
        return project;
    }


    public getProjectList() : any[]{
        let result : any[] = [];

        for (let project of this.projects) {
            result.push({
                id: project.getId(),
                name: project.getInfo().name,
                defaultSketch: project.getSketchList()[0]
            });
        }

        return result;
    }

    private static instance : Minis;

    private projects : MinisProject[];
    
}