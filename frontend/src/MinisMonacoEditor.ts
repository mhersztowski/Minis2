import * as monaco from "monaco-editor";


export class MinisMonacoEditor {

    /*
    constructor() {
        this.editor = null;
    }

    public getEditor() : monaco.editor.IStandaloneCodeEditor | null {
        return this.editor;
    }
    */
    public onMount(monacoInstance : any, editor : monaco.editor.IStandaloneCodeEditor) {
        //this.editor = editor;
        const modelUri = monaco!.Uri.parse(this.modelUri);
        this.model = monaco!.editor.createModel("", this.language, modelUri);
    }

    private language : string = "cpp";
    private modelUri : string = "file:///home/user/file.cpp";
    private model : monaco.editor.ITextModel | null = null;
}