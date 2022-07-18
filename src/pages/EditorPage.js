import React, { useState } from "react";

import CodeEditor from "../components/editor/CodeEditor";
import TextEditor from "../components/editor/TextEditor";

import classes from "./EditorPage.module.css";

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  return (
    <>
      <div className={classes.body}>
        <div className={classes.codeEditor}>
          <CodeEditor id="codeEditor" fullHeight={true} />
        </div>
        <div className={classes.ioEditor}>
          <div className={classes.inputEditor}>
            <TextEditor id="inputEditor" />
          </div>
          <div className={classes.outputEditor}>
            <TextEditor id="outputEditor" />
          </div>
        </div>
      </div>
      <div className={classes.footer}>
        <button className={`${classes.btn} ${classes.copyBtn}`}>
          Copy Room ID
        </button>
        <button className={`${classes.btn} ${classes.leaveBtn}`}>Leave</button>
      </div>
    </>
  );
};

export default EditorPage;
