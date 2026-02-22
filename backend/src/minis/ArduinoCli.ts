import { execSync, spawnSync } from "child_process";

import { Minis } from "./Minis.js";
import { MinisProject } from "./MinisProject.js";

export interface ArduinoCli {
    compile(project : MinisProject): number;
    getComList(): string[];
    upload(port: string, project : MinisProject): number;
}

export class ArduinoCliStandalone implements ArduinoCli {

    compile(project : MinisProject): number {
        const inputSketchPath = project.path.hostInputSketchCppPath
        const customConfigPath = project.path.hostCustomConfigPath;
        const outputDir = project.path.hostOutputDir;
        let cmd = `${Minis.getInstance().getConfig().arduinoCliStandalonePath} compile -b ${project.device.boardInfo.arduino_fqbn} ${inputSketchPath} -v --config-file ${customConfigPath} --output-dir ${outputDir}`;
        
        console.log("cmd: " + cmd);

        try {
            const result = execSync(cmd, { encoding: 'utf-8' });
            return 0; // Sukces
        } catch (error: any) {
            // error.status zawiera kod wyjścia
            return error.status || 1;
        }
    }

    getComList(): string[] {
        let cmd = `${Minis.getInstance().getConfig().arduinoCliStandalonePath} board list`;
        const resultCmd = execSync(cmd, { encoding: 'utf-8' });
        let result : string[] = [];
        for (let line of resultCmd.split('\n')) {
            let com : string | undefined = line.split(' ')[0];
            if (com) {
                result.push(com);
            }
        }
        return result;
    }

    upload(port: string, project : MinisProject): number {
        const inputDir = project.path.hostOutputDir;
        const projectDir = project.path.hostDir;
        let cmd = `${Minis.getInstance().getConfig().arduinoCliStandalonePath} upload --fqbn ${project.device.boardInfo.arduino_fqbn} -p ${ port} --input-dir ${inputDir} ${projectDir}`;
        try {
            const resultCmd = execSync(cmd, { encoding: 'utf-8' });
            return 0;
        } catch (error: any) {
            return error.status || 1;
        }
    }
}

export class ArduinoCliDocker implements ArduinoCli {

    // Metoda 1: Używając execSync z try-catch (rzuca wyjątek przy niezerowym kodzie)
    // w projectDir musi byc plik dirName.ino
    public compile(project : MinisProject): number {
        const inputSketchPath = project.path.containerInputSketchCppPath;
        const customConfigPath = project.path.containerCustomConfigPath
        const outputDir = project.path.containerOutputDir;
        let cmd = `docker exec arduino-cli-container arduino-cli compile -b ${project.device.boardInfo.arduino_fqbn} ${inputSketchPath} -v --config-file ${customConfigPath} --output-dir ${outputDir}`;
        
        console.log("cmd: " + cmd);

        try {
            const result = execSync(cmd, { encoding: 'utf-8' });
            return 0; // Sukces
        } catch (error: any) {
            // error.status zawiera kod wyjścia
            return error.status || 1;
        }
    }

    getComList(): string[] {
        return [];
    }

    upload(port: string, project : MinisProject): number {
        //const inputDir
        //const projectDir
        console.log("upload not implemented");
        return 1;
    }

    /*
    // Metoda 2: Używając spawnSync (lepsze, bo nie rzuca wyjątku)
    public static compileWithSpawn(sketchPath: string, customConfigPath: string, outputDir: string): { exitCode: number; stdout: string; stderr: string } {
        const args = [
            'exec',
            'arduino-cli-container',
            'arduino-cli',
            'compile',
            '-b',
            'arduino:avr:uno',
            sketchPath,
            '-v',
            '--config-file',
            customConfigPath,
            '--output-dir',
            outputDir
        ];

        const result = spawnSync('docker', args, {
            encoding: 'utf-8',
            stdio: 'pipe'
        });

        return {
            exitCode: result.status ?? 1,
            stdout: result.stdout?.toString() || '',
            stderr: result.stderr?.toString() || ''
        };
    }

    // Metoda 3: execSync z opcją nie rzucającą wyjątku
    public static compileSafe(sketchPath: string, customConfigPath: string, outputDir: string): { exitCode: number; output: string } {
        let cmd = `docker exec arduino-cli-container arduino-cli compile -b arduino:avr:uno ${sketchPath} -v --config-file ${customConfigPath} --output-dir ${outputDir}`;
        
        try {
            const output = execSync(cmd, { 
                encoding: 'utf-8',
                stdio: 'pipe'
            });
            return { exitCode: 0, output: output.toString() };
        } catch (error: any) {
            return { 
                exitCode: error.status || 1, 
                output: error.stdout?.toString() || error.message || ''
            };
        }
    }
    */
}

