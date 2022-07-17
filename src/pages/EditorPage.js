import React, { useState } from "react";

import Editor from "../components/editor/Editor";

import classes from "./EditorPage.module.css";

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  return (
    <>
      <div className={classes.body}>
        <div className={classes.codeEditor}>
          <Editor id="codeEditor" fullHeight={true} />
        </div>
        <div className={classes.ioEditor}>
          <div className={classes.inputEditor}>
            <Editor id="inputEditor" />
          </div>
          <div className={classes.outputEditor}>
            <Editor id="outputEditor" />
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
