import './App.css'
import { Routes, Route, useParams} from 'react-router-dom'
import { Minis } from './Minis';

declare const Blockly: any;
declare const Ardublockly: any;

import { useEffect, useRef } from "react";
import { useState, forwardRef, useImperativeHandle } from "react";

import * as monaco from "monaco-editor";
import Editor, { type OnMount/*, loader , useMonaco*/} from "@monaco-editor/react";

function SketchesList({ data, setVisible }: { data: string[]; setVisible: (visible: boolean) => void }) {
  return (
    <div className="sketches_list_root">
      <h2 style={{ textAlign: 'center' }}>Sketches</h2>
      <div className="sketches_list">
        {data.map((item) => (
          <div key={item} className="sketch_item">
            <a href={`/project/${Minis.getInstance().getProject().getId()}/${item}`}>{item}</a>
          </div>
        ))}
      </div>
      <button style={{ display: 'block', margin: '0 auto', width: '100px', height: '30px' }} onClick={() => {
        setVisible(false);
      }}>Close</button>
    </div>
  );
}

function FlashDialog({ setVisible }: { setVisible: (visible: boolean) => void }) {
  let [isLoading, setIsLoading] = useState(true);
  let [ports, setPorts] = useState<string[]>([]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`http://localhost:3000/arduino-cli/comList`)
      .then(response => response.json())
      .then(data => {
        console.log("data ", data);
        setPorts(data);
      });

    setIsLoading(false);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="loading_model">
        <h1>Loading ...</h1>
      </div>
    );
  }

    return (
      <div className="flash_root">
        <h2 style={{ textAlign: 'center' }}>Flash</h2>
        <label htmlFor="ports">Select port:</label>
        <select id="ports" name="ports">
          <option value="">-- select --</option>
          {ports.map((port) => (
            <option key={port} value={port}>{port}</option>
          ))}
        </select>
        <button style={{ display: 'block', margin: '0 auto', width: '100px', height: '30px' }} onClick={() => {
          setVisible(false);
        }}>Close</button>
        <button style={{ display: 'block', margin: '0 auto', width: '100px', height: '30px' }} onClick={() => {
          //setVisible(false);
          const port = document.getElementById('ports') as HTMLSelectElement;
          console.log("port ", port.value);
          Minis.getInstance().getProject().upload(port.value).then((success) => {
            if (success) {
              console.log("upload successful");
            } else {
              console.log("upload failed");
            }
          });
        }}>Flash</button>
      </div>
    );
  }


interface LoadingModelHandle {
  setIsLoading: (isLoading: boolean) => void;
}

const LoadingModel = forwardRef<LoadingModelHandle>((_props, ref) => {
  const [isLoading, setIsLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    setIsLoading: (loading: boolean) => {
      setIsLoading(loading);
    }
  }));

  return (
    isLoading ? (
      <div className="loading_model">
        <h1>Loading Model</h1>
      </div>
    ) : (
      <></>
    )
  );
});

interface BlocklyEditorHandle {
  setOnLoaded: (onLoaded: () => void) => void;
}


export const BlocklyEditor = forwardRef<BlocklyEditorHandle>((_props, ref) => {
  const blocklyDiv = useRef(null);
  const onLoadedCallbackRef = useRef<(() => void) | null>(null);
  //const workspaceRef = useRef(any);

  useImperativeHandle(ref, () => ({
    setOnLoaded : (onLoaded: () => void) => {
      onLoadedCallbackRef.current = onLoaded;
    }
  }));

  useEffect(() => {
    console.log("init_blockly_editor");
    // 1. dynamiczne ładowanie twoich plików
    const script1 = document.createElement("script");
    script1.src = "http://localhost:4173/ardublockly/blockly/blockly_compressed.js";

    const script0 = document.createElement("script");
    script0.src = "http://localhost:4173/ardublockly/blockly/msg/js/en.js";

    const script2 = document.createElement("script");
    script2.src = "http://localhost:4173/ardublockly/blockly/blocks_compressed.js";

    // jeśli masz więcej:
    const script3 = document.createElement("script");
    script3.src = "http://localhost:4173/ardublockly/blockly/arduino_compressed.js";

    const script4 = document.createElement("script");
    script4.src = "http://localhost:4173/ardublockly/ardublockly/ardublockly_lang.js";

    script1.onload = () => {
      document.body.appendChild(script0);
      script0.onload = () => {
        document.body.appendChild(script2);
        script2.onload = () => {
          document.body.appendChild(script3);
          script3.onload = () => {
            document.body.appendChild(script4);
            script4.onload = () => {
              console.log('script4 loaded');
              // TERAZ dopiero inicjalizujemy Blockly
              initBlockly();
            };
          };
        };
      };
    };

    document.body.appendChild(script1);

    const initBlockly = () => {
      Minis.getInstance().getBlockly().setBlockly(Blockly);
      Minis.getInstance().getBlockly().init(blocklyDiv);
      if (onLoadedCallbackRef.current) {
        onLoadedCallbackRef.current();
      }
      console.log("init_blockly");
    };
    
    return () => {
      Minis.getInstance().getBlockly().dispose();
    };
    
  }, []);

  return (
    <>
      <div ref={blocklyDiv} className="blockly_editor" />
    </>
  )
});

