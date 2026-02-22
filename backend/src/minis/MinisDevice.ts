import { MinisBoardList, type MinisBoardInfo } from "./MinisBoard.js";
import { MinisProject } from "./MinisProject.js";
import fs from "fs";

export interface MinisDeviceLibInfo {
    name : string;
    version : string;
    url : string;
}

export interface MinisDeviceInfo {
    name : string;
    version : string;
    url : string;
    board : string;
    libs : MinisDeviceLibInfo[];
}

export class MinisDevice {

    constructor(minisProject : MinisProject) {
        this.info = this.loadInfo(minisProject);
        let boardInfo : MinisBoardInfo | undefined = MinisBoardList.find(board => board.name === this.info.board);
        if (!boardInfo) {
            throw new Error("Board not found");
        }
        this.boardInfo = boardInfo;
    }

    private loadInfo(minisProject : MinisProject) : MinisDeviceInfo {
        const info = fs.readFileSync(minisProject.path.hostDeviceInfoPath, "utf8");
        return JSON.parse(info);
    }

    readonly info : MinisDeviceInfo;
    readonly boardInfo : MinisBoardInfo;
}