/*
function ProjectPage() {
  const { id, sketch } = useParams<{ id: string; sketch: string }>();
  return (
    <div>
      <h1>Project {id}</h1>
    </div>
  );
}
*/

function ProjectPage() {
  const [loading, setLoading] = useState(true)
  const codeDiv = useRef(null);
  const loadingModelRef = useRef<LoadingModelHandle>(null);
  const blocklyEditorRef = useRef<BlocklyEditorHandle>(null);
  const [visibleSketchesList, setVisibleSketchesList] = useState(false);
  const [visibleFlashDialog, setVisibleFlashDialog] = useState(false);
  const [sketchesData, setSketchesData] = useState<any[]>([]);
  const params = useParams<{ id: string; sketch: string }>();
  const [_editorRef, setEditorRef] = useState<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (!params.id || !params.sketch) {
      return;
    }
    
    Minis.getInstance().createProject(params.id, params.sketch);
    Minis.getInstance().getProject().loadSketch().then((sketch) => {
      if (sketch) {
        setLoading(false);
      }
    });

    console.log("111111");

  }, [params.id, params.sketch]);

  useEffect(() => {
    if (loading) {
      return;
    }

    console.log("222222");

    if (blocklyEditorRef.current) {
      console.log("333333");
      blocklyEditorRef.current.setOnLoaded(() => {
        console.log("444444");
        loadingModelRef.current?.setIsLoading(false);
        Minis.getInstance().getBlockly().loadFromXml(Minis.getInstance().getProject().getSketchSrc() || "");
      });
    }

  }, [loading]);

  if (loading) {
    return (
      <div className="loading_model">
        <h1>Loading ...</h1>
      </div>
    )
  }

  function showSketchesList() {
    fetch(`http://localhost:3000/project/sketch/list/${Minis.getInstance().getProject().getId()}`)
      .then(response => response.json())
      .then(data => {
        console.log("sketchesData ", data);
        setSketchesData(data);
        setVisibleSketchesList(true);
      });
  }

  //const handleMonacoMount: OnMount = (editor : monaco.editor.IStandaloneCodeEditor, monacoInstance : any) => {
  const handleMonacoMount: OnMount = (_editor, monacoInstance) => {
    setEditorRef(_editor);
  
    monacoInstance.editor.defineTheme("my-theme", {
        base: "vs-dark",
        inherit: true,
        rules: [],
        colors: {
            "editor.background": "#1e1e1e"
        }
    });

    //App.instance().monacoEditor.onMount(monacoInstance, editor);

  };

  return (
    
        <div className="app">
          <LoadingModel ref={loadingModelRef} />
          {visibleSketchesList && (
            <SketchesList data={sketchesData} setVisible={setVisibleSketchesList}/>
          )}
          {visibleFlashDialog && (
            <FlashDialog setVisible={setVisibleFlashDialog}/>
          )}
          <div className="header">
            <h1 style={{ display: 'inline' }}>Minis Project</h1>
            <button style={{ display: 'inline' }} onClick={() => {
              let codeCpp = Minis.getInstance().getBlockly().generateCode();
              let codeCppFormatted = codeCpp.replaceAll(" ", "&nbsp;");
              codeCppFormatted = codeCppFormatted.replaceAll("\n", "<br />");
              codeCppFormatted = codeCppFormatted.replaceAll("\t", "&nbsp;&nbsp;&nbsp;&nbsp;");
              if (codeDiv.current) {
                (codeDiv.current as HTMLElement).innerHTML = codeCppFormatted;
              }
              let codeBlockly = Minis.getInstance().getBlockly().generateXml();
              Minis.getInstance().getProject().compile(codeBlockly, codeCpp);
              Minis.getInstance().getProject().getHexFile().then((hexFile) => {
                if (hexFile) {
                  console.log("hexFile ", hexFile);
                }
              });
            }}>Compile</button>
            <button style={{ display: 'inline' }} onClick={() => {
              setVisibleFlashDialog(true);
            }}>Flash</button>
            <button style={{ display: 'inline' }} onClick={() => {
              showSketchesList();
            }}>Sketches</button>

          </div>
          <div className="content">
            <BlocklyEditor ref={blocklyEditorRef}/>
            {/*
            <div ref={codeDiv} className="output">
              tu jest kod<br />
              tu jest kod<br />
            </div>
            */}
            <div className="monaco_editor">
              <Editor onMount={handleMonacoMount} />
            </div>
          </div>
        </div>

  )
}

function MinisPage() {
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/project/list')
      .then(response => response.json())
      .then(data => {
        setProjects(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading_model">
        <h1>Loading ...</h1>
      </div>
    )
  }

  return (
    <div className="app1">
      <h1>Minis</h1>
      <h2>Projects List</h2>
      <ul>
        {projects.map((project) => (
          <li key={project.id}><a href={`/project/${project.id}/${project.defaultSketch}`}>{project.name}</a></li>
        ))}
      </ul>
    </div>
  )
}

function AppRoutes() {
  return (
<Routes>
      <Route path="/" element={
        <MinisPage />
      } />
      <Route path="/project/:id/:sketch" element={
        <ProjectPage />
      } />
    </Routes>
  )
}

export default AppRoutes